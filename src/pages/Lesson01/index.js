import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart01";
import instruction from "./instruction.md";

const convertData = (input) => {
  // console.log(input); //とりあえず入力を確認
  const ans = input.map(([name, count]) => ({ name, count }));
  console.log(ans);
  return ans;
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer01"
      convertData={convertData}
      dataUrl="data/chs-capacity.json"
      instruction={instruction}
      title="Lesson 01"
      Chart={Chart}
    />
  );
};

export default Lesson;
