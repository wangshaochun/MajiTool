import { notFound } from "next/navigation";
import {getPostById } from "@/lib/posts";
import Markdown from "@/components/Markdown";

type Params = { params: { id: number } };

export const revalidate = 0; // 等价于 force-dynamic

export default async function BlogDetailPage({ params }: Params) {
  let post = null as Awaited<ReturnType<typeof getPostById>>;
  try {
    post = await getPostById(params.id);
  } catch (e) {
    console.error("Failed to load post", e);
  }
  if (!post) return notFound();

  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="mb-2">{post.title}</h1>
      {post.excerpt && <p className="text-gray-600 not-prose">{post.excerpt}</p>}
      <div className="text-sm text-gray-400 not-prose mb-6">
        公開日 {new Date(post.created_at).toLocaleString()}
      </div>
      <Markdown content={post.content_md} />
    </article>
  );
}
