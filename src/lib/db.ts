import { Pool, type QueryResult } from "pg";

// 在开发环境下避免热重载导致的连接池重复创建
declare global {
  // 注意：这里使用 var 以兼容 Node.js 全局声明合并
  var pgPool: Pool | undefined;
}

function getSSL() {
  // 允许在某些托管平台（如 Render/Neon/Supabase）上启用 SSL
  const sslMode = process.env.PGSSL?.toLowerCase();
  if (sslMode === "require" || sslMode === "true") {
    return { rejectUnauthorized: false } as const;
  }
  return undefined;
}

const pool = global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: getSSL(),
  });

if (!global.pgPool) {
  global.pgPool = pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await pool.query<T>(text, params as any[] | undefined);
  return res;
}

export async function getClient() {
  return pool.connect();
}
