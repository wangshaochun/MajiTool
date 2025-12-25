import { query } from "@/lib/db";

export type PostListItem = {
  id: number; 
  title: string;
  excerpt: string | null;
  created_at: string;
};

export type PostDetail = {
  id: number; 
  url: string;
  tags: string;
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
    SELECT id, url,title, excerpt, content_md,tags,
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
  url: string;
  tags: string;
};

export async function createPost(input: CreatePostInput): Promise<PostDetail> {
  const {  title, content_md, excerpt = null, url, tags } = input;
  const sql = `
    INSERT INTO blog.posts (  title, excerpt, content_md, url, tags)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id,  title, excerpt, content_md,
              to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
              to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at
  `;
  try {
    const { rows } = await query<PostDetail>(sql, [title, excerpt, content_md, url, tags]);
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
  tags?: string;
  url?: string | null;
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
  if (input.tags !== undefined) {
    sets.push(`tags = $${i++}`);
    vals.push(input.tags);
  }
  if (input.url !== undefined) {
    sets.push(`url = $${i++}`);
    vals.push(input.url);
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

export async function getRelatedPosts(title: string, excludeId: number, limit = 15): Promise<PostListItem[]> {
 
  // 先尝试启用 pg_trgm 扩展（如果尚未启用）
  try {
    await query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
  } catch (e) {
    // 如果无法启用扩展（可能是权限问题），使用降级方案
    console.warn('Failed to enable pg_trgm extension, using fallback method:', e); 
  } 
  // 尝试使用 similarity 函数
  try {
    const sql = `
      SELECT id, title, excerpt, to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS created_at,
             blog.similarity(title, $1) AS sim
      FROM blog.posts
      WHERE blog.similarity(title, $1) > 0.2 AND id <> $2
      ORDER BY sim DESC
      LIMIT $3
    `;
    const { rows } = await query<PostListItem & { sim: number }>(sql, [title ,  excludeId, limit]); 
    return rows.map(({ sim, ...rest }) => rest);
  } catch (e) {
    // 如果 similarity 函数仍然不可用，使用降级方案
    console.warn('similarity function not available, using fallback method:', e);
    return [];
  }
}

export type WebPostListItem = {
  id: number;
  title: string;
  url: string;
  excerpt: string | null;
};

export async function getRelatedWebPosts(title: string, limit = 5): Promise<WebPostListItem[]> {
  try {
    const sql = `
      SELECT id, title, url, excerpt,
             blog.similarity(title, $1) AS sim
      FROM blog.web_posts
      WHERE blog.similarity(title, $1) > 0.1
      ORDER BY sim DESC
      LIMIT $2
    `;
    const { rows } = await query<WebPostListItem & { sim: number }>(sql, [title, limit]);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      excerpt: row.excerpt
    }));
  } catch (e) {
    console.warn('Failed to get related web posts:', e);
    return [];
  }
}
 
