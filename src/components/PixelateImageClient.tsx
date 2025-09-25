"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";

// 画像ピクセル化用クライアントコンポーネント
// - ローカル画像を読み込み、ピクセルサイズ（ブロックサイズ）を指定してドット絵風に変換
// - 変換結果をプレビューし、PNGとしてダウンロード可能
// - すべてブラウザ上（オフライン）で完結し、サーバーにはアップロードされません
export default function PixelateImageClient() {
  // 選択された画像のプレビューURL（Object URL）
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // ピクセルサイズ（ブロックの大きさ、px）
  const [blockSize, setBlockSize] = useState<number>(12);
  // 表示上の最大横幅（レスポンシブのため）
  const maxPreviewWidth = 640;
  // 読み込んだ画像の自然サイズ（表示倍率の算出に使用）
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  // 読み込み済み画像オブジェクト
  const imageRef = useRef<HTMLImageElement | null>(null);
  // ピクセル化結果を描画するキャンバス
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Object URLのクリーンアップ
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // ファイル入力から画像を読み込む
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  // ドラッグ＆ドロップにも対応
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルをドロップしてください。");
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  const preventDefault = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // ピクセル化処理の本体
  const renderPixelated = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    // ブロックサイズから縮小後の解像度を算出（最小1）
    const smallW = Math.max(1, Math.floor(naturalW / blockSize));
    const smallH = Math.max(1, Math.floor(naturalH / blockSize));

    // 可視キャンバスは元の解像度に設定
    canvas.width = naturalW;
    canvas.height = naturalH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 中間（縮小）用のオフスクリーンキャンバス
    const off = document.createElement("canvas");
    off.width = smallW;
    off.height = smallH;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    // スムージングを有効にして縮小（平均化を得るため）
    offCtx.imageSmoothingEnabled = true;
    offCtx.clearRect(0, 0, smallW, smallH);
    offCtx.drawImage(img, 0, 0, naturalW, naturalH, 0, 0, smallW, smallH);

    // 再拡大時はスムージングを切ってドットを強調
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, naturalW, naturalH);
    ctx.drawImage(off, 0, 0, smallW, smallH, 0, 0, naturalW, naturalH);
  }, [blockSize]);

  // 画像の読み込み完了・ブロックサイズ変更のたびに再レンダリング
  useEffect(() => {
    if (!imageUrl) return;
  const img = new window.Image();
    img.onload = () => {
      imageRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      renderPixelated();
    };
    img.onerror = () => {
      alert("画像の読み込みに失敗しました。");
    };
    img.src = imageUrl;
  }, [imageUrl, renderPixelated]);

  // 結果をダウンロード
  const onDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "pixelated.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, []);

  // 表示用に、横幅を最大 maxPreviewWidth に収めるスケール
  const displayScale = useMemo(() => {
    if (!naturalSize) return 1;
    return Math.min(1, maxPreviewWidth / naturalSize.w);
  }, [naturalSize]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* タイトル */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">画像ピクセル化ツール</h1>
      <p className="text-gray-600 mb-6">
        画像をドット絵風に変換。ブロックサイズ（ピクセルサイズ）を調整して、好みの粗さにできます。
      </p>

      {/* アップロード領域（クリック/ドラッグ＆ドロップ） */}
      <div
        onDrop={onDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 bg-white text-center hover:border-blue-400 transition-colors"
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        <label htmlFor="file-input" className="cursor-pointer inline-block">
          <div className="text-gray-700">クリックして画像を選択、またはここにドラッグ＆ドロップ</div>
          <div className="text-xs text-gray-400 mt-1">PNG / JPG / GIF / WEBP など</div>
        </label>
      </div>

      {/* コントロール */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">ブロックサイズ（px）</label>
            <input
              type="range"
              min={2}
              max={100}
              value={blockSize}
              onChange={(e) => setBlockSize(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="text-sm text-gray-700 mt-1">現在: {blockSize}px</div>
          </div>
          <div>
            <button
              onClick={onDownload}
              disabled={!imageUrl}
              className="px-4 py-2 rounded-md text-white bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ピクセル画像をダウンロード
            </button>
          </div>
        </div>
      </div>

      {/* プレビュー領域 */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">オリジナル</h2>
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-center items-center">
            {imageUrl && naturalSize ? (
              // 表示用に縮小した最適化イメージ（実際の処理は offscreen/canvas で実行）
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
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">ピクセル化</h2>
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-center items-center overflow-auto">
            {/* 実寸サイズのキャンバスをスケールCSSで表示幅を抑える */}
            <div
              style={{
                transformOrigin: "top left",
                transform: `scale(${displayScale})`,
              }}
            >
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
        </div>
      </div>

      {/* 使い方 */}
      <details className="mt-8 bg-white rounded-lg p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-gray-800">使い方</summary>
        <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
          <li>画像を選択（またはドラッグ＆ドロップ）すると自動でピクセル化されます。</li>
          <li>ブロックサイズ（px）を変更すると、粗さが変わります。</li>
          <li>「ピクセル画像をダウンロード」ボタンでPNGとして保存できます。</li>
          <li>処理は端末内で完結します。画像はサーバーに送信されません。</li>
        </ul>
      </details>
    </div>
  );
}
