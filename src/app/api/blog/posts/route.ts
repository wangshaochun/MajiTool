import { NextRequest } from "next/server";
import { createPost, type CreatePostInput } from "@/lib/posts";

export const revalidate = 0;

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function getToken(req: NextRequest) {
  // 支持两种来源：自定义 header 或 Authorization Bearer
  const h1 = req.headers.get("x-api-token");
  const h2 = req.headers.get("authorization");
  const token = h1 ?? (h2?.toLowerCase().startsWith("bearer ") ? h2.slice(7) : undefined);
  return token;
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (token !== "maji-tool-com") {
    return json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const {title, content_md, excerpt, url, tags }: Partial<CreatePostInput> = (body ?? {}) as Partial<CreatePostInput>;
  if (!title || !content_md) {
    return json({ error: "MISSING_FIELDS", required: ["title", "content_md"] }, { status: 400 });
  }

  try {
    const post = await createPost({ title, content_md, excerpt: excerpt ?? null , url: url ?? '', tags: tags ?? '' });
    return json({ data: post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "DUPLICATE_TITLE") {
      return json({ error: "DUPLICATE_TITLE" }, { status: 409 });
    }
    return json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
