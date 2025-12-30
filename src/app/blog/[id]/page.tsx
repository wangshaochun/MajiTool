import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import Link from "next/link";
import {getPostById, getRelatedPosts, getRelatedWebPosts } from "@/lib/posts";
import { stripHtml } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import ShareButtons from "@/components/ShareButtons";

type Params = { params: Promise<{ id: string }> };

export const revalidate = 0; // 等价于 force-dynamic

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (Number.isNaN(id)) {
      return {
        title: '記事が見つかりません',
        description: '指定された記事が見つかりませんでした。',
      };
    }
    
    const post = await getPostById(id);
    if (!post) {
      return {
        title: '記事が見つかりません',
        description: '指定された記事が見つかりませんでした。',
      };
    }
    
    // コンテンツから最初の150文字程度を抽出して説明文に使用
    const description = (post.excerpt ? stripHtml(post.excerpt) : post.content_md.replace(/[#*`]/g, '')).substring(0, 150) + '...';
    
    return {
      title: post.title,
      description,
      keywords: 'ブログ, オンラインツール, 技術情報',
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.created_at,
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description,
      },
    };
  } catch (e) {
    console.error('Failed to generate metadata', e);
    return {
      title: 'エラー',
      description: 'メタデータの生成に失敗しました。',
    };
  }
}

export default async function BlogDetailPage({ params }: Params) {
  let post = null as Awaited<ReturnType<typeof getPostById>>;
  let relatedPosts = [] as Awaited<ReturnType<typeof getRelatedPosts>>;
  let webPosts = [] as Awaited<ReturnType<typeof getRelatedWebPosts>>;

  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (Number.isNaN(id)) return notFound();
    post = await getPostById(id);
    if (post) {
      // 関連記事
      try {
        const [related, web] = await Promise.all([
          getRelatedPosts(post.title, post.id, 12),
          getRelatedWebPosts(post.title, 5)
        ]);
        relatedPosts = related;
        webPosts = web;
      } catch (e) {
        console.error("Failed to load related posts", e);
      }
    }
  } catch (e) {
    console.error("Failed to load post", e);
  }
  if (!post) return notFound();

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <article className="prose prose-slate max-w-none flex-1 bg-white p-6 rounded-lg shadow-sm min-w-0">
        <h1 className="mb-6 text-3xl md:text-3xl font-bold leading-tight">{post.title}</h1>
        <div className="text-sm text-gray-400 not-prose mb-6">
          公開日 {new Date(post.created_at).toISOString()}
        </div>
        <div className="markdown-body">
          <Markdown content={post.content_md} />
        </div> 
        <div className="not-prose">
          <ShareButtons title={post.title} />
        </div>
      </article>

      <aside className="w-full lg:w-[30%] flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">タグ</h3>
            <div className="flex flex-wrap gap-2">
                {post.tags ? post.tags.split(',').map(tag => (
                    <span key={tag} className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-600 hover:bg-blue-100 transition-colors">
                        {tag.trim()}
                    </span>
                )) : <span className="text-gray-400 text-sm">タグなし</span>}
            </div>
        </div>

        {post.url && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">参照元</h3>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm block">
                    {post.url}
                </a>
            </div>
        )}

        {relatedPosts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">関連記事</h3>
                <ul className="space-y-4">
                    {relatedPosts.map((p) => (
                        <li key={p.id} className="group">
                            <Link href={`/blog/${p.id}`} className="block">
                                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                                    {p.title}
                                </div>
                            </Link>
                            <div className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</div>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {webPosts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">おすすめの外部記事</h3>
                <ul className="space-y-4">
                    {webPosts.map(wp => (
                        <li key={wp.id} className="group">
                            <a href={wp.url} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                                    {wp.title}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </aside>
    </div>
  );
}
