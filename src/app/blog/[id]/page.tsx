import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import Link from "next/link";
import {getPostById, getRelatedPosts } from "@/lib/posts";
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
    const description = post.excerpt || post.content_md.replace(/[#*`]/g, '').substring(0, 150) + '...';
    
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
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (Number.isNaN(id)) return notFound();
    post = await getPostById(id);
    if (post) {
      // 获取相关文章
      try {
        relatedPosts = await getRelatedPosts(post.title, post.id, 15);
      } catch (e) {
        console.error("Failed to load related posts", e);
      }
    }
  } catch (e) {
    console.error("Failed to load post", e);
  }
  if (!post) return notFound();

  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="mb-2">{post.title}</h1>
      {/* {post.excerpt && <p className="text-gray-600 not-prose">{post.excerpt}</p>} */}
      <div className="text-sm text-gray-400 not-prose mb-6">
        公開日 {new Date(post.created_at).toISOString()}
      </div>
      <div className="markdown-body">
        <Markdown content={post.content_md} />
      </div> 
      <div className="not-prose">
        <ShareButtons title={post.title} />
      </div>
      {/* 相关文章列表 */}
      {relatedPosts.length > 0 && (
        <div className="not-prose mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">相关文章</h2>
          <ul className="space-y-4">
            {relatedPosts.map((p) => (
              <li key={p.id} className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/blog/${p.id}`} className="block">
                  <h3 className="text-xl font-semibold text-blue-600 hover:underline">{p.title}</h3>
                </Link>
                {p.excerpt && <p className="text-gray-600 mt-1">{p.excerpt}</p>}
                <div className="text-sm text-gray-400 mt-2">{new Date(p.created_at).toISOString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
