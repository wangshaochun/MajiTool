import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import {getPostById } from "@/lib/posts";
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
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (Number.isNaN(id)) return notFound();
    post = await getPostById(id);
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
    </article>
  );
}
