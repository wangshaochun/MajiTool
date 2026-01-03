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

const stringTools = [ 
  {
    name:"Markdown オンライン編集ツール",
    description: "リアルタイムプレビュー付きのシンプルな Markdown エディタ。",
    link: "/string/markdown",
    icon: "/images/markdown.svg"
  },
  {
    name: "AIコンテンツ検出器",
    description:
      "テキストがAIによって生成された可能性をヒューリスティックに推定する無料ツール。日本語特有の特徴も考慮し、繰り返し・語彙多様性・構造規則性・語彙特徴などを多角的に分析します。",
    link: "/string/ai-detector",
    icon: "/images/ai-detector.svg"
  },
  {
    name: "空白文字コピーツール",
    description: "Instagram、Twitter(X)、LINE、ゲームのユーザー名などで使える空白文字（不可視文字）を簡単にコピー・生成できるツールです。空白の長さを指定して生成したり、テキスト内の空白文字を検出することも可能です。",
    link: "/string/kuuhakumoji",
    icon: "/images/kuuhakumoji.svg"
  },
  {
    name: "原稿用紙エディタ（作文用紙） ",
    description: "ブラウザ上で使える無料の原稿用紙（作文用紙）エディタです。入力した文字がリアルタイムで縦書きの原稿用紙に反映されます。A4サイズでの印刷やPDFダウンロードも可能。読書感想文や小説の下書きに最適です。",
    link: "/string/genkoyoshi",
    icon: "/images/genkoyoshi.svg"
  }
];

export default function MathIndexPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">文字列ツール</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {stringTools.map((tool) => (
          <Link
            href={tool.link}
            key={tool.link}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <img src={tool.icon} alt="" className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
            </div>
            <p className="text-gray-600 mt-1">{tool.description}</p>
          </Link>
        ))}
      </div>
      <ShareButtons title="文字列ツール一覧" />
    </div>
  );
}
