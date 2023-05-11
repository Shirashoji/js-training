import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart04";
import instruction from "./instruction.md";

const convertData = (input) => {
  const species = Array.from(new Set(input.map((e) => e.species)));
  // console.log(species);
  const ans = species.map((specie) => {
    return {
      id: specie,
      data: input
        .filter((item) => item.species === specie)
        .map(({ sepalLength: x, petalWidth: y }) => ({ x, y })),
    };
  });
  // console.log(ans);
  return ans; // これ全然わからんくて答え見た．
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer04"
      dataUrl="data/iris.json"
      convertData={convertData}
      instruction={instruction}
      title="Lesson 04"
      Chart={Chart}
    />
  );
};

export default Lesson;
