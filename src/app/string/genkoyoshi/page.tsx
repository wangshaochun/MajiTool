import type { Metadata } from "next";
import Image from "next/image";
import GenkoyoshiClient from "@/components/GenkoyoshiClient";

export const metadata: Metadata = {
  title: "原稿用紙エディタ（作文用紙） | 縦書き・印刷・PDF保存",
  description: "ブラウザ上で使える無料の原稿用紙（作文用紙）エディタです。入力した文字がリアルタイムで縦書きの原稿用紙に反映されます。A4サイズでの印刷やPDFダウンロードも可能。読書感想文や小説の下書きに最適です。",
  keywords: ["原稿用紙", "作文用紙", "エディタ", "縦書き", "ツール", "印刷", "PDF", "400字詰め"],
};

export default function GenkoyoshiPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-4">
        <Image src="/images/genkoyoshi.svg" alt="" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12" />
        原稿用紙エディタ
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        入力したテキストをリアルタイムで400字詰めの原稿用紙に変換します。
        縦書き表示で推敲しやすく、そのまま印刷やPDF保存も可能です。
      </p>

      <GenkoyoshiClient />

      <div className="mt-16 space-y-12 max-w-4xl mx-auto">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
            使い方
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>1. テキストを入力</strong><br />
              左側（スマホでは上部）のテキストボックスに文章を入力してください。入力した内容が即座に右側の原稿用紙プレビューに反映されます。
            </p>
            <p>
              <strong>2. 罫線の色を変更</strong><br />
              お好みに合わせて原稿用紙の罫線の色を変更できます。標準的な緑色のほか、赤や青なども選択可能です。
            </p>
            <p>
              <strong>3. 印刷・PDF保存</strong><br />
              「印刷」ボタンを押すと、ブラウザの印刷機能を使用して原稿用紙を印刷できます。「PDF保存」ボタンを押すと、作成した原稿用紙を画像化してPDFファイルとしてダウンロードできます。
            </p>
            <p>
              <strong>4. 自動保存</strong><br />
              入力した内容はブラウザに自動的に保存されるため、ページを閉じても次回アクセス時に続きから作業できます。データはサーバーには送信されず、お使いの端末内にのみ保存されるため安心です。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
            機能・特徴
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>400字詰め原稿用紙（20文字 × 20行）に対応</li>
            <li>リアルタイム縦書きプレビュー</li>
            <li>長文対応（自動ページ分割）</li>
            <li>A4横書きサイズでの印刷最適化</li>
            <li>プライバシー保護（ローカル保存のみ）</li>
            <li>完全無料・登録不要</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
