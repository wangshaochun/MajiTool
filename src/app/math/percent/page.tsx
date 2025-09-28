import React from "react";
import PercentCalcClient from "@/components/PercentCalcClient";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "パーセント計算機 ・ 割合 | MajiTool",
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
  openGraph: {
    title: "パーセント計算機 ・ 割合 | MajiTool",
    description: "パーセント（%）の計算を簡単に行える無料ツール。割合計算、増減計算、逆算など、日常やビジネスで役立つパーセント計算機。使い方やよくある質問も掲載。",
    url: "https://maji-tool.com/percent",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function PercentCalcPage() {
  return (
    <>
      <PercentCalcClient />
      <ShareButtons title="パーセント計算機 ・ 割合" />
    </>
  );
}
