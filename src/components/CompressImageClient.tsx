"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";

// 画像圧縮用クライアントコンポーネント
// - 画像を読み込み、品質（圧縮率）と形式（JPEG/WEBP）を選んで容量を削減
// - プレビューし、圧縮後のサイズを表示、ダウンロード可能
// - すべてブラウザ内で完結（サーバーにアップロードされません）
export default function CompressImageClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/webp");
  const [quality, setQuality] = useState<number>(80); // 10-100
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [origBytes, setOrigBytes] = useState<number | null>(null);
  const [compBytes, setCompBytes] = useState<number | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Object URL のクリーンアップ
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [imageUrl, compressedUrl]);

  const toReadable = (bytes?: number | null) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // 画像読込
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }
    const url = URL.createObjectURL(file);
    setOrigBytes(file.size);
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルをドロップしてください。");
      return;
    }
    const url = URL.createObjectURL(file);
    setOrigBytes(file.size);
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  const preventDefault = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 圧縮処理
  const recompress = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // 品質 0-1 に変換
    const q = Math.min(100, Math.max(10, quality)) / 100;

    // toBlob は非同期
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), format, q)
    );
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    setCompressedUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setCompBytes(blob.size);
  }, [format, quality]);

  // 画像の読み込みまたは設定変更時に圧縮
  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      void recompress();
    };
    img.onerror = () => alert("画像の読み込みに失敗しました。");
    img.src = imageUrl;
  }, [imageUrl, recompress]);

  useEffect(() => {
    // 品質や形式の変更だけで再圧縮
    if (imgRef.current) void recompress();
  }, [quality, format, recompress]);

  const onDownload = useCallback(() => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = format === "image/webp" ? "compressed.webp" : "compressed.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [compressedUrl, format]);

  const maxPreviewWidth = 640;
  const displayScale = useMemo(() => {
    if (!naturalSize) return 1;
    return Math.min(1, maxPreviewWidth / naturalSize.w);
  }, [naturalSize]);

  const ratioText = useMemo(() => {
    if (origBytes == null || compBytes == null) return "-";
    if (origBytes === 0) return "-";
    const r = (compBytes / origBytes) * 100;
    return `${r.toFixed(1)}%`;
  }, [origBytes, compBytes]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">画像圧縮ツール</h1>
      <p className="text-gray-600 mb-6">
        画像の見た目を保ちながら容量を削減。品質（圧縮率）と出力形式を調整できます。処理は端末内で完結し、
        サーバーにはアップロードされません。
      </p>

      <div
        onDrop={onDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 bg-white text-center hover:border-blue-400 transition-colors"
      >
        <input id="file-input" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        <label htmlFor="file-input" className="cursor-pointer inline-block">
          <div className="text-gray-700">クリックして画像を選択、またはここにドラッグ＆ドロップ</div>
          <div className="text-xs text-gray-400 mt-1">PNG / JPG / GIF / WEBP など</div>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">出力形式</label>
            <select
              value={format}
              onChange={(e) =>
                setFormat((e.target.value === "image/jpeg" ? "image/jpeg" : "image/webp"))
              }
              className="w-full border rounded-md px-2 py-2"
            >
              <option value="image/webp">WEBP（推奨）</option>
              <option value="image/jpeg">JPEG</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">品質（圧縮率）: {quality}</label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">数値が低いほど容量は小さく、画質は低下します。</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">オリジナル</h2>
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-center items-center">
            {imageUrl && naturalSize ? (
              <NextImage
                src={imageUrl}
                alt="original"
                width={Math.max(1, Math.floor(naturalSize.w * displayScale))}
                height={Math.max(1, Math.floor(naturalSize.h * displayScale))}
                unoptimized
                style={{ maxWidth: "100%", height: "auto" }}
                priority
              />
            ) : (
              <div className="text-gray-400 text-sm py-16">画像が選択されていません</div>
            )}
          </div>
          <div className="text-xs text-gray-600 mt-2">サイズ: {toReadable(origBytes)}</div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">圧縮後</h2>
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-center items-center overflow-auto">
            <div style={{ transformOrigin: "top left", transform: `scale(${displayScale})` }}>
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
            <span>サイズ: {toReadable(compBytes)}</span>
            <span>圧縮率: {ratioText}</span>
          </div>
          <div className="mt-3">
            <button
              onClick={onDownload}
              disabled={!compressedUrl}
              className="px-4 py-2 rounded-md text-white bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              圧縮画像をダウンロード
            </button>
          </div>
        </div>
      </div>

      <details className="mt-8 bg-white rounded-lg p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">使い方</summary>
        <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
          <li>画像を選択（またはドラッグ＆ドロップ）するとプレビューされます。</li>
          <li>出力形式（WEBP/JPEG）と品質を調整して、見た目と容量のバランスを決めます。</li>
          <li>「圧縮画像をダウンロード」ボタンで保存できます。</li>
          <li>処理は端末内で完結します。画像はサーバーに送信されません。</li>
        </ul>
      </details>
    </div>
  );
}
