import type { Metadata } from 'next';
import DeathCountdownClient from '@/components/DeathCountdownClient';
import ShareButtons from '@/components/ShareButtons';
import { DeathIcon } from '@/components/MathIcons';

export const metadata: Metadata = {
  title: "死亡時間カウントダウン ",
  description: "日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示するツール。性別・生年月日・生活習慣を考慮した統計的な計算結果を秒単位でカウントダウン。",
  keywords: [
    "死亡時間",
    "カウントダウン",
    "平均寿命",
    "余命計算",
    "日本",
    "統計",
    "ライフカウンター"
  ],
  openGraph: {
    title: "死亡時間カウントダウン ",
    description: "日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示するツール。",
    url: "https://maji-tool.com/math/death-countdown",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function DeathCountdownPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="mb-4 md:mb-0 md:mr-6">
          <DeathIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">死亡時間カウントダウン</h1>
          <p className="text-gray-600 mt-2">
            日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示します。時間を大切にするきっかけに。
          </p>
        </div>
      </div>
      <DeathCountdownClient />
      <ShareButtons title="死亡時間カウントダウン" />
    </div>
  );
}
