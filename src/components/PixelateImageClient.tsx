"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";

// 画像ピクセル化用クライアントコンポーネント
// - ローカル画像を読み込み、ピクセルサイズ（ブロックサイズ）を指定してドット絵風に変換
// - 変換結果をプレビューし、PNGとしてダウンロード可能
// - すべてブラウザ上（オフライン）で完結し、サーバーにはアップロードされません
// Bayer矩阵用于抖动
const bayerMatrix = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function PixelateImageClient() {
  // 選択された画像のプレビューURL（Object URL）
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // ピクセルサイズ（ブロックの大きさ、px）
  const [blockSize, setBlockSize] = useState<number>(12);
  // 像素化模式
  const [pixelMode, setPixelMode] = useState<'average' | 'dominant' | 'quantized' | 'median' | 'dithering'>('average');
  // 颜色量化级别
  const [colorLevels, setColorLevels] = useState<number>(8);
  // シャープネス強度
  const [sharpness, setSharpness] = useState<number>(0);
  // コントラスト調整
  const [contrast, setContrast] = useState<number>(1.0);
  // 彩度調整
  const [saturation, setSaturation] = useState<number>(1.0);
  // アンチエイリアシング
  const [antiAlias, setAntiAlias] = useState<boolean>(false);
  // グリッド表示
  const [showGrid, setShowGrid] = useState<boolean>(false);
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

  // 颜色量化函数
  const quantizeColor = useCallback((value: number, levels: number) => {
    const step = 255 / (levels - 1);
    return Math.round(Math.round(value / step) * step);
  }, []);

  // 获取主导颜色（使用颜色直方图）
  const getDominantColor = useCallback((imageData: Uint8ClampedArray) => {
    const colorCount: { [key: string]: number } = {};
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = Math.floor(imageData[i] / 16) * 16;
      const g = Math.floor(imageData[i + 1] / 16) * 16;
      const b = Math.floor(imageData[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      colorCount[key] = (colorCount[key] || 0) + 1;
    }

    let maxCount = 0;
    let dominantColor = [0, 0, 0];
    
    for (const [color, count] of Object.entries(colorCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color.split(',').map(Number);
      }
    }

    return dominantColor;
  }, []);

  // 获取中位数颜色
  const getMedianColor = useCallback((pixels: number[]) => {
    const rValues: number[] = [];
    const gValues: number[] = [];
    const bValues: number[] = [];
    
    for (let i = 0; i < pixels.length; i += 4) {
      rValues.push(pixels[i]);
      gValues.push(pixels[i + 1]);
      bValues.push(pixels[i + 2]);
    }
    
    rValues.sort((a, b) => a - b);
    gValues.sort((a, b) => a - b);
    bValues.sort((a, b) => a - b);
    
    const mid = Math.floor(rValues.length / 2);
    return [rValues[mid], gValues[mid], bValues[mid]];
  }, []);

  // 应用抖动效果
  const applyDithering = useCallback((r: number, g: number, b: number, x: number, y: number) => {
    const threshold = (bayerMatrix[y % 4][x % 4] / 16 - 0.5) * 32;
    return [
      Math.max(0, Math.min(255, r + threshold)),
      Math.max(0, Math.min(255, g + threshold)),
      Math.max(0, Math.min(255, b + threshold))
    ];
  }, []);

  // 应用色彩调整
  const adjustColor = useCallback((r: number, g: number, b: number) => {
    // コントラスト調整
    r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
    g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
    b = ((b / 255 - 0.5) * contrast + 0.5) * 255;

    // 彩度調整
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);

    return [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b))
    ];
  }, [contrast, saturation]);

  // シャープネスフィルタ適用
  const applySharpen = useCallback((imageData: ImageData, width: number, height: number) => {
    if (sharpness === 0) return imageData;

    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    const amount = sharpness / 10;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          const center = data[idx + c];
          const top = data[((y - 1) * width + x) * 4 + c];
          const bottom = data[((y + 1) * width + x) * 4 + c];
          const left = data[(y * width + (x - 1)) * 4 + c];
          const right = data[(y * width + (x + 1)) * 4 + c];
          
          const sharpened = center * (1 + 4 * amount) - (top + bottom + left + right) * amount;
          output[idx + c] = Math.max(0, Math.min(255, sharpened));
        }
      }
    }

    return new ImageData(output, width, height);
  }, [sharpness]);

  // 改进的像素化处理
  const renderPixelated = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    canvas.width = naturalW;
    canvas.height = naturalH;

    const ctx = canvas.getContext("2d", { 
      alpha: true,
      willReadFrequently: true 
    });
    if (!ctx) return;

    // 创建临时画布来获取原始图像数据
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!tempCtx) return;

    tempCanvas.width = naturalW;
    tempCanvas.height = naturalH;
    
    // 使用高质量缩放
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(img, 0, 0);

    let imageData = tempCtx.getImageData(0, 0, naturalW, naturalH);
    
    // シャープネスフィルタ適用
    if (sharpness > 0) {
      imageData = applySharpen(imageData, naturalW, naturalH);
    }
    
    const data = imageData.data;

    // 清空目标画布
    ctx.clearRect(0, 0, naturalW, naturalH);
    
    // アンチエイリアシング設定
    ctx.imageSmoothingEnabled = antiAlias;
    if (antiAlias) {
      ctx.imageSmoothingQuality = 'high';
    }

    // 按块处理像素
    for (let y = 0; y < naturalH; y += blockSize) {
      for (let x = 0; x < naturalW; x += blockSize) {
        const blockWidth = Math.min(blockSize, naturalW - x);
        const blockHeight = Math.min(blockSize, naturalH - y);

        let r = 0, g = 0, b = 0, a = 0;
        const blockPixels: number[] = [];

        // 收集块内所有像素
        for (let by = 0; by < blockHeight; by++) {
          for (let bx = 0; bx < blockWidth; bx++) {
            const px = x + bx;
            const py = y + by;
            const idx = (py * naturalW + px) * 4;

            blockPixels.push(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
          }
        }

        const pixelCount = blockWidth * blockHeight;
        let finalR: number, finalG: number, finalB: number, finalA: number;

        switch (pixelMode) {
          case 'average':
            // 平均颜色模式
            finalR = r / pixelCount;
            finalG = g / pixelCount;
            finalB = b / pixelCount;
            finalA = a / pixelCount;
            break;

          case 'dominant':
            // 主导颜色模式
            const [dr, dg, db] = getDominantColor(new Uint8ClampedArray(blockPixels));
            finalR = dr;
            finalG = dg;
            finalB = db;
            finalA = a / pixelCount;
            break;

          case 'median':
            // 中位数颜色模式
            const [mr, mg, mb] = getMedianColor(blockPixels);
            finalR = mr;
            finalG = mg;
            finalB = mb;
            finalA = a / pixelCount;
            break;

          case 'quantized':
            // 量化颜色模式
            finalR = quantizeColor(r / pixelCount, colorLevels);
            finalG = quantizeColor(g / pixelCount, colorLevels);
            finalB = quantizeColor(b / pixelCount, colorLevels);
            finalA = a / pixelCount;
            break;

          case 'dithering':
            // 抖动模式
            const avgR = r / pixelCount;
            const avgG = g / pixelCount;
            const avgB = b / pixelCount;
            const [ditherR, ditherG, ditherB] = applyDithering(avgR, avgG, avgB, x / blockSize, y / blockSize);
            finalR = quantizeColor(ditherR, colorLevels);
            finalG = quantizeColor(ditherG, colorLevels);
            finalB = quantizeColor(ditherB, colorLevels);
            finalA = a / pixelCount;
            break;

          default:
            finalR = r / pixelCount;
            finalG = g / pixelCount;
            finalB = b / pixelCount;
            finalA = a / pixelCount;
        }

        // 色彩調整適用
        [finalR, finalG, finalB] = adjustColor(finalR, finalG, finalB);

        // 绘制像素块
        ctx.fillStyle = `rgba(${Math.round(finalR)}, ${Math.round(finalG)}, ${Math.round(finalB)}, ${finalA / 255})`;
        ctx.fillRect(x, y, blockWidth, blockHeight);

        // グリッド表示
        if (showGrid && blockSize >= 4) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, blockWidth, blockHeight);
        }
      }
    }
  }, [blockSize, pixelMode, colorLevels, antiAlias, showGrid, sharpness,
      quantizeColor, getDominantColor, getMedianColor, applyDithering, adjustColor, applySharpen]);

  // 画像の読み込み完了・設定変更のたびに再レンダリング
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

  // プリセット適用
  const applyPreset = useCallback((preset: string) => {
    switch (preset) {
      case 'retro':
        setPixelMode('quantized');
        setColorLevels(4);
        setBlockSize(8);
        setContrast(1.2);
        setSaturation(1.3);
        setSharpness(2);
        break;
      case 'smooth':
        setPixelMode('average');
        setBlockSize(6);
        setContrast(1.0);
        setSaturation(1.0);
        setSharpness(0);
        setAntiAlias(true);
        break;
      case 'sharp':
        setPixelMode('median');
        setBlockSize(10);
        setContrast(1.3);
        setSaturation(1.1);
        setSharpness(5);
        break;
      case 'artistic':
        setPixelMode('dithering');
        setColorLevels(8);
        setBlockSize(12);
        setContrast(1.1);
        setSaturation(1.2);
        setSharpness(3);
        break;
    }
  }, []);

  // 表示用に、横幅を最大 maxPreviewWidth に収めるスケール
  const displayScale = useMemo(() => {
    if (!naturalSize) return 1;
    return Math.min(1, maxPreviewWidth / naturalSize.w);
  }, [naturalSize]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* タイトル */}
      <div className="flex items-center mb-4">
        <div className="mr-4 flex-shrink-0">
          <NextImage src="/images/pixelate.svg" alt="画像ピクセル化" width={48} height={48} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">画像ピクセル化ツール</h1>
      </div>
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

      {/* プリセット */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">プリセット</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('retro')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            🕹️ レトロ
          </button>
          <button
            onClick={() => applyPreset('smooth')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            ✨ スムーズ
          </button>
          <button
            onClick={() => applyPreset('sharp')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            🔪 シャープ
          </button>
          <button
            onClick={() => applyPreset('artistic')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            🎨 アート風
          </button>
        </div>
      </div>

      {/* コントロール */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="space-y-6">
          {/* 基本設定 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">基本設定</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">ブロックサイズ（px）</label>
                <input
                  type="range"
                  min={2}
                  max={50}
                  value={blockSize}
                  onChange={(e) => setBlockSize(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="text-sm text-gray-700 mt-1">現在: {blockSize}px</div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">ピクセル化モード</label>
                <select
                  value={pixelMode}
                  onChange={(e) => setPixelMode(e.target.value as 'average' | 'dominant' | 'quantized' | 'median' | 'dithering')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="average">平均色（スタンダード）</option>
                  <option value="median">中央値（バランス型）</option>
                  <option value="dominant">主要色（コントラスト強）</option>
                  <option value="quantized">色数制限（レトロ風）</option>
                  <option value="dithering">ディザリング（ドット表現）</option>
                </select>
              </div>
            </div>
          </div>

          {/* 色設定 */}
          {(pixelMode === 'quantized' || pixelMode === 'dithering') && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">色設定</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">色段階数</label>
                <input
                  type="range"
                  min={2}
                  max={16}
                  value={colorLevels}
                  onChange={(e) => setColorLevels(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="text-sm text-gray-700 mt-1">段階: {colorLevels}</div>
              </div>
            </div>
          )}

          {/* 画質調整 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">画質調整</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">シャープネス</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={sharpness}
                  onChange={(e) => setSharpness(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="text-sm text-gray-700 mt-1">{sharpness}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">コントラスト</label>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-700 mt-1">{contrast.toFixed(1)}x</div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">彩度</label>
                <input
                  type="range"
                  min={0}
                  max={2.0}
                  step={0.1}
                  value={saturation}
                  onChange={(e) => setSaturation(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-700 mt-1">{saturation.toFixed(1)}x</div>
              </div>
            </div>
          </div>

          {/* 表示オプション */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">表示オプション</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antiAlias}
                  onChange={(e) => setAntiAlias(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">アンチエイリアシング</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">グリッド表示</span>
              </label>
            </div>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onDownload}
              disabled={!imageUrl}
              className="px-6 py-2 rounded-md text-white bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              ピクセル画像をダウンロード
            </button>
          </div>
        </div>
      </div>

      {/* プレビュー領域 */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">オリジナル画像</h3>
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
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">ピクセル化結果</h3>
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-center items-center overflow-auto">
            <div
              style={{
                transformOrigin: "top left",
                transform: `scale(${displayScale})`,
                imageRendering: antiAlias ? 'auto' : 'pixelated',
              }}
            >
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
        </div>
      </div>

      {/* 使い方 */}
      <section className="mt-8 bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">使い方・操作方法</h3>
        <ul className="list-disc pl-6 text-sm text-gray-700 mt-2 space-y-1">
          <li>画像を選択（またはドラッグ＆ドロップ）すると自動でピクセル化されます。</li>
          <li>プリセットボタンで素早く設定を適用できます。</li>
          <li>ブロックサイズ（px）を変更すると、粗さが変わります。</li>
          <li>ピクセル化モードで異なる効果を選択できます：
            <ul className="list-disc pl-6 mt-1">
              <li><strong>平均色</strong>：ブロック内の色を平均化（滑らかな効果）</li>
              <li><strong>中央値</strong>：ノイズに強く、バランスの取れた効果</li>
              <li><strong>主要色</strong>：ブロック内で最も多い色を使用（コントラスト強調）</li>
              <li><strong>色数制限</strong>：色数を制限してレトロな効果</li>
              <li><strong>ディザリング</strong>：クラシックなドット表現</li>
            </ul>
          </li>
          <li>シャープネスで輪郭を強調できます。</li>
          <li>コントラストと彩度で色味を調整できます。</li>
          <li>アンチエイリアシングで滑らかな表示にできます。</li>
          <li>グリッド表示でピクセルの境界を確認できます。</li>
          <li>「ピクセル画像をダウンロード」ボタンでPNGとして保存できます。</li>
          <li>処理は端末内で完結します。画像はサーバーに送信されません。</li>
        </ul>
      </section>
    </div>
  );
}