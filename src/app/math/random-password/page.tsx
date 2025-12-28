import type { Metadata } from 'next';
import RandomPasswordClient from "@/components/RandomPasswordClient";
import ShareButtons from "@/components/ShareButtons";
import { PasswordIcon } from "@/components/MathIcons";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="mb-4 md:mb-0 md:mr-6">
          <PasswordIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ランダムパスワード生成器</h1>
          <p className="text-gray-600 mt-2">
            安全で強力なパスワードを瞬時に生成します。長さや文字種を自由にカスタマイズ可能です。
          </p>
        </div>
      </div>
      <RandomPasswordClient />
      <ShareButtons title="ランダムパスワード生成器" />
    </div>
  );
}
