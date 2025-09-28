import React from "react";
import type { Metadata } from "next";
import CompressImageClient from "@/components/CompressImageClient";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "画像圧縮ツール ",
  description:
    "画像ファイルをオンラインで手軽に圧縮。品質（圧縮率）や出力形式（JPEG/WEBP）を選び、見た目を保ちながら容量を削減できます。ブラウザ内で処理され、アップロードは行われません。",
  keywords: [
    "画像圧縮",
    "オンライン圧縮",
    "JPEG 圧縮",
    "WEBP 変換",
    "サイズ削減",
    "無料ツール"
  ],
  openGraph: {
    title: "画像圧縮ツール ",
    description:
      "画像ファイルをオンラインで手軽に圧縮。品質（圧縮率）や出力形式（JPEG/WEBP）を選び、見た目を保ちながら容量を削減できます。ブラウザ内で処理され、アップロードは行われません。",
    url: "https://maji-tool.com/image/compress",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function CompressPage() {
  return (
    <>
      <CompressImageClient />
      <ShareButtons title="画像圧縮ツール" />
    </>
  );
}
