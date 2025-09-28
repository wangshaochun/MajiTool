import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "画像ツール一覧 ",
  description: "画像関連のオンラインツール一覧。ピクセル化、圧縮などの便利機能を無料で利用できます。",
  openGraph: {
    title: "画像ツール一覧 ",
    description: "画像関連のオンラインツール一覧。ピクセル化、圧縮などの便利機能を無料で利用できます。",
    url: "https://maji-tool.com/image",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

const imageTools = [
  {
    name: "画像ピクセル化",
    description: "画像をドット絵風に変換。ブロックサイズで粗さを調整できます。",
    link: "/image/pixelate",
  },
  {
    name: "画像圧縮",
    description: "品質と形式（WEBP/JPEG）を選んで容量を削減。ブラウザ内で完結。",
    link: "/image/compress",
  },
];

export default function ImageIndexPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">画像ツール</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {imageTools.map((tool) => (
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
      <ShareButtons title="画像ツール一覧" />
    </div>
  );
}
