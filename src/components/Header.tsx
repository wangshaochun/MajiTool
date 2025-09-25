"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-end space-x-2 group select-none">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md transition group-hover:scale-105 group-hover:drop-shadow-lg">MajiTool</span>
              <span className="text-xl font-semibold text-gray-500 tracking-wide ml-1 group-hover:text-pink-500 transition"></span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/image" className="text-base text-gray-700 hover:text-blue-600 font-medium transition">画像ツール</Link>
            <Link href="/math" className="text-base text-gray-700 hover:text-blue-600 font-medium transition">数学ツール</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
