"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ROWS = 20; // Number of characters per column (vertical)
const COLS = 20; // Number of columns per page
const CHARS_PER_PAGE = ROWS * COLS;

type PageData = string[][]; // Array of columns, each column is array of chars

export default function GenkoyoshiClient() {
  const [text, setText] = useState("");
  const [lineColor, setLineColor] = useState("#22c55e"); // Default green
  const [pages, setPages] = useState<PageData[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const savedText = localStorage.getItem("genkoyoshi_text");
    const savedColor = localStorage.getItem("genkoyoshi_color");
    if (savedText) setText(savedText);
    if (savedColor) setLineColor(savedColor);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("genkoyoshi_text", text);
    localStorage.setItem("genkoyoshi_color", lineColor);
  }, [text, lineColor]);

  // Parse text into pages/columns/rows
  useEffect(() => {
    const newPages: PageData[] = [];
    let currentPage: string[][] = [];
    let currentCol: string[] = [];

    const chars = Array.from(text);
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (char === "\n") {
        // Fill rest of column with empty strings
        while (currentCol.length < ROWS) {
          currentCol.push("");
        }
        currentPage.push(currentCol);
        currentCol = [];
      } else {
        currentCol.push(char);
      }

      // If column is full
      if (currentCol.length === ROWS) {
        currentPage.push(currentCol);
        currentCol = [];
      }

      // If page is full
      if (currentPage.length === COLS) {
        newPages.push(currentPage);
        currentPage = [];
      }
    }

    // Push remaining column if not empty
    if (currentCol.length > 0) {
      // Fill rest of column
      while (currentCol.length < ROWS) {
        currentCol.push("");
      }
      currentPage.push(currentCol);
    }

    // Push remaining page if not empty
    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    // Ensure at least one empty page if text is empty
    if (newPages.length === 0) {
      newPages.push([]);
    }

    setPages(newPages);
  }, [text]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape", // Genkoyoshi is usually landscape A4 or B4
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // If height exceeds A4, we might need multiple pages in PDF, 
    // but html2canvas captures the whole scrollable area as one image.
    // For a proper multi-page PDF, we should render each page div separately.
    // Let's try to capture each .genkoyoshi-page class element.
    
    const pageElements = document.querySelectorAll(".genkoyoshi-page");
    const pdfMulti = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdfMulti.addPage();
      
      const pageEl = pageElements[i] as HTMLElement;
      const pageCanvas = await html2canvas(pageEl, { scale: 2, backgroundColor: "#ffffff" });
      const pageImgData = pageCanvas.toDataURL("image/png");
      
      // Center image on PDF page
      const pageWidth = pdfMulti.internal.pageSize.getWidth();
      const pageHeight = pdfMulti.internal.pageSize.getHeight();
      
      // Assuming the HTML page is A4 ratio roughly
      pdfMulti.addImage(pageImgData, "PNG", 0, 0, pageWidth, pageHeight);
    }

    pdfMulti.save("genkoyoshi.pdf");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Controls & Input */}
      <div className="w-full lg:w-1/3 space-y-6 print:hidden">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">設定 & 入力</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              罫線の色
            </label>
            <div className="flex gap-2">
              {["#22c55e", "#ef4444", "#3b82f6", "#f97316", "#6b7280"].map((color) => (
                <button
                  key={color}
                  onClick={() => setLineColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    lineColor === color ? "border-black dark:border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              印刷
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF保存
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              テキスト入力
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ここにテキストを入力してください..."
              className="w-full h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            <p className="text-right text-sm text-gray-500 mt-1">
              {text.length} 文字
            </p>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full lg:w-2/3 overflow-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div ref={printRef} className="space-y-8 min-w-[800px] flex flex-col items-center">
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="genkoyoshi-page bg-white shadow-lg relative mx-auto print:shadow-none print:m-0 print:break-after-page"
              style={{
                width: "297mm", // A4 Landscape
                height: "210mm",
                padding: "20mm",
                boxSizing: "border-box",
                color: lineColor,
              }}
            >
              {/* Grid Container */}
              <div 
                className="w-full h-full border-2 flex flex-row-reverse justify-between"
                style={{ borderColor: lineColor }}
              >
                {/* Columns */}
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const colData = page[colIndex] || [];
                  return (
                    <div 
                      key={colIndex} 
                      className="flex flex-col h-full border-l first:border-l-0"
                      style={{ 
                        borderColor: lineColor,
                        width: `calc(100% / ${COLS})`
                      }}
                    >
                      {/* Rows (Cells) */}
                      {Array.from({ length: ROWS }).map((_, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex-1 border-b last:border-b-0 flex items-center justify-center relative"
                          style={{ borderColor: lineColor }}
                        >
                          {/* Character */}
                          <span 
                            className="text-black absolute inset-0 flex items-center justify-center text-lg font-serif leading-none"
                            style={{ 
                                writingMode: "vertical-rl",
                                textOrientation: "upright"
                            }}
                          >
                            {colData[rowIndex] || ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              
              {/* Page Number */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                - {pageIndex + 1} -
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          .print\\:break-after-page {
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}
