import type { Metadata } from "next";
import React from "react";
import AIDetectorClient from "@/components/AIDetectorClient";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "AIコンテンツ検出器（日本語対応）",
  description:
    "テキストがAIによって生成された可能性をヒューリスティックに推定する無料ツール。日本語特有の特徴も考慮し、繰り返し・語彙多様性・構造規則性・語彙特徴などを多角的に分析します。",
  keywords: [
    "AI検出",
    "AIコンテンツ",
    "生成AI",
    "文章分析",
    "日本語",
    "ヒューリスティック",
  ],
  alternates: {
    canonical: "https://maji-tool.com/string/ai-detector",
  },
  openGraph: {
    title: "AIコンテンツ検出器（日本語対応）",
    description:
      "日本語テキストをAI生成らしさで分析。繰り返し・語彙多様性・構造規則性・語彙特徴・日本語特有の傾向を評価します。",
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
      <ShareButtons title="AIコンテンツ検出器（日本語対応）" />
    </>
  );
}
