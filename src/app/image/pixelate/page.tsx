import React from "react";
import PixelateImageClient from "@/components/PixelateImageClient";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "画像ピクセル化ツール | MajiTool",
  description: "画像をピクセル化（ドット絵風）に変換する無料オンラインツール。アップロードした画像を簡単にピクセルアート風に変換できます。",
  keywords: [
    "画像ピクセル化",
    "ドット絵変換",
    "ピクセルアート",
    "画像変換",
    "無料ツール",
    "オンライン変換"
  ],
  openGraph: {
    title: "画像ピクセル化ツール | MajiTool",
    description: "画像をピクセル化（ドット絵風）に変換する無料オンラインツール。アップロードした画像を簡単にピクセルアート風に変換できます。",
    url: "https://maji-tool.com/image/pixelate",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function PixelateImagePage() {
  return (
    <>
      <PixelateImageClient />
      <ShareButtons title="画像ピクセル化ツール" />
    </>
  );
}