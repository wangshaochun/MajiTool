import React from "react";
import PercentCalcClient from "@/components/PercentCalcClient";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";
import { PercentIcon } from "@/components/MathIcons";

export const metadata: Metadata = {
  title: "パーセント計算機 ・ 割合 ",
  description: "パーセント（%）の計算を簡単に行える無料ツール。割合計算、増減計算、逆算など、日常やビジネスで役立つパーセント計算機。使い方やよくある質問も掲載。",
  keywords: [
    "パーセント計算",
    "割合計算",
    "増減計算",
    "逆算",
    "%",
    "計算機",
    "無料ツール"
  ],
  alternates: {
    canonical: 'https://maji-tool.com/math/percent'
  },
  openGraph: {
    title: "パーセント計算機 ・ 割合 ",
    description: "パーセント（%）の計算を簡単に行える無料ツール。割合計算、増減計算、逆算など、日常やビジネスで役立つパーセント計算機。使い方やよくある質問も掲載。",
    url: "https://maji-tool.com/math/percent",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function PercentCalcPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="mb-4 md:mb-0 md:mr-6">
          <PercentIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">パーセント計算機 ・ 割合</h1>
          <p className="text-gray-600 mt-2">
            割合、増減、割引など、日常やビジネスで役立つ様々なパーセント計算を簡単に行えます。
          </p>
        </div>
      </div>
      <PercentCalcClient />
      <ShareButtons title="パーセント計算機 ・ 割合" />
    </div>
  );
}
