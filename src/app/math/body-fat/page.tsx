import React from "react";
import type { Metadata } from "next";
import BodyFatCalcClient from "@/components/BodyFatCalcClient";
import ShareButtons from "@/components/ShareButtons";
import { BodyFatIcon } from "@/components/MathIcons";

export const metadata: Metadata = {
  title: "体脂肪率計算ツール - BMIと年齢から推定 | MajiTool",
  description: "身長、体重、年齢、性別から体脂肪率を計算する無料ツール。Deurenberg式を使用し、BMIと合わせて健康状態をチェック。日本肥満学会の基準に基づく判定や、健康的な体脂肪率の維持方法も解説。",
  keywords: [
    "体脂肪率計算",
    "体脂肪率",
    "BMI",
    "計算ツール",
    "健康",
    "ダイエット",
    "Deurenberg式"
  ],
  alternates: {
    canonical: 'https://maji-tool.com/math/body-fat'
  },
  openGraph: {
    title: "体脂肪率計算ツール - BMIと年齢から推定",
    description: "身長、体重、年齢、性別から体脂肪率を計算する無料ツール。Deurenberg式を使用し、BMIと合わせて健康状態をチェック。",
    url: "https://maji-tool.com/math/body-fat",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function BodyFatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center mb-6">
        <div className="mb-4 md:mb-0 md:mr-6">
          <BodyFatIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">体脂肪率計算ツール</h1>
          <p className="text-gray-600 mt-2">
            身長、体重、年齢、性別を入力するだけで、BMIと推定体脂肪率を計算できる無料ツールです。
            健康管理やダイエットの目安としてご活用ください。
          </p>
        </div>
      </div>

      <BodyFatCalcClient />

      <ShareButtons title="体脂肪率計算ツール - BMIと年齢から推定" />

      <article className="markdown-body mt-12 text-gray-800">
        <p className="text-sm text-gray-500 text-right mb-4">最終更新：2025年12月28日</p>
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-8">
          <p className="text-sm text-blue-800 m-0">
            <strong>免責事項：</strong>本計算ツールは一般的な推定値を提供するものであり、医学的診断や治療の代替ではありません。正確な体組成測定や健康相談については、医療専門家にご相談ください。
          </p>
        </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">年齢別・性別 体脂肪率平均基準表（10歳〜40歳代）</h3>
          <p className="mb-4 text-sm text-gray-600">
            以下は、10代から40代までのより詳細な体脂肪率の目安です。特に成長期（10代）は個人差が大きいため、参考値としてご覧ください。
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2">年齢</th>
                  <th className="border border-gray-300 px-4 py-2 text-blue-800">男性：標準範囲</th>
                  <th className="border border-gray-300 px-4 py-2 text-red-800">男性：肥満傾向</th>
                  <th className="border border-gray-300 px-4 py-2 text-pink-800">女性：標準範囲</th>
                  <th className="border border-gray-300 px-4 py-2 text-red-800">女性：肥満傾向</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">10-14歳</td>
                  <td className="border border-gray-300 px-4 py-2">10 - 18%</td>
                  <td className="border border-gray-300 px-4 py-2">20%以上</td>
                  <td className="border border-gray-300 px-4 py-2">15 - 24%</td>
                  <td className="border border-gray-300 px-4 py-2">25%以上</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">15-17歳</td>
                  <td className="border border-gray-300 px-4 py-2">10 - 18%</td>
                  <td className="border border-gray-300 px-4 py-2">20%以上</td>
                  <td className="border border-gray-300 px-4 py-2">17 - 26%</td>
                  <td className="border border-gray-300 px-4 py-2">27%以上</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">18-29歳</td>
                  <td className="border border-gray-300 px-4 py-2">11 - 21%</td>
                  <td className="border border-gray-300 px-4 py-2">22%以上</td>
                  <td className="border border-gray-300 px-4 py-2">21 - 34%</td>
                  <td className="border border-gray-300 px-4 py-2">35%以上</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">30-39歳</td>
                  <td className="border border-gray-300 px-4 py-2">12 - 22%</td>
                  <td className="border border-gray-300 px-4 py-2">23%以上</td>
                  <td className="border border-gray-300 px-4 py-2">22 - 35%</td>
                  <td className="border border-gray-300 px-4 py-2">36%以上</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">40-49歳</td>
                  <td className="border border-gray-300 px-4 py-2">12 - 22%</td>
                  <td className="border border-gray-300 px-4 py-2">23%以上</td>
                  <td className="border border-gray-300 px-4 py-2">22 - 35%</td>
                  <td className="border border-gray-300 px-4 py-2">36%以上</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 18歳未満は成長期のため、成人と同じ基準が当てはまらない場合があります。</p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">体脂肪率計算ツールについて</h2>
          <p>
            この体脂肪率計算ツールは、<strong>Deurenberg式</strong>という科学的に検証された計算式を使用しています。
            年齢、性別、BMI（体格指数）を考慮して体脂肪率を推定します。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">計算方法の詳細</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-bold mb-2">使用計算式（Deurenberg式）：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>男性：体脂肪率(%) = 1.2 × BMI + 0.23 × 年齢 - 16.2</li>
              <li>女性：体脂肪率(%) = 1.2 × BMI + 0.23 × 年齢 - 5.4</li>
            </ul>
            <p className="text-sm mt-2 text-gray-600">※ BMI：体重(kg) ÷ 身長(m)²</p>
            <p className="text-sm text-gray-600">※ この式は欧米人を対象とした研究に基づいており、アジア人の場合は若干の誤差が生じる可能性があります。</p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">測定の精度について</h3>
          <p>本ツールの推定精度は約±3-5%です。より正確な測定をお求めの場合は、以下の方法をお勧めします：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>DEXA法：</strong>最も精度が高い（±1-2%）</li>
            <li><strong>生体インピーダンス法：</strong>家庭用体組成計で使用（±3-5%）</li>
            <li><strong>皮下脂肪厚測定：</strong>専門家による測定（±3-4%）</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">体脂肪率の判定基準</h2>
          <p className="mb-4">以下の表は、日本肥満学会および厚生労働省の基準に基づく体脂肪率の分類目安です：</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">分類</th>
                  <th className="border border-gray-300 px-4 py-2">18-39歳男性</th>
                  <th className="border border-gray-300 px-4 py-2">40-59歳男性</th>
                  <th className="border border-gray-300 px-4 py-2">60歳以上男性</th>
                  <th className="border border-gray-300 px-4 py-2">18-39歳女性</th>
                  <th className="border border-gray-300 px-4 py-2">40-59歳女性</th>
                  <th className="border border-gray-300 px-4 py-2">60歳以上女性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">やせ</td>
                  <td className="border border-gray-300 px-4 py-2">10%以下</td>
                  <td className="border border-gray-300 px-4 py-2">11%以下</td>
                  <td className="border border-gray-300 px-4 py-2">13%以下</td>
                  <td className="border border-gray-300 px-4 py-2">20%以下</td>
                  <td className="border border-gray-300 px-4 py-2">21%以下</td>
                  <td className="border border-gray-300 px-4 py-2">22%以下</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">標準(-)</td>
                  <td className="border border-gray-300 px-4 py-2">11-16%</td>
                  <td className="border border-gray-300 px-4 py-2">12-17%</td>
                  <td className="border border-gray-300 px-4 py-2">14-19%</td>
                  <td className="border border-gray-300 px-4 py-2">21-27%</td>
                  <td className="border border-gray-300 px-4 py-2">22-28%</td>
                  <td className="border border-gray-300 px-4 py-2">23-29%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">標準(+)</td>
                  <td className="border border-gray-300 px-4 py-2">17-21%</td>
                  <td className="border border-gray-300 px-4 py-2">18-22%</td>
                  <td className="border border-gray-300 px-4 py-2">20-24%</td>
                  <td className="border border-gray-300 px-4 py-2">28-34%</td>
                  <td className="border border-gray-300 px-4 py-2">29-35%</td>
                  <td className="border border-gray-300 px-4 py-2">30-36%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">軽肥満</td>
                  <td className="border border-gray-300 px-4 py-2">22-26%</td>
                  <td className="border border-gray-300 px-4 py-2">23-27%</td>
                  <td className="border border-gray-300 px-4 py-2">25-29%</td>
                  <td className="border border-gray-300 px-4 py-2">35-39%</td>
                  <td className="border border-gray-300 px-4 py-2">36-40%</td>
                  <td className="border border-gray-300 px-4 py-2">37-41%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">肥満</td>
                  <td className="border border-gray-300 px-4 py-2">27%以上</td>
                  <td className="border border-gray-300 px-4 py-2">28%以上</td>
                  <td className="border border-gray-300 px-4 py-2">30%以上</td>
                  <td className="border border-gray-300 px-4 py-2">40%以上</td>
                  <td className="border border-gray-300 px-4 py-2">41%以上</td>
                  <td className="border border-gray-300 px-4 py-2">42%以上</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">出典：日本肥満学会「肥満症診療ガイドライン2022」、厚生労働省「日本人の食事摂取基準（2020年版）」</p>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-6">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ 重要な注意事項</h4>
            <ul className="list-disc list-inside text-sm text-yellow-800">
              <li>この基準は一般的な目安であり、個人差があります。</li>
              <li>アスリートや筋肉量の多い方は、この基準が適用されない場合があります。</li>
              <li>健康状態に不安がある場合は、必ず医療専門家にご相談ください。</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">BMI（体格指数）との関係</h2>
          <p>
            BMI（Body Mass Index）は体重と身長から算出される指標で、肥満度を示します。
            体脂肪率とBMIは密接に関連していますが、以下の重要な違いがあります：
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-4 rounded shadow-sm border">
              <h3 className="font-bold text-lg mb-2 text-blue-600">BMIの特徴</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>体重と身長のみで計算</li>
                <li>筋肉と脂肪を区別しない</li>
                <li>簡単に測定可能</li>
                <li>集団の肥満度評価に適している</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded shadow-sm border">
              <h3 className="font-bold text-lg mb-2 text-green-600">体脂肪率の特徴</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>体組成（脂肪と筋肉）を考慮</li>
                <li>より正確な健康評価が可能</li>
                <li>測定にやや専門的な機器が必要</li>
                <li>個人の健康管理に適している</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm bg-gray-50 p-3 rounded">
            <strong>例：</strong>筋肉量が多いアスリートの場合、BMIは「肥満」と判定されても、体脂肪率は「標準」または「やせ」の範囲にあることがよくあります。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">基礎代謝との関係</h2>
          <p>基礎代謝は、安静時に消費されるエネルギー量を示します。体脂肪率と基礎代謝には以下の関係があります：</p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li><strong>筋肉組織：</strong>1kgあたり約13kcal/日のエネルギーを消費</li>
            <li><strong>脂肪組織：</strong>1kgあたり約4.5kcal/日のエネルギーを消費</li>
          </ul>
          <p className="mt-2 font-semibold">結果：体脂肪率が高いほど（筋肉量が少ないほど）基礎代謝が低下しやすい傾向にあります。</p>
          <p className="mt-2">適切な体脂肪率を維持することは、基礎代謝を高く保ち、太りにくい体質を作るためにも重要です。</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">健康的な体脂肪率の維持方法</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">推奨される方法</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🏃</span>
                  <span><strong>適度な有酸素運動：</strong>週150分以上の中強度運動</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">💪</span>
                  <span><strong>筋力トレーニング：</strong>週2-3回の筋トレ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🥗</span>
                  <span><strong>バランスの良い食事：</strong>タンパク質、炭水化物、脂質の適切な摂取</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">😴</span>
                  <span><strong>十分な睡眠：</strong>7-9時間の質の良い睡眠</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🧘</span>
                  <span><strong>ストレス管理：</strong>適切なストレス対処法の実践</span>
                </li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h3 className="font-bold text-lg mb-2 text-red-700">避けるべき方法</h3>
              <ul className="list-disc list-inside space-y-1 text-red-700">
                <li>極端なカロリー制限（1日1000kcal以下）</li>
                <li>単品ダイエット</li>
                <li>過度な有酸素運動のみ</li>
                <li>サプリメントのみに依存</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">よくある質問</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-800">Q. 体脂肪率とBMIの違いは何ですか？</h3>
              <p className="mt-1 text-gray-600">
                BMIは身長と体重の比率を見るもので、体脂肪率は体重に占める脂肪の割合を見ます。
                筋肉質の人はBMIが高くても体脂肪率が低い場合があるため、両方の指標を確認することが推奨されます。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Q. 体脂肪率を正確に測定する方法は？</h3>
              <p className="mt-1 text-gray-600">
                最も正確なのは医療機関でのDEXA法（精度±1-2%）ですが、日常管理には家庭用の体組成計（生体インピーダンス法）が便利です。
                本ツールのような計算式は簡易的な推定に役立ちます。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Q. 体脂肪率が高いのにBMIが正常な場合は？</h3>
              <p className="mt-1 text-gray-600">
                「隠れ肥満」の可能性があります。筋肉量が少なく脂肪が多い状態です。
                運動不足や極端な食事制限が原因となることが多く、筋力トレーニングとバランスの良い食事が改善の鍵となります。
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
