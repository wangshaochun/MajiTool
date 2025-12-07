"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

type Props = {
  content: string;
};

export default function Markdown({ content }: Props) {
  return (
    <div className="prose max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
    </div>
  );
}
