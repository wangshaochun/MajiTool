"use client";

import Link from "next/link";
import ja from "../../locales/ja.json";

export default function Home() {
  const tools = [
    {
      name: "百分比計算",
      description: "パーセント・比率・割引・増減など多用途の計算ツール。",
      link: "/percent-calc",
      icon: "％",
    },
    {
      name: ja.random_password_generator,
      description: ja.random_password_description,
      link: "/random-password",
      icon: "🔒",
    },
  ];

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          {ja.homepage_title}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {ja.homepage_subtitle}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            href={tool.link}
            key={tool.name}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4">{tool.icon}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {tool.name}
                </h2>
                <p className="text-gray-600 mt-1">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
