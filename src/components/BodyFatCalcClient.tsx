"use client";

import React, { useState } from "react";

type Gender = "male" | "female";

export default function BodyFatCalcClient() {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculate = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum) || heightNum === 0) {
      setBmi(null);
      setBodyFat(null);
      setCategory("");
      return;
    }

    // BMI Calculation
    const heightM = heightNum / 100;
    const bmiValue = weightNum / (heightM * heightM);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Body Fat Calculation (Deurenberg formula)
    // Men: 1.2 * BMI + 0.23 * Age - 16.2
    // Women: 1.2 * BMI + 0.23 * Age - 5.4
    let bodyFatValue = 0;
    if (gender === "male") {
      bodyFatValue = 1.2 * bmiValue + 0.23 * ageNum - 16.2;
    } else {
      bodyFatValue = 1.2 * bmiValue + 0.23 * ageNum - 5.4;
    }
    
    // Clamp to 0 if negative (unlikely but possible with extreme values)
    bodyFatValue = Math.max(0, bodyFatValue);
    setBodyFat(parseFloat(bodyFatValue.toFixed(1)));

    // Determine Category based on Japan Society for the Study of Obesity (simplified for display)
    // Using the table provided in the prompt for logic
    let cat = "";
    if (gender === "male") {
        if (ageNum < 40) { // 18-39
            if (bodyFatValue <= 10) cat = "やせ";
            else if (bodyFatValue <= 16) cat = "標準(-)";
            else if (bodyFatValue <= 21) cat = "標準(+)";
            else if (bodyFatValue <= 26) cat = "軽肥満";
            else cat = "肥満";
        } else if (ageNum < 60) { // 40-59
            if (bodyFatValue <= 11) cat = "やせ";
            else if (bodyFatValue <= 17) cat = "標準(-)";
            else if (bodyFatValue <= 22) cat = "標準(+)";
            else if (bodyFatValue <= 27) cat = "軽肥満";
            else cat = "肥満";
        } else { // 60+
            if (bodyFatValue <= 13) cat = "やせ";
            else if (bodyFatValue <= 19) cat = "標準(-)";
            else if (bodyFatValue <= 24) cat = "標準(+)";
            else if (bodyFatValue <= 29) cat = "軽肥満";
            else cat = "肥満";
        }
    } else { // Female
        if (ageNum < 40) { // 18-39
            if (bodyFatValue <= 20) cat = "やせ";
            else if (bodyFatValue <= 27) cat = "標準(-)";
            else if (bodyFatValue <= 34) cat = "標準(+)";
            else if (bodyFatValue <= 39) cat = "軽肥満";
            else cat = "肥満";
        } else if (ageNum < 60) { // 40-59
            if (bodyFatValue <= 21) cat = "やせ";
            else if (bodyFatValue <= 28) cat = "標準(-)";
            else if (bodyFatValue <= 35) cat = "標準(+)";
            else if (bodyFatValue <= 40) cat = "軽肥満";
            else cat = "肥満";
        } else { // 60+
            if (bodyFatValue <= 22) cat = "やせ";
            else if (bodyFatValue <= 29) cat = "標準(-)";
            else if (bodyFatValue <= 36) cat = "標準(+)";
            else if (bodyFatValue <= 41) cat = "軽肥満";
            else cat = "肥満";
        }
    }
    setCategory(cat);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">体脂肪率計算ツール</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                className="mr-2"
              />
              男性
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                className="mr-2"
              />
              女性
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="例: 30"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">身長 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="例: 170"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="例: 60"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={calculate}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 font-bold"
      >
        計算する
      </button>

      {bmi !== null && bodyFat !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">計算結果</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">BMI</div>
              <div className="text-2xl font-bold text-blue-600">{bmi}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">推定体脂肪率</div>
              <div className="text-2xl font-bold text-green-600">{bodyFat}%</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-sm text-gray-500">判定目安</div>
              <div className="text-xl font-bold text-purple-600">{category}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ※この結果はDeurenberg式に基づく推定値です。
          </p>
        </div>
      )}
    </div>
  );
}
