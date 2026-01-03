"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import debounce from 'lodash.debounce';
import ShareButtons from '@/components/ShareButtons';

const DEFAULT_MD = `# Markdown エディタへようこそ\n`;

type Stat = { lines: number; words: number; chars: number };

// metadata は同階層の layout.tsx に移動しました（クライアントコンポーネントでは export 不可）

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>('');
  const [leftWidth, setLeftWidth] = useState<number>(50); 
  const [isDragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('サンプル.md');
  const leftRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 初期化 / ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('markdown_draft');
    setMarkdown(saved ?? DEFAULT_MD);
  }, []);

  // 自動保存（デバウンス）
  const autosave = useMemo(
    () =>
      debounce((content: string) => {
        localStorage.setItem('markdown_draft', content);
      }, 400),
    []
  );

  useEffect(() => {
    autosave(markdown);
  }, [markdown, autosave]);

  // 統計
  const stat: Stat = useMemo(() => {
    const lines = markdown.split(/\n/).length;
    const words = (markdown.match(/[^\s]+/g) || []).length;
    const chars = markdown.length;
    return { lines, words, chars };
  }, [markdown]);

  // ユーティリティ：選択テキストを囲む / テンプレート挿入
  const wrapSelection = (before: string, after = before) => {
    const el = leftRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = markdown.slice(start, end);
    const newValue = markdown.slice(0, start) + before + selected + after + markdown.slice(end);
    setMarkdown(newValue);
    // 复位光标
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length + selected.length + after.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(Math.min(6, Math.max(1, level))) + ' ';
    wrapSelection('\n' + prefix, '');
  };

  const insertList = (ordered = false) => {
    const el = leftRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = markdown.slice(start, end) || 'リスト項目';
    const lines = selected.split(/\n/).map((l, i) => (ordered ? `${i + 1}. ${l}` : `- ${l}`));
    const content = '\n' + lines.join('\n') + '\n';
    const newValue = markdown.slice(0, start) + content + markdown.slice(end);
    setMarkdown(newValue);
  };

  const insertCodeBlock = (lang = '') => {
    wrapSelection('\n```' + lang + '\n', '\n```\n');
  };

  const insertTable = () => {
    const tpl = `\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| a | b | c |\n`;
    wrapSelection(tpl, '');
  };

  const insertLink = () => wrapSelection('[テキスト](', ')');
  const insertImage = () => wrapSelection('![代替テキスト](', ')');
  const bold = () => wrapSelection('**');
  const italic = () => wrapSelection('*');
  const strike = () => wrapSelection('~~');
  const inlineCode = () => wrapSelection('`');

  // 同期スクロール：エディタのスクロール位置に合わせてプレビューをスクロール
  const onEditorScroll = () => {
    const ta = leftRef.current;
    const pv = previewRef.current;
    if (!ta || !pv) return;
    const ratio = ta.scrollTop / (ta.scrollHeight - ta.clientHeight || 1);
    pv.scrollTop = ratio * (pv.scrollHeight - pv.clientHeight);
  };

  // ドラッグで分割バーを移動
  const onMouseDown = () => setDragging(true);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(80, Math.max(20, percent)));
  };
  const onMouseUp = () => setDragging(false);

  // ダウンロード / エクスポート
  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'note.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setMarkdown(text);
    setFileName(f.name.endsWith('.md') ? f.name : `${f.name}.md`);
    ev.target.value = '';
  };

  // スニペット挿入
  const insertSnippet = (snippet: string) => {
    wrapSelection('\n' + snippet + '\n', '');
  };

  // よく使う Markdown 文法 10 選
  const examples: { title: string; code: string }[] = [
    { title: '見出し', code: '# タイトル\n## サブタイトル\n### セクション' },
    { title: '強調', code: '**太字** *斜体* ~~取り消し~~' },
    { title: 'リンク', code: '[リンクテキスト](https://example.com)' },
    { title: '画像', code: '![代替テキスト](https://via.placeholder.com/150 "タイトル")' },
    { title: '箇条書き', code: '- 項目1\n- 項目2\n  - ネスト' },
    { title: '番号付きリスト', code: '1. 一\n2. 二\n3. 三' },
  { title: 'インラインコード', code: '`const a = 1`' },
  { title: 'コードブロック', code: '```ts\nfunction greet(name: string) {\n  return `Hello, ${name}!`;\n}\n```' },
    { title: '引用', code: '> 引用\n>> 入れ子の引用' },
    { title: 'テーブル', code: '| 列A | 列B |\n| --- | --- |\n| 1 | 2 |' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
        <Image src="/images/markdown.svg" alt="" width={32} height={32} className="w-8 h-8" />
        Markdown エディタ
      </h1>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}
        >
        {/* ツールバー */}
        <div className="flex items-center gap-2 border border-gray-200 border-b-0 bg-gray-50 px-3 py-2 rounded-t-md">
            <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="見出し 1" onClick={() => insertHeading(1)}>H1</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="見出し 2" onClick={() => insertHeading(2)}>H2</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="見出し 3" onClick={() => insertHeading(3)}>H3</button>
            </div>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100 font-bold" title="太字" onClick={bold}>B</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100 italic" title="斜体" onClick={italic}>I</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100 line-through" title="取り消し線" onClick={strike}>S</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="インラインコード" onClick={inlineCode}>{'<>'}</button>
            </div>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="箇条書き" onClick={() => insertList(false)}>• リスト</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="番号付き" onClick={() => insertList(true)}>1. リスト</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="コードブロック" onClick={() => insertCodeBlock('')}>{'</>'} コード</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="テーブル" onClick={insertTable}>表</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="リンク" onClick={insertLink}>リンク</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" title="画像" onClick={insertImage}>画像</button>
            </div>
            <div className="flex-1" />
            <input className="border rounded px-2 py-1 text-sm w-44" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="ファイル名" />
            <input ref={fileInputRef} type="file" accept=".md,.markdown,.txt" onChange={importFile} className="hidden" />
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" onClick={() => fileInputRef.current?.click()} title="Markdown をインポート">インポート</button>
            <button className="px-2 py-1 text-sm rounded border hover:bg-gray-100" onClick={download} title=".md としてダウンロード">ダウンロード</button>
        </div>

        {/* エディタ + プレビュー */}
        <div style={{ display: 'flex', border: '1px solid #eee', borderTop: 'none', flex: 1, minHeight: 0 }}>
            <div style={{ width: `${leftWidth}%`, minWidth: 200, display: 'flex', flexDirection: 'column' }}>
            <textarea
                ref={leftRef}
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                onScroll={onEditorScroll}
                style={{ width: '100%', height: '100%', resize: 'none', fontSize: 16, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', border: 'none', outline: 'none', padding: 16 }}
                placeholder="ここに Markdown を入力..."
            />
            <div style={{ display: 'flex', gap: 12, padding: '6px 12px', borderTop: '1px solid #eee', fontSize: 12, color: '#666' }}>
                <span>行: {stat.lines}</span>
                <span>語: {stat.words}</span>
                <span>文字: {stat.chars}</span>
            </div>
            </div>

            {/* 分割バー（ドラッグ可能） */}
            <div
            onMouseDown={onMouseDown}
            style={{ width: 6, cursor: 'col-resize', background: isDragging ? '#3b82f6' : '#f0f0f0' }}
            title="ドラッグして幅を調整"
            />
            <div style={{ flex: 1, minWidth: 200, position: 'relative', display: 'flex', flexDirection: 'column' }}> 
            <div ref={previewRef} style={{ flex: 1, overflow: 'auto', padding: 16 }}>
                <style>{`
                .markdown-body h1 { font-size: 2.2em; margin: 0.67em 0; font-weight: 700; }
                .markdown-body h2 { font-size: 1.9em; margin: 0.83em 0; font-weight: 700; }
                .markdown-body h3 { font-size: 1.6em; margin: 1em 0; font-weight: 700; }
                .markdown-body h4 { font-size: 1.3em; margin: 1.33em 0; font-weight: 700; }
                .markdown-body h5 { font-size: 1.1em; margin: 1.67em 0; font-weight: 700; }
                .markdown-body h6 { font-size: 1em; margin: 2em 0; font-weight: 700; color: #555; }
                .markdown-body pre { background: #0b1021; color: #e6e6e6; padding: 12px 14px; border-radius: 6px; overflow: auto; }
                .markdown-body code { background: rgba(27,31,35,.05); padding: 2px 6px; border-radius: 4px; }
                .markdown-body pre code { background: transparent; padding: 0; }
                .markdown-body table { border-collapse: collapse; width: 100%; margin: 12px 0; }
                .markdown-body th, .markdown-body td { border: 1px solid #e5e7eb; padding: 6px 10px; }
                .markdown-body blockquote { border-left: 4px solid #e5e7eb; padding: 4px 12px; color: #555; }
                .markdown-body a { color: #2563eb; text-decoration: underline; }
                .markdown-body ul, .markdown-body ol { padding-left: 1.4em; }
                `}</style>
                <div className="markdown-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {markdown}
                </ReactMarkdown>
                </div>
            </div>
            </div>
        </div>
        </div>

        {/* チートシート（よく使う文法 10 選） */}
        <details className="mt-4 border rounded-md bg-white overflow-hidden">
          <summary className="cursor-pointer select-none px-4 py-2 bg-gray-50 border-b text-sm font-medium">
            Markdown チートシート（よく使う文法10選）
          </summary>
          <div className="p-3 grid md:grid-cols-2 gap-3">
            {examples.map((ex, idx) => (
              <div key={idx} className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <span className="text-sm font-medium">{ex.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-xs rounded border hover:bg-gray-100"
                      onClick={() => insertSnippet(ex.code)}
                      title="エディタに挿入"
                    >
                      挿入
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded border hover:bg-gray-100"
                      onClick={() => navigator.clipboard.writeText(ex.code)}
                      title="クリップボードにコピー"
                    >
                      コピー
                    </button>
                  </div>
                </div>
                <pre className="m-0 p-3 overflow-auto text-sm bg-[#0b1021] text-[#e6e6e6]"><code>{ex.code}</code></pre>
              </div>
            ))}
          </div>
        </details>

        <div className="mt-4"> 
            <ShareButtons title="Markdown エディタ" />
            </div>
    </div>
  );
}
