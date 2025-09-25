"use client";

import Link from "next/link";

export default function Home() {
  const imageTools = [
    { name: "画像ピクセル化", description: "ドット絵風に変換（粗さ調整可）", link: "/image/pixelate" },
    { name: "画像圧縮", description: "品質と形式（WEBP/JPEG）で容量削減", link: "/image/compress" },
  ];
  const mathTools = [
    { name: "パーセント計算", description: "割合・増減・割引などに対応", link: "/math/percent" },
    { name: "パスワード生成", description: "安全なランダムパスワードを作成", link: "/math/random-password" },
  ];

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          オンラインツールハブ
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          日々のタスクを効率化するシンプルでパワフルなツール。
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">画像ツール</h2>
            <Link href="/image" className="text-sm text-blue-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {imageTools.map(t => (
              <Link key={t.link} href={t.link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-gray-800">{t.name}</div>
                <div className="text-gray-600 mt-1">{t.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">数学ツール</h2>
            <Link href="/math" className="text-sm text-blue-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {mathTools.map(t => (
              <Link key={t.link} href={t.link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-gray-800">{t.name}</div>
                <div className="text-gray-600 mt-1">{t.description}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
