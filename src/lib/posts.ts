import { query } from "@/lib/db";

export type PostListItem = {
  id: number; 
  title: string;
  excerpt: string | null;
  created_at: string;
};

export type PostDetail = {
  id: number; 
  title: string;
  excerpt: string | null;
  content_md: string;
  created_at: string;
  updated_at: string | null;
};

export async function getPosts(limit = 20, offset = 0): Promise<PostListItem[]> {
  const sql = `
    SELECT id, title, excerpt, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at
    FROM blog.posts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await query<PostListItem>(sql, [limit, offset]);
  return rows;
} 

export async function getPostById(id: number): Promise<PostDetail | null> {
  const sql = `
    SELECT id, title, excerpt, content_md,
           to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
           to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at
    FROM blog.posts
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await query<PostDetail>(sql, [id]);
  return rows[0] ?? null;
}

export type CreatePostInput = { 
  title: string;
  content_md: string;
  excerpt?: string | null;
};

export async function createPost(input: CreatePostInput): Promise<PostDetail> {
  const {  title, content_md, excerpt = null } = input;
  const sql = `
    INSERT INTO blog.posts (  title, excerpt, content_md)
    VALUES ($1, $2, $3)
    RETURNING id,  title, excerpt, content_md,
              to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
              to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at
  `;
  try {
    const { rows } = await query<PostDetail>(sql, [title, excerpt, content_md]);
    return rows[0];
  } catch (err: unknown) {
    const code = typeof err === "object" && err !== null && "code" in err
      ? String((err as { code?: unknown }).code)
      : undefined;
    if (code === "23505") {
      // unique_violation
      throw new Error("DUPLICATE_TITLE");
    }
    throw err as Error;
  }
}

export type UpdatePostInput = {
  title?: string;
  content_md?: string;
  excerpt?: string | null;
};

export async function updatePost(id: number, input: UpdatePostInput): Promise<PostDetail | null> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  if (input.title !== undefined) {
    sets.push(`title = $${i++}`);
    vals.push(input.title);
  }
  if (input.content_md !== undefined) {
    sets.push(`content_md = $${i++}`);
    vals.push(input.content_md);
  }
  if (input.excerpt !== undefined) {
    sets.push(`excerpt = $${i++}`);
    vals.push(input.excerpt);
  }
  // Always bump updated_at
  sets.push(`updated_at = now()`);
  const sql = `
    UPDATE blog.posts
    SET ${sets.join(", ")}
    WHERE id = $${i}
    RETURNING id, title, excerpt, content_md,
              to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
              to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at
  `;
  vals.push(id);
  const { rows } = await query<PostDetail>(sql, vals);
  return rows[0] ?? null;
}

export async function deletePost(id: number): Promise<boolean> {
  const sql = `DELETE FROM blog.posts WHERE id = $1`;
  const res = await query<unknown>(sql, [id]);
  // pg's QueryResult has rowCount
  const count = (res as { rowCount?: number }).rowCount ?? 0;
  return count > 0;
}
