import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Markdown エディタ',
  description: 'リアルタイムでMarkdownを編集・プレビューできるエディタです。',
  keywords: ['Markdown', 'Editor'],
  openGraph: {
    title: 'Markdown エディタ | MajiTool',
    description: 'リアルタイムでMarkdownを編集・プレビューできるエディタです。',
    url: 'https://maji-tool.com/math/markdown',
    siteName: 'MajiTool',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
