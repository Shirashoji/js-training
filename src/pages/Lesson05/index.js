import React from "react";
import LessonPage from "../../components/LessonPage";
import Chart from "../../components/Chart05";
import instruction from "./instruction.md";

const convertData = (input) => {
  const genders = Array.from(new Set(input.map(({ gender }) => gender)));
  const min = Math.round(Math.min(...input.map((e) => e.y)));
  const max = Math.round(Math.max(...input.map((e) => e.y)));
  const bins = Array.from({ length: max - min + 1 }).map((_, i) => {
    const obj = { bin: (min + i).toString() }; // bin（身長）を作成．
    for (const gender of genders) {
      // genderは全部0で初期化
      obj[gender] = 0;
    }
    return obj;
  });
  for (const { y, gender } of input) {
    const i = Math.round(y) - min;
    bins[i][gender]++;
  }

  // console.log(bins);
  return bins; // ここを作りましょう！
};

const Lesson = () => {
  return (
    <LessonPage
      answerUrl="/answer05"
      convertData={convertData}
      dataUrl="data/size-and-weight.json"
      instruction={instruction}
      title="Lesson 05"
      Chart={Chart}
    />
  );
};

export default Lesson;
