import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "画像ツール一覧 ",
  description: "画像関連のオンラインツール一覧。ピクセル化、圧縮などの便利機能を無料で利用できます。",
  alternates: {
    canonical: 'https://maji-tool.com/image'
  },
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
    icon: "/images/pixelate.svg",
  },
  {
    name: "画像圧縮",
    description: "品質と形式（WEBP/JPEG）を選んで容量を削減。ブラウザ内で完結。",
    link: "/image/compress",
    icon: "/images/compress.svg",
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
            className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mr-4 flex-shrink-0">
              <Image src={tool.icon} alt={tool.name} width={60} height={60} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{tool.name}</h2>
              <p className="text-gray-600 mt-1">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <ShareButtons title="画像ツール一覧" />
    </div>
  );
}
