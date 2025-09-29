import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "数学ツール一覧 ",
  description: "パーセント計算、パスワード生成などの数学関連ツールの一覧です。",
  alternates: {
    canonical: 'https://maji-tool.com/math'
  },
  openGraph: {
    title: "数学ツール一覧 ",
    description: "パーセント計算、パスワード生成などの数学関連ツールの一覧です。",
    url: "https://maji-tool.com/math",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

const mathTools = [
  {
    name: "パーセント計算",
    description: "割合、増減、割引など多用途のパーセント計算。",
    link: "/math/percent",
  },
  {
    name: "パスワード生成",
    description: "任意の長さ・文字種で安全なランダムパスワードを作成。",
    link: "/math/random-password",
  },
  {
    name: "死亡時間カウントダウン",
    description: "日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示。",
    link: "/math/death-countdown",
  },
  {
    name:"Markdown オンライン編集ツール",
    description: "リアルタイムプレビュー付きのシンプルな Markdown エディタ。",
    link: "/math/markdown",
  }
];

export default function MathIndexPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">数学ツール</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {mathTools.map((tool) => (
          <Link
            href={tool.link}
            key={tool.link}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
            <p className="text-gray-600 mt-1">{tool.description}</p>
          </Link>
        ))}
      </div>
      <ShareButtons title="数学ツール一覧" />
    </div>
  );
}
