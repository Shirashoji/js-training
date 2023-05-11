import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart06";
import instruction from "./instruction.md";

const convertData = (input) => {
  const colors = {
    男性: "blue",
    女性: "red",
  };

  const ans = input.map(({ gender, y, x }) => {
    return {
      color: colors[gender],
      gender: gender,
      bmi: x / (y / 100) ** 2,
      weight: x,
      height: y,
    };
  }); // ここを作りましょう！
  // console.log(ans);
  return ans;
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer06"
      convertData={convertData}
      dataUrl="data/size-and-weight.json"
      instruction={instruction}
      title="Lesson 06"
      Chart={Chart}
    />
  );
};

export default Lesson;
