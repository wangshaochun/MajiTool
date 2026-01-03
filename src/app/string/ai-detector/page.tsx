import type { Metadata } from "next";
import React from "react";
import AIDetectorClient from "@/components/AIDetectorClient";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "AIコンテンツ検出器 - 10種類の高度な分析",
  description:
    "テキストがAIによって生成された可能性を10種類の分析手法で推定する無料ツール。繰り返し・語彙多様性・構造規則性・N-gram・句式多様性・感情表現・標点符号・意味連接性など多角的に分析します。",
  keywords: [
    "AI検出",
    "AIコンテンツ",
    "生成AI",
    "文章分析",
    "日本語",
    "ヒューリスティック",
    "ChatGPT検出",
    "AI判定",
    "コンテンツ検証",
  ],
  alternates: {
    canonical: "https://maji-tool.com/string/ai-detector",
  },
  openGraph: {
    title: "AIコンテンツ検出器（10種類の高度な分析）",
    description:
      "日本語テキストを10種類の分析手法でAI生成らしさを評価。繰り返し・語彙多様性・N-gram・句式多様性・感情表現・標点符号など多角的に検出します。",
    url: "https://maji-tool.com/string/ai-detector",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website",
  },
};

export default function AIDetectorPage() {
  return (
    <>
      <AIDetectorClient />
      <ShareButtons title="AIコンテンツ検出器 - 10種類の高度な分析" />
    </>
  );
}
