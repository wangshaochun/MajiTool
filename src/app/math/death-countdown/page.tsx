import type { Metadata } from 'next';
import DeathCountdownClient from '@/components/DeathCountdownClient';
import ShareButtons from '@/components/ShareButtons';

export const metadata: Metadata = {
  title: "死亡時間カウントダウン | MajiTool",
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
    title: "死亡時間カウントダウン | MajiTool",
    description: "日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示するツール。",
    url: "https://maji-tool.com/math/death-countdown",
    siteName: "MajiTool",
    locale: "ja_JP",
    type: "website"
  }
};

export default function DeathCountdownPage() {
  return (
    <>
      <DeathCountdownClient />
      <ShareButtons title="死亡時間カウントダウン" />
    </>
  );
}
