import { NextRequest } from "next/server";
import { getPostBySlug, updatePost, deletePost, type UpdatePostInput } from "@/lib/posts";

export const revalidate = 0;

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function getToken(req: NextRequest) {
  const h1 = req.headers.get("x-api-token");
  const h2 = req.headers.get("authorization");
  const token = h1 ?? (h2?.toLowerCase().startsWith("bearer ") ? h2.slice(7) : undefined);
  return token;
}

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return json({ error: "NOT_FOUND" }, { status: 404 });
  return json({ data: post });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
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
  const input = (body ?? {}) as Partial<UpdatePostInput>;
  if (
    input.title === undefined &&
    input.content_md === undefined &&
    input.excerpt === undefined
  ) {
    return json({ error: "NO_FIELDS" }, { status: 400 });
  }

  const updated = await updatePost(params.slug, input as UpdatePostInput);
  if (!updated) return json({ error: "NOT_FOUND" }, { status: 404 });
  return json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const token = getToken(req);
  if (token !== "maji-tool-com") {
    return json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const ok = await deletePost(params.slug);
  if (!ok) return json({ error: "NOT_FOUND" }, { status: 404 });
  return json({ ok: true });
}
