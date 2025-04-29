import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const cmp = (v1, v2) => {
  if (v1 === v2) {
    return 0;
  } else if (v1 > v2) {
    return 1;
  } else {
    return -1;
  }
};

const Chart = ({ data }) => {
  const svgRef = useRef(null);
  
  // Sort nodes and links for deterministic layout
  data.nodes.sort((node1, node2) => cmp(node1.id, node2.id));
  data.links.sort((link1, link2) => {
    if (cmp(link1.source, link2.source) === 0) {
      return cmp(link1.target, link2.target);
    } else {
      return cmp(link1.source, link2.source);
    }
  });

  useEffect(() => {
    if (!data || !data.nodes || !data.links || data.nodes.length === 0) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Create a deterministic layout by using node IDs for initial positions
    const nodeById = {};
    
    // Group nodes by color (red/blue)
    const redNodes = data.nodes.filter(node => node.color === "red");
    const blueNodes = data.nodes.filter(node => node.color === "blue");
    
    // Position red nodes in the top right quadrant
    redNodes.forEach((node, i) => {
      const angle = (i / redNodes.length) * Math.PI / 2; // 90 degree arc
      const radius = Math.min(width, height) / 3;
      
      // Set initial positions in a quarter circle in top right
      node.x = width * 0.75 + radius * Math.cos(angle);
      node.y = height * 0.25 + radius * Math.sin(angle);
      
      nodeById[node.id] = node;
    });
    
    // Position blue nodes in the bottom left quadrant
    blueNodes.forEach((node, i) => {
      const angle = (i / blueNodes.length) * Math.PI + Math.PI / 2; // 180 degree arc
      const radius = Math.min(width, height) / 3;
      
      // Set initial positions in a half circle in bottom left
      node.x = width * 0.25 + radius * Math.cos(angle);
      node.y = height * 0.75 + radius * Math.sin(angle);
      
      nodeById[node.id] = node;
    });

    // Process links to use node objects instead of IDs
    const links = data.links.map(link => ({
      source: typeof link.source === 'string' ? nodeById[link.source] : link.source,
      target: typeof link.target === 'string' ? nodeById[link.target] : link.target
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(d => -100 * Math.sqrt(d.radius)))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(d => d.color === "red" ? width * 0.75 : width * 0.25).strength(0.1))
      .force("y", d3.forceY(d => d.color === "red" ? height * 0.25 : height * 0.75).strength(0.1))
      .force("collision", d3.forceCollide().radius(d => d.radius * 1.2));

    // Create links
    const link = svg.append("g")
      .attr("stroke", "gray")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");

    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .call(drag(simulation));

    // Add titles for tooltips
    node.append("title")
      .text(d => d.id);

    // Run simulation for a fixed number of iterations
    simulation.stop();
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    // Update positions
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, [data]);

  return (
    <svg 
      ref={svgRef} 
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
};

export default Chart;
