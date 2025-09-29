import type { Metadata } from 'next';
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: 'ブログ',
  description: 'オンラインツールの使い方、技術情報、アップデート情報など、役立つ情報をお届けします。',
  keywords: 'ブログ, オンラインツール, 技術情報, アップデート',
  alternates: {
    canonical: 'https://maji-tool.com/blog'
  },
  openGraph: {
    title: 'ブログ - MajiTool',
    description: 'オンラインツールの使い方、技術情報、アップデート情報など、役立つ情報をお届けします。',
    url: 'https://maji-tool.com/blog',
    type: 'website',
  },
};

export const revalidate = 0;

export default async function BlogListPage() {
  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  try {
    posts = await getPosts(50, 0);
  } catch (e) {
    console.error("Failed to load posts", e);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ブログ</h1>
      {posts.length === 0 ? (
        <div className="text-gray-500">まだ投稿がありません</div>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="bg-white p-4 rounded shadow-sm">
              <Link href={`/blog/${p.id}`} className="block">
                <h3 className="text-xl font-semibold text-blue-600 hover:underline">{p.title}</h3>
              </Link>
              {p.excerpt && <p className="text-gray-600 mt-1">{p.excerpt}</p>}
              <div className="text-sm text-gray-400 mt-2">{new Date(p.created_at).toISOString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
