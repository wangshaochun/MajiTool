import type { Metadata } from 'next';
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { stripHtml } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'MajiTool - オンラインツールハブ',
  description: '日々のタスクを効率化するシンプルでパワフルなオンラインツールコレクション。画像編集、数学計算など、無料でご利用いただけます。',
  keywords: 'オンラインツール, 画像編集, 数学計算, ユーティリティ, 無料ツール, パスワード生成, 画像圧縮',
  alternates: {
    canonical: 'https://maji-tool.com'
  },
  openGraph: {
    title: 'MajiTool - オンラインツールハブ',
    description: '日々のタスクを効率化するシンプルでパワフルなオンラインツールコレクション。',
    url: 'https://maji-tool.com',
    type: 'website',
  },
};

export const revalidate = 0;

export default async function Home() {
  const imageTools = [
    { name: "画像ピクセル化", description: "ドット絵風に変換（粗さ調整可）", link: "/image/pixelate" },
    { name: "画像圧縮", description: "品質と形式（WEBP/JPEG）で容量削減", link: "/image/compress" },
  ] as const;
  const mathTools = [
    {
      name: "死亡時間カウントダウン",
      description: "日本の平均寿命をもとに、あなたの残り寿命をリアルタイムで表示。",
      link: "/math/death-countdown",
    },
    { name: "パーセント計算", description: "割合・増減・割引などに対応", link: "/math/percent" },
    { name: "パスワード生成", description: "安全なランダムパスワードを作成", link: "/math/random-password" },

  ] as const;
  const stringTools = [
    { name: "AIコンテンツ検出器", description: "テキストがAI生成かを分析", link: "/string/ai-detector" },
  {
      name:"Markdown オンライン編集ツール",
      description: "リアルタイムプレビュー付きのシンプルな Markdown エディタ。",
      link: "/string/markdown",
    }
  ] as const;

  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  try {
    posts = await getPosts(10, 0);
  } catch (e) {
    console.error("Failed to load posts on home", e);
  }

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
        {/* 画像ツール */}
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
        {/* 文字列ツール */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">文字列ツール</h2>
            <Link href="/string" className="text-sm text-blue-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {stringTools.map(t => (
              <Link key={t.link} href={t.link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-gray-800">{t.name}</div>
                <div className="text-gray-600 mt-1">{t.description}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 数学ツール */}
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
       {/* 最新ブログ */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">最新ブログ</h2>
            <Link href="/blog" className="text-sm text-blue-600 hover:underline">すべて見る →</Link>
          </div>
          {posts.length === 0 ? (
            <div className="text-gray-500">まだ投稿がありません</div>
          ) : (
            <ul className="space-y-4">
              {posts.map((p) => (
                <li key={p.id} className="bg-white p-4 rounded shadow-sm">
                  <Link href={`/blog/${p.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                    {p.title}
                  </Link>
                  {p.excerpt && <p className="text-gray-600 mt-1 line-clamp-2">{stripHtml(p.excerpt)}</p>}
                  <div className="text-sm text-gray-400 mt-2">{new Date(p.created_at).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
