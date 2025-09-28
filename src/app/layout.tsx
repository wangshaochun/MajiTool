import type { Metadata } from 'next';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: '%s - MajiTool',
    default: 'MajiTool - オンラインツールハブ'
  },
  description: '日々のタスクを効率化するシンプルでパワフルなオンラインツールコレクション。画像編集、数学計算など、無料でご利用いただけます。',
  keywords: 'オンラインツール, 画像編集, 数学計算, ユーティリティ, 無料ツール',
  authors: [{ name: 'MajiTool' }],
  creator: 'MajiTool',
  publisher: 'MajiTool',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'MajiTool',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
