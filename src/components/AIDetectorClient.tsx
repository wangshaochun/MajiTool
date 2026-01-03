"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

type DetectionResult = {
  probability: number;
  indicators: string[];
  analysis: {
    repetitionScore: number;
    perplexityScore: number;
    structureScore: number;
    vocabularyScore: number;
    japaneseScore: number;
    ngramScore: number;
    sentenceVarietyScore: number;
    emotionalScore: number;
    punctuationScore: number;
    semanticScore: number;
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

    const ngramScore = analyzeNgrams(text);
    if (ngramScore > 0.4) indicators.push("フレーズの繰り返しパターンを検出");

    const sentenceVarietyScore = analyzeSentenceVariety(text);
    if (sentenceVarietyScore > 0.6) indicators.push("句式の多様性が不足");

    const emotionalScore = analyzeEmotionalTone(text);
    if (emotionalScore > 0.5) indicators.push("感情表現や個性が不足している");

    const punctuationScore = analyzePunctuationPattern(text);
    if (punctuationScore > 0.5) indicators.push("標点符号の使用パターンが規則的");

    const semanticScore = analyzeSemanticCoherence(text);
    if (semanticScore > 0.6) indicators.push("論理接続が完璧すぎる");

    // 改良された加重スコアリング（より多くの要素を考慮）
    const probability =
      repetitionScore * 0.12 +
      (1 - perplexityScore) * 0.12 +
      structureScore * 0.12 +
      vocabularyScore * 0.15 +
      japaneseScore * 0.12 +
      ngramScore * 0.12 +
      sentenceVarietyScore * 0.10 +
      emotionalScore * 0.08 +
      punctuationScore * 0.05 +
      semanticScore * 0.12;

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
        ngramScore,
        sentenceVarietyScore,
        emotionalScore,
        punctuationScore,
        semanticScore,
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
      "重要なことに",
      "言い換えれば",
      "具体的には",
      "例えば",
      "特に",
      "その結果",
      "このように",
      "そのため",
      "実際に",
      "明らかに",
      "確かに",
      "もちろん",
      "当然",
      "一般的に",
      "基本的に",
      "本質的に",
      "理論的に",
      "実践的に",
      "効果的に",
      "効率的に",
      "重要である",
      "必要である",
      "可能である",
      "望ましい",
      "適切である",
      "ご理解いただけ",
      "ご存じの通り",
      "述べたように",
      "前述のように",
      "上述のように",
      "下記のように",
      "以下のように",
      "次のように",
      "このことから",
      "これにより",
      "これらの",
      "それぞれの",
      "さまざまな",
      "多様な",
      "豊富な",
      "幅広い",
      "総合的な",
      "包括的な",
      "体系的な",
      "段階的な",
      "継続的な",
      "持続的な",
      "furthermore",
      "moreover",
      "however",
      "therefore",
      "consequently",
      "additionally",
      "specifically",
      "notably",
      "importantly",
      "essentially",
    ];
    let score = 0;
    const lower = text.toLowerCase();
    
    // AI接続詞・フレーズの頻度
    let matchCount = 0;
    for (const ind of aiIndicators) {
      const matches = lower.match(new RegExp(ind, "gi"));
      if (matches) {
        matchCount += matches.length;
        score += matches.length * 0.05;
      }
    }
    
    // 接続詞密度が異常に高い場合
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length > 0 && matchCount / sentences.length > 0.8) {
      score += 0.2;
    }

    // 標点符号の均一性
    const punctuation = text.match(/[、。！？，．,\.!?]/g);
    if (punctuation && text.length > 100) {
      const ratio = punctuation.length / (text.length / 50);
      if (ratio > 0.8 && ratio < 1.2) score += 0.15;
    }

    // 「である」調の過剰使用（AIの特徴）
    const dearu = text.match(/である[。、]/g);
    if (dearu && sentences.length > 0) {
      if (dearu.length / sentences.length > 0.3) score += 0.15;
    }

    // 完璧すぎる段落構成（各段落が同じパターンで始まる）
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length >= 3) {
      const starts = paragraphs.map(p => {
        const firstSentence = p.trim().split(/[。.]/)[0];
        return firstSentence.slice(0, 5);
      });
      const uniqueStarts = new Set(starts);
      if (uniqueStarts.size < paragraphs.length * 0.7) score += 0.1;
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

  // N-gram分析：フレーズの繰り返しを検出
  function analyzeNgrams(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 3) return 0;

    // 2-gram（2語の組み合わせ）と3-gram分析
    const words = text.split(/[\s、。,．]+/).filter((w) => w && w.length > 1);
    const bigrams = new Map<string, number>();
    const trigrams = new Map<string, number>();

    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }

    for (let i = 0; i < words.length - 2; i++) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
    }

    let repeatedBigrams = 0;
    let repeatedTrigrams = 0;

    bigrams.forEach((count) => {
      if (count >= 3) repeatedBigrams += count;
    });

    trigrams.forEach((count) => {
      if (count >= 2) repeatedTrigrams += count * 2; // 3-gramの繰り返しはより重要
    });

    const ngramScore = Math.min(
      (repeatedBigrams + repeatedTrigrams) / Math.max(words.length, 1),
      1
    );

    return ngramScore;
  }

  // 句式多様性分析：文の開始と終了パターン
  function analyzeSentenceVariety(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 5) return 0;

    // 文の開始パターン
    const startPatterns = sentences.map((s) => {
      const trimmed = s.trim();
      return trimmed.slice(0, Math.min(3, trimmed.length));
    });

    // 文の終了パターン
    const endPatterns = sentences.map((s) => {
      const trimmed = s.trim();
      return trimmed.slice(-Math.min(3, trimmed.length));
    });

    const uniqueStarts = new Set(startPatterns);
    const uniqueEnds = new Set(endPatterns);

    // 多様性が低い場合、AIの可能性が高い
    const startDiversity = uniqueStarts.size / sentences.length;
    const endDiversity = uniqueEnds.size / sentences.length;

    // 文末が「です」「ます」「である」ばかりの場合
    const desmasuCount = sentences.filter(s => 
      /[でです|ます|である|でした|ました]$/.test(s.trim())
    ).length;
    const desmasuRatio = desmasuCount / sentences.length;

    let score = 0;
    if (startDiversity < 0.5) score += 0.3;
    if (endDiversity < 0.4) score += 0.3;
    if (desmasuRatio > 0.8) score += 0.4; // 過度に統一された文末

    return Math.min(score, 1);
  }

  // 感情・個性分析：AIは感情表現や個人的な意見が少ない
  function analyzeEmotionalTone(text: string): number {
    let score = 0;

    // 感情表現の欠如を検出
    const emotionalWords = [
      "嬉しい", "悲しい", "楽しい", "怒り", "驚き", "感動",
      "素晴らしい", "最高", "最悪", "ひどい", "美しい",
      "好き", "嫌い", "愛", "憎", "喜び", "苦しい",
      "面白い", "つまらない", "退屈", "興奮", "感激",
      "！", "!!", "？？", "...", "笑", "涙", "😊", "😂"
    ];

    let emotionalCount = 0;
    const lower = text.toLowerCase();
    for (const word of emotionalWords) {
      const matches = text.match(new RegExp(word, "g"));
      if (matches) emotionalCount += matches.length;
    }

    // 個人的な表現・口語表現
    const personalExpressions = [
      "私は", "僕は", "俺は", "自分は", "個人的に", "思う", "感じる",
      "〜だと思います", "〜かもしれません", "〜でしょう", "〜かな",
      "まあ", "なんか", "ちょっと", "けっこう", "すごく", "めちゃくちゃ",
      "ぶっちゃけ", "正直", "やっぱり", "やはり"
    ];

    let personalCount = 0;
    for (const expr of personalExpressions) {
      const matches = lower.match(new RegExp(expr, "g"));
      if (matches) personalCount += matches.length;
    }

    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length > 0) {
      // 感情表現がほとんどない場合、AIの可能性が高い
      const emotionalDensity = emotionalCount / sentences.length;
      const personalDensity = personalCount / sentences.length;

      if (emotionalDensity < 0.1) score += 0.4;
      if (personalDensity < 0.15) score += 0.3;

      // 完全に客観的・事実的な記述のみ（AIの特徴）
      if (emotionalDensity === 0 && personalDensity === 0 && sentences.length > 5) {
        score += 0.3;
      }
    }

    return Math.min(score, 1);
  }

  // 標点符号パターン分析
  function analyzePunctuationPattern(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 3) return 0;

    let score = 0;

    // 読点（、）の使用パターン
    const commaPerSentence = sentences.map(s => 
      (s.match(/、/g) || []).length
    );

    if (commaPerSentence.length > 0) {
      const avg = commaPerSentence.reduce((a, b) => a + b, 0) / commaPerSentence.length;
      const variance = commaPerSentence.reduce((sum, count) => 
        sum + Math.pow(count - avg, 2), 0
      ) / commaPerSentence.length;

      // 読点の使用が極めて均一（AIの特徴）
      if (variance < 0.5 && avg > 0.5) score += 0.3;
    }

    // 感嘆符や疑問符の欠如
    const exclamations = (text.match(/[！!]/g) || []).length;
    const questions = (text.match(/[？?]/g) || []).length;
    if (sentences.length > 5 && exclamations === 0 && questions === 0) {
      score += 0.3;
    }

    // 括弧の過剰な使用（AIが説明を追加する傾向）
    const brackets = (text.match(/[（(][^）)]+[）)]/g) || []).length;
    if (brackets / sentences.length > 0.5) score += 0.2;

    // 箇条書きの規則性
    const listItems = text.match(/^[・●○►▸※]\s/gm);
    if (listItems && listItems.length >= 3) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  // 意味的連接性分析：論理接続が完璧すぎる
  function analyzeSemanticCoherence(text: string): number {
    const sentences = text.split(/[。.!?！？]+/).filter((s) => s.trim());
    if (sentences.length < 3) return 0;

    let score = 0;

    // 完璧すぎる論理接続詞の連続
    const transitions = [
      "まず", "次に", "さらに", "最後に", "第一に", "第二に", "第三に",
      "したがって", "つまり", "要するに", "このように", "そのため",
      "一方", "しかし", "ただし", "それに対して", "これに対して"
    ];

    let consecutiveTransitions = 0;
    let totalTransitions = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const hasTransition = transitions.some(t => sentence.startsWith(t));
      
      if (hasTransition) {
        totalTransitions++;
        if (i > 0 && transitions.some(t => sentences[i - 1].trim().startsWith(t))) {
          consecutiveTransitions++;
        }
      }
    }

    // 接続詞の使用率が高すぎる（50%以上の文が接続詞で始まる）
    if (totalTransitions / sentences.length > 0.5) score += 0.4;

    // 連続する接続詞の使用（まず...次に...最後に...のパターン）
    if (consecutiveTransitions >= 2) score += 0.3;

    // 完璧な三段構成（序論・本論・結論）を検出
    const hasIntro = /まず|はじめに|第一に/.test(text);
    const hasBody = /次に|さらに|また|第二に/.test(text);
    const hasConclusion = /最後に|結論|要約|まとめ|総括/.test(text);
    
    if (hasIntro && hasBody && hasConclusion && sentences.length < 15) {
      score += 0.3; // 短い文章で完璧な構成＝AIの可能性
    }

    return Math.min(score, 1);
  }

  const charCount = useMemo(() => inputText.length, [inputText]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Image src="/images/ai-detector.svg" alt="" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10" />
          AI コンテンツ検出器
        </h1>
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
              <Metric label="🔗 N-gramパターン" value={result.analysis.ngramScore} />
              <Metric label="📝 句式多様性" value={result.analysis.sentenceVarietyScore} invert />
              <Metric label="💭 感情・個性" value={result.analysis.emotionalScore} />
              <Metric label="📍 標点符号" value={result.analysis.punctuationScore} />
              <Metric label="🧠 意味連接性" value={result.analysis.semanticScore} />
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
              title="1. 繰り返しパターン分析 (12%)"
              items={[
                "同じ単語やフレーズの過度な繰り返しを検出",
                "AIは特定のトークンを繰り返し使用する傾向",
                "繰り返し率30%超でフラグ",
                "例：『重要です』が文章中に5回以上",
              ]}
            />
            <RuleBlock
              title="2. 語彙多様性分析 (12%)"
              items={[
                "ユニークな単語の比率（パープレキシティの簡易近似）",
                "多様性40%未満でフラグ",
                "式：ユニーク単語数 ÷ 総単語数",
              ]}
            />
            <RuleBlock
              title="3. 構造規則性分析 (12%)"
              items={[
                "文の長さの均一性（変動係数が低いと規則的）",
                "すべての文が同程度の長さだとフラグ",
              ]}
            />
            <RuleBlock
              title="4. AI語彙特徴分析 (15%)"
              items={[
                "『まず』『次に』『最後に』『したがって』等の密度",
                "接続詞の過剰使用（文の80%以上で検出）",
                "『である』調の過度な使用",
                "完璧すぎる段落構成パターン",
              ]}
            />
            <RuleBlock
              title="5. 日本語特有の特徴分析 (12%)"
              items={[
                "敬語の過剰使用（ございます/いたします 等）",
                "完璧な接続パターン（です。それは/ます。これは 等）",
                "カタカナ語の均一性、段落長の規則性",
              ]}
            />
            <RuleBlock
              title="6. N-gramフレーズ分析 (12%)"
              items={[
                "2語・3語の組み合わせの繰り返しパターンを検出",
                "同じフレーズが複数回出現する場合にフラグ",
                "例：『重要なポイント』が3回以上繰り返される",
              ]}
            />
            <RuleBlock
              title="7. 句式多様性分析 (10%)"
              items={[
                "文の開始パターンと終了パターンの多様性",
                "文末が『です』『ます』『である』ばかりの場合",
                "80%以上の文が同じ文末形式→AIの可能性",
              ]}
            />
            <RuleBlock
              title="8. 感情・個性分析 (8%)"
              items={[
                "感情表現（嬉しい、悲しい等）の欠如を検出",
                "個人的表現（私は、思う等）の不足",
                "完全に客観的な記述のみ→AIの特徴",
                "口語表現や感嘆符の不在",
              ]}
            />
            <RuleBlock
              title="9. 標点符号パターン分析 (5%)"
              items={[
                "読点（、）の使用が極めて均一",
                "感嘆符（！）や疑問符（？）の欠如",
                "括弧による説明の過剰な追加",
                "規則的な箇条書きの使用",
              ]}
            />
            <RuleBlock
              title="10. 意味連接性分析 (12%)"
              items={[
                "完璧すぎる論理接続詞の連続使用",
                "50%以上の文が接続詞で始まる場合",
                "『まず→次に→最後に』の完璧な三段構成",
                "短い文章で序論・本論・結論が明確すぎる",
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

function Metric({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const displayValue = invert ? 1 - value : value;
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-3">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="text-slate-900 font-bold">{(displayValue * 100).toFixed(1)}%</div>
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
