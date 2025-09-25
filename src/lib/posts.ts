import { query } from "@/lib/db";

export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  created_at: string;
};

export type PostDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  created_at: string;
  updated_at: string | null;
};

export async function getPosts(limit = 20, offset = 0): Promise<PostListItem[]> {
  const sql = `
    SELECT id, slug, title, excerpt, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at
    FROM blog.posts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await query<PostListItem>(sql, [limit, offset]);
  return rows;
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const sql = `
    SELECT id, slug, title, excerpt, content_md,
           to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
           to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at
    FROM blog.posts
    WHERE slug = $1
    LIMIT 1
  `;
  const { rows } = await query<PostDetail>(sql, [slug]);
  return rows[0] ?? null;
}
