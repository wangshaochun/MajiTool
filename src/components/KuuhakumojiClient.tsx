"use client";

import { useState, useRef } from "react";

type BlankChar = {
  name: string;
  code: string;
  char: string;
  desc: string;
};

const BLANK_CHARS: BlankChar[] = [
  { name: "点字空白パターン (Braille Pattern Blank)", code: "U+2800", char: "\u2800", desc: "SNSやゲームのユーザー名によく使われます。" },
  { name: "ハングル補充文字 (Hangul Filler)", code: "U+3164", char: "\u3164", desc: "一部のシステムで完全に透明に見えます。" },
  { name: "ゼロ幅スペース (Zero Width Space)", code: "U+200B", char: "\u200B", desc: "幅を持たない不可視文字です。" },
  { name: "通常のスペース (Space)", code: "U+0020", char: "\u0020", desc: "一般的な空白です。" },
  { name: "全角スペース (Ideographic Space)", code: "U+3000", char: "\u3000", desc: "日本語の全角空白です。" },
];

export default function KuuhakumojiClient() {
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [genCount, setGenCount] = useState<number>(1);
  const [genChar, setGenChar] = useState<string>(BLANK_CHARS[0].char);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [testText, setTestText] = useState<string>("");
  
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label}をコピーしました！`);
      setTimeout(() => setCopyStatus(""), 3000);
    } catch (err) {
      setCopyStatus("コピーに失敗しました。");
    }
  };

  const handleGenerate = () => {
    const text = genChar.repeat(Math.max(1, Math.min(1000, genCount)));
    setGeneratedText(text);
  };

  const analyzeText = (text: string) => {
    const total = text.length;
    // Simple regex for common invisible/whitespace chars
    // This includes standard whitespace and specific invisible chars
    const invisibleRegex = /[\u0020\u00A0\u2000-\u200D\u2028\u202F\u205F\u2060-\u2064\u00AD\u3000\u2800\u3164\u115F\u1160\u034F\u061C\u180E\uFEFF\uFFFC\uFE00-\uFE0F\uE0020\t\n\r]/g;
    const matches = text.match(invisibleRegex);
    const invisibleCount = matches ? matches.length : 0;
    return { total, invisibleCount };
  };

  const analysis = analyzeText(testText);

  return (
    <div className="space-y-12">
      {/* Notification */}
      {copyStatus && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {copyStatus}
        </div>
      )}

      {/* Method 1: Quick Copy */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
          クイックコピー
        </h2>
        <p className="text-gray-600 mb-6">
          最も汎用性の高い「点字空白パターン (U+2800)」をワンクリックでコピーできます。
          InstagramやTwitter(X)のプロフィール、ゲームのユーザー名などに最適です。
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => handleCopy("\u2800", "空白文字")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            空白文字をコピー
          </button>
        </div>
      </section>

      {/* Method 2: Generator */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
          複数生成ツール
        </h2>
        <p className="text-gray-600 mb-6">
          指定した長さの空白文字を生成します。改行やスペース埋めに便利です。
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文字の種類</label>
              <select 
                value={genChar} 
                onChange={(e) => setGenChar(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              >
                {BLANK_CHARS.map((c) => (
                  <option key={c.code} value={c.char}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文字数 (1-1000)</label>
              <input 
                type="number" 
                min="1" 
                max="1000" 
                value={genCount} 
                onChange={(e) => setGenCount(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>
            <button 
              onClick={handleGenerate}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              生成する
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md relative">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">プレビュー / 結果</label>
            <div className="min-h-[100px] break-all font-mono text-sm bg-white p-3 rounded border border-gray-200 mb-10">
              {generatedText || <span className="text-gray-400 italic">ここに生成された空白が表示されます...</span>}
            </div>
            <div className="absolute bottom-4 right-4">
              <button 
                onClick={() => handleCopy(generatedText, "生成された空白")}
                disabled={!generatedText}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  generatedText 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                コピー
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Method 3: Test & Analysis */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
          テスト＆分析
        </h2>
        <p className="text-gray-600 mb-6">
          テキストに含まれる空白文字（不可視文字）を検出・カウントします。
        </p>
        
        <div className="space-y-4">
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="ここにテキストを貼り付けてください..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">総文字数</div>
              <div className="text-3xl font-bold text-blue-600">{analysis.total}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">不可視文字数</div>
              <div className="text-3xl font-bold text-purple-600">{analysis.invisibleCount}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
