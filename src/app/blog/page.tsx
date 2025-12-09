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

const PAGE_SIZE = 40;
const TOTAL_PAGES = 20;
const PAGE_NUMBERS = Array.from({ length: TOTAL_PAGES }, (_, idx) => idx + 1);

export default async function BlogListPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const pageParam = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), TOTAL_PAGES)
    : 1;
  const offset = (currentPage - 1) * PAGE_SIZE;

  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  try {
    posts = await getPosts(PAGE_SIZE, offset);
  } catch (e) {
    console.error("Failed to load posts", e);
  }

  const paginationHref = (pageNumber: number) =>
    pageNumber === 1 ? "/blog" : `/blog?page=${pageNumber}`;

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
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="ページナビゲーション">
        {PAGE_NUMBERS.map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          return (
            <Link
              key={pageNumber}
              href={paginationHref(pageNumber)}
              className={`min-w-[2.5rem] rounded border px-3 py-1 text-center text-sm ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
