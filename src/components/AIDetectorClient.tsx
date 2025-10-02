"use client";

import React, { useMemo, useState } from "react";

type DetectionResult = {
  probability: number;
  indicators: string[];
  analysis: {
    repetitionScore: number;
    perplexityScore: number;
    structureScore: number;
    vocabularyScore: number;
    japaneseScore: number;
  };
};

export default function AIDetectorClient() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 

  const disabled = isAnalyzing || inputText.trim().length === 0;

  const analyze = async () => {
    if (disabled) return;
    setIsAnalyzing(true);
    // 小さな遅延でUX向上
    await new Promise((r) => setTimeout(r, 200));
    const r = detectAIContent(inputText);
    setResult(r);
    setIsAnalyzing(false);
  };

  const clear = () => {
    setInputText("");
    setResult(null);
  };

  const getProbabilityColor = (p: number) => {
    if (p >= 0.7) return "#ef4444"; // red
    if (p >= 0.4) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  const getProbabilityLabel = (p: number) => {
    if (p >= 0.8) return "非常に高い";
    if (p >= 0.6) return "高い";
    if (p >= 0.4) return "中程度";
    if (p >= 0.2) return "低い";
    return "非常に低い";
  };

  // ---- Detection core logic (heuristics) ----
  function detectAIContent(text: string): DetectionResult {
    const indicators: string[] = [];

    const repetitionScore = analyzeRepetition(text);
    if (repetitionScore > 0.3) indicators.push("高い繰り返しパターンを検出");

    const perplexityScore = analyzePerplexity(text);
    if (perplexityScore < 0.4) indicators.push("語彙の多様性が低い");

    const structureScore = analyzeStructure(text);
    if (structureScore > 0.6) indicators.push("文章構造が規則的すぎる");

    const vocabularyScore = analyzeVocabulary(text);
    if (vocabularyScore > 0.5) indicators.push("典型的なAI語彙パターンを使用");

    const japaneseScore = analyzeJapaneseFeatures(text);
    if (japaneseScore > 0.5) indicators.push("AIが生成した日本語の特徴を検出");

    const probability =
      repetitionScore * 0.2 +
      (1 - perplexityScore) * 0.2 +
      structureScore * 0.2 +
      vocabularyScore * 0.2 +
      japaneseScore * 0.2;

    if (probability > 0.7) {
      indicators.push("全体的なスタイルがAI生成の特徴に高度に一致");
    } else if (probability < 0.3) {
      indicators.push("コンテンツは人間の執筆スタイルに近い");
    }

    return {
      probability: Math.min(Math.max(probability, 0), 1),
      indicators,
      analysis: {
        repetitionScore,
        perplexityScore,
        structureScore,
        vocabularyScore,
        japaneseScore,
      },
    };
  }

  function analyzeRepetition(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 2) return 0;

    const words = text.split(/[\s、。,．]+/).filter((w) => w);
    const freq = new Map<string, number>();
    for (const w of words) {
      const n = w.toLowerCase().trim();
      if (n.length > 1) freq.set(n, (freq.get(n) || 0) + 1);
    }
    let repetitionCount = 0;
    freq.forEach((cnt) => {
      if (cnt > 3) repetitionCount += cnt;
    });
    return words.length ? Math.min(repetitionCount / words.length, 1) : 0;
  }

  function analyzePerplexity(text: string): number {
    const words = text.split(/[\s、。,．]+/).filter((w) => w.length > 0);
    const uniq = new Set(words.map((w) => w.toLowerCase()));
    if (words.length === 0) return 0;
    return uniq.size / words.length;
  }

  function analyzeStructure(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 3) return 0;
    const lengths = sentences.map((s) => s.trim().length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) /
      lengths.length;
    const std = Math.sqrt(variance);
    const cv = std / (avg || 1);
    return Math.max(0, 1 - cv);
  }

  function analyzeVocabulary(text: string): number {
    const aiIndicators = [
      "まず",
      "まず第一に",
      "次に",
      "最後に",
      "しかし",
      "したがって",
      "さらに",
      "同時に",
      "また",
      "注目すべき",
      "指摘すべき",
      "つまり",
      "要するに",
      "結論として",
      "総じて",
      "一方",
      "それでは",
      "ところで",
      "ちなみに",
      "なお",
      "ただし",
      "furthermore",
      "moreover",
      "however",
      "therefore",
      "consequently",
    ];
    let score = 0;
    const lower = text.toLowerCase();
    for (const ind of aiIndicators) {
      const matches = lower.match(new RegExp(ind, "gi"));
      if (matches) score += matches.length * 0.08;
    }
    const punctuation = text.match(/[、。！？，．,\.!?]/g);
    if (punctuation && text.length > 100) {
      const ratio = punctuation.length / (text.length / 50);
      if (ratio > 0.8 && ratio < 1.2) score += 0.2;
    }
    return Math.min(score, 1);
  }

  function analyzeJapaneseFeatures(text: string): number {
    let score = 0;
    const keigo = ["ございます", "いただき", "させていただ", "いたします", "であります"];
    for (const k of keigo) {
      const m = text.match(new RegExp(k, "g"));
      if (m && m.length > text.length / 200) score += 0.1;
    }
    const perfectPatterns = [/です。\s*それは/g, /ます。\s*これは/g, /である。\s*つまり/g];
    for (const p of perfectPatterns) if (p.test(text)) score += 0.1;

    const katakana = text.match(/[ァ-ヴー]{3,}/g);
    if (katakana && katakana.length > 0) {
      const uniq = new Set(katakana);
      if (katakana.length / (uniq.size || 1) > 2) score += 0.15;
    }
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length >= 3) {
      const lens = paragraphs.map((p) => p.length);
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
      const variance = lens.reduce((s, l) => s + Math.pow(l - avg, 2), 0) / lens.length;
      if (variance < avg * 0.3) score += 0.15;
    }
    return Math.min(score, 1);
  }

  const charCount = useMemo(() => inputText.length, [inputText]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI コンテンツ検出器</h1>
        <p className="text-gray-600 text-sm">
          テキストコンテンツを分析し、AIによって生成された可能性を検出します（参考値）。
        </p>
      </div>

      {/* 入力 */}
      <div className="mb-4">
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
          検出対象のテキストを入力：
        </label>
        <textarea
          id="text-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            "検出したいテキストコンテンツを入力してください。\n\n注意：このツールはヒューリスティックルールベースの分析を行います。参考値としてご利用ください。"
          }
          rows={12}
          className="w-full rounded-md border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 font-sans"
          disabled={isAnalyzing}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          文字数: {charCount}
          {charCount > 0 && charCount < 100 && (
            <span className="text-amber-600 font-semibold ml-1">（100文字以上推奨）</span>
          )}
        </div>
      </div>

      {/* 操作 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={analyze}
          disabled={disabled}
          className="flex-1 py-3 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "⏳ 分析中..." : "🔍 検出開始"}
        </button>
        <button
          onClick={clear}
          disabled={isAnalyzing}
          className="flex-1 py-3 px-4 rounded-md font-semibold bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          🗑️ クリア
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-6 animate-[fadeIn_0.5s_ease]">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">検出結果</h3>

          <div className="text-center mb-4 p-5 bg-white rounded-xl shadow">
            <div className="text-sm text-gray-600 mb-2">AI生成確率</div>
            <div
              className="font-extrabold"
              style={{ color: getProbabilityColor(result.probability), fontSize: "52px" }}
            >
              {(result.probability * 100).toFixed(1)}%
            </div>
            <div
              className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: getProbabilityColor(result.probability) }}
            >
              {getProbabilityLabel(result.probability)}
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden mb-6">
            <div
              className="h-3 transition-all"
              style={{
                width: `${result.probability * 100}%`,
                backgroundColor: getProbabilityColor(result.probability),
              }}
            />
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">詳細分析</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Metric label="🔄 繰り返しスコア" value={result.analysis.repetitionScore} />
              <Metric label="📚 語彙多様性" value={result.analysis.perplexityScore} />
              <Metric label="📐 構造規則性" value={result.analysis.structureScore} />
              <Metric label="🤖 AI語彙特徴" value={result.analysis.vocabularyScore} />
              <Metric label="🈶 日本語特徴" value={result.analysis.japaneseScore} />
            </div>
          </div>

          {result.indicators.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-2">検出された指標</h4>
              <ul className="list-none space-y-2">
                {result.indicators.map((it, idx) => (
                  <li key={idx} className="bg-white rounded-md shadow px-3 py-2 text-sm text-slate-800">
                    <span className="mr-1">⚠️</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm bg-amber-50 border-l-4 border-amber-400 rounded p-3 text-amber-800">
            <strong className="block mb-1">⚠️ 免責事項：</strong>
            このツールは簡易的なヒューリスティックアルゴリズムを使用しており、検出結果は参考値としてご利用ください。正確なAIコンテンツ検出には、複雑なディープラーニングモデルと大量のトレーニングデータが必要です。
          </div>
        </div>
      )}
      
      {/* ルール説明 */}
      <div className="mb-6">
        
        {  (
          <div className="mt-4 bg-slate-50 border-2 border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">🔍 AI検出ルールの説明</h2>
            <RuleBlock
              title="1. 繰り返しパターン分析 (20%)"
              items={[
                "同じ単語やフレーズの過度な繰り返しを検出",
                "AIは特定のトークンを繰り返し使用する傾向",
                "繰り返し率30%超でフラグ",
                "例：『重要です』が文章中に5回以上",
              ]}
            />
            <RuleBlock
              title="2. 語彙多様性分析 (20%)"
              items={[
                "ユニークな単語の比率（パープレキシティの簡易近似）",
                "多様性40%未満でフラグ",
                "式：ユニーク単語数 ÷ 総単語数",
              ]}
            />
            <RuleBlock
              title="3. 構造規則性分析 (20%)"
              items={[
                "文の長さの均一性（変動係数が低いと規則的）",
                "すべての文が同程度の長さだとフラグ",
              ]}
            />
            <RuleBlock
              title="4. AI語彙特徴分析 (20%)"
              items={[
                "『まず』『次に』『最後に』『したがって』等の密度",
                "句読点の均一性も加点",
              ]}
            />
            <RuleBlock
              title="5. 日本語特有の特徴分析 (20%)"
              items={[
                "敬語の過剰使用（ございます/いたします 等）",
                "完璧な接続パターン（です。それは/ます。これは 等）",
                "カタカナ語の均一性、段落長の規則性",
              ]}
            />
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded p-3 text-amber-800 text-sm">
              <p className="font-semibold mb-1">⚠️ 重要な注意事項</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>本ツールはヒューリスティック（経験則）ベースの簡易検出器です。</li>
                <li>結果は参考値であり、100%の精度は保証されません。</li>
                <li>学術的・フォーマル文書は人間作成でも高スコアになる場合があります。</li>
                <li>必要に応じて他のAI検出ツールと併用してください。</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-3">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="text-slate-900 font-bold">{(value * 100).toFixed(1)}%</div>
    </div>
  );
}

function RuleBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-slate-800 font-semibold mb-2 flex items-center before:content-['▸'] before:text-indigo-500 before:mr-2">
        {title}
      </h3>
      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
