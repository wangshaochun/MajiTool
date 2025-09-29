import type { Metadata } from 'next';
import RandomPasswordClient from "@/components/RandomPasswordClient";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "ランダムパスワード生成器 ",
  description: "安全で強力なランダムパスワードを無料で生成。長さ、文字種（大文字・小文字・数字・記号）を自由に設定できます。セキュリティを向上させるためのパスワード作成ツール。",
  keywords: [
    "パスワード生成",
    "ランダムパスワード",
    "セキュリティ",
    "パスワード作成",
    "強力なパスワード",
    "無料ツール"
  ],
  alternates: {
    canonical: 'https://maji-tool.com/math/random-password'
  },
  openGraph: {
    title: "ランダムパスワード生成器 ",
    description: "安全で強力なランダムパスワードを無料で生成。長さ、文字種（大文字・小文字・数字・記号）を自由に設定できます。",
    url: "https://maji-tool.com/math/random-password",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function RandomPasswordPage() {
  return (
    <>
      <RandomPasswordClient />
      <ShareButtons title="ランダムパスワード生成器" />
    </>
  );
}