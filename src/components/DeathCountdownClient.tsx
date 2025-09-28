"use client";
// 死亡時間カウントダウンツール
// 日本語注釈付き
import React, { useState, useEffect } from "react";

// 2025年日本の平均寿命（厚生労働省推計）
const AVERAGE_LIFE_EXPECTANCY = {
  male: 82.0, // 男性
  female: 88.0, // 女性
};

// 性別オプション
const genderOptions = [
  { value: "female", label: "女性" },
  { value: "male", label: "男性" },
];

// 追加の影響要素（例: 喫煙、運動習慣）
const lifestyleOptions = [
  { value: 0, label: "特になし" },
  { value: -3, label: "喫煙者（-3年）" },
  { value: 2, label: "運動習慣あり（+2年）" },
  { value: -1, label: "過度な飲酒（-1年）" },
];

function calcCountdown(birth: Date, gender: "male" | "female", lifestyle: number) {
  const now = new Date();
  const age = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const life = AVERAGE_LIFE_EXPECTANCY[gender] + lifestyle;
  // 予想死亡時刻（ミリ秒）
  const deathTimestamp = birth.getTime() + life * 365.25 * 24 * 60 * 60 * 1000;
  const remainMillis = Math.max(deathTimestamp - now.getTime(), 0);
  const remainSeconds = Math.floor(remainMillis / 1000);
  const remainHours = Math.floor(remainSeconds / 3600);
  const remainDays = Math.floor(remainSeconds / (3600 * 24));
  const remainWeeks = Math.floor(remainDays / 7);
  const remainYears = remainDays / 365.25;
  return { age, remainYears, remainWeeks, remainDays, remainHours, remainSeconds, deathTimestamp };
}

export default function DeathCountdownClient() {
  // デフォルト値
  const [gender, setGender] = useState<"male" | "female">("female");
  const [birth, setBirth] = useState<string>("1990-01-01");
  const [lifestyle, setLifestyle] = useState<number>(0);
  const [countdown, setCountdown] = useState<ReturnType<typeof calcCountdown> | null>(null);

  // 初回マウント時と依存値変更時にカウントダウンを計算
  useEffect(() => {
    setCountdown(calcCountdown(new Date(birth), gender, lifestyle));
    const timer = setInterval(() => {
      setCountdown(calcCountdown(new Date(birth), gender, lifestyle));
    }, 1000);
    return () => clearInterval(timer);
  }, [birth, gender, lifestyle]);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">死亡時間カウントダウン</h1>
      <p className="text-sm text-gray-600 mb-6">日本の平均寿命をもとに、あなたの残り時間をリアルタイムで表示します。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左：入力フォーム */}
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">性別</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as "male" | "female")}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">生年月日</label>
              <input
                type="date"
                value={birth}
                onChange={e => setBirth(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">生活習慣</label>
              <select
                value={lifestyle}
                onChange={e => setLifestyle(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {lifestyleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 右：结果展示 */}
        <div>
          <div className="bg-gray-50 p-4 rounded-md">
            {countdown ? (
              <>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-gray-500">現在年齢</div>
                    <div className="text-xl font-semibold text-gray-800">{countdown.age.toFixed(2)} 歳</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">残り年数</div>
                    <div className="text-xl font-semibold text-indigo-600">{countdown.remainYears.toFixed(2)} 年</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded shadow-sm text-center">
                    <div className="text-sm text-gray-500">週</div>
                    <div className="text-lg font-medium">{countdown.remainWeeks.toLocaleString()} 週</div>
                  </div>
                  <div className="p-3 bg-white rounded shadow-sm text-center">
                    <div className="text-sm text-gray-500">日</div>
                    <div className="text-lg font-medium">{countdown.remainDays.toLocaleString()} 日</div>
                  </div>
                  <div className="p-3 bg-white rounded shadow-sm text-center">
                    <div className="text-sm text-gray-500">時間</div>
                    <div className="text-lg font-medium">{countdown.remainHours.toLocaleString()} 時間</div>
                  </div>
                  <div className="p-3 bg-white rounded shadow-sm text-center">
                    <div className="text-sm text-gray-500">秒（リアルタイム）</div>
                    <div className="text-2xl font-extrabold text-red-600">{countdown.remainSeconds.toLocaleString()} 秒</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">予想死亡日時</div>
                    <div className="text-sm text-gray-700">{new Date(countdown.deathTimestamp).toLocaleString()}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => navigator.clipboard.writeText(new Date(countdown.deathTimestamp).toString())}
                      className="px-3 py-2 text-sm text-indigo-600 bg-indigo-100 rounded-md"
                    >
                      日時をコピー
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">計算中...</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">2025年の日本の平均寿命について</h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p>2025年の日本人の平均寿命は、女性が約88.0歳、男性が約82.0歳と推計されています（厚生労働省）。これは世界でもトップクラスの長寿国です。</p>
          <p><strong>Q:</strong> 平均寿命は絶対ですか？ <br/><strong>A:</strong> 個人差が大きく、あくまで統計的な目安です。</p>
          <p><strong>Q:</strong> 生活習慣で寿命は変わりますか？ <br/><strong>A:</strong> 喫煙や運動習慣などで数年単位の差が出ることがあります。</p>
          <p><strong>Q:</strong> このツールの結果は正確ですか？ <br/><strong>A:</strong> あくまで参考値です。実際の寿命を保証するものではありません。</p>
        </div>
      </div>
    </div>
  );
}