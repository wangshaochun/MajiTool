/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-markdown" {
  const ReactMarkdown: any;
  export default ReactMarkdown;
}

declare module "remark-gfm" {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module "pg" {
  export class Pool {
    constructor(config?: any);
    query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>;
    connect(): Promise<any>;
  }
  export type QueryResult<T> = { rows: T[] };
}
