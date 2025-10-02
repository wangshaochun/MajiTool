import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "文字列ツール ",
  description: "文字列のエンコード・デコード、AIコンテンツ検出などの文字列関連ツールの一覧です。",
  alternates: {
    canonical: 'https://maji-tool.com/string'
  },
  openGraph: {
    title: "文字列ツール一覧 ",
    description: "文字列のエンコード・デコード、AIコンテンツ検出などの文字列関連ツールの一覧です。",
    url: "https://maji-tool.com/string",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

const mathTools = [ 
  {
    name:"Markdown オンライン編集ツール",
    description: "リアルタイムプレビュー付きのシンプルな Markdown エディタ。",
    link: "/string/markdown",
  }
  ,
  {
    name: "AIコンテンツ検出器",
    description:
      "テキストがAIによって生成された可能性をヒューリスティックに推定する無料ツール。日本語特有の特徴も考慮し、繰り返し・語彙多様性・構造規則性・語彙特徴などを多角的に分析します。",
    link: "/string/ai-detector",
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
