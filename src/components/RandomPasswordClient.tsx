"use client";

import { useState } from "react";

type Options = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

export default function RandomPasswordClient() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [generationCount, setGenerationCount] = useState(1);
  const [minLength, setMinLength] = useState(16);
  const [maxLength, setMaxLength] = useState(16);
  const [useRange, setUseRange] = useState(false);
  const [includeChars, setIncludeChars] = useState("");
  const [excludeChars, setExcludeChars] = useState("0oO1iIlLq");
  const [options, setOptions] = useState<Options>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPasswords = (passwords: string[]) => {
    const content = passwords.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePasswords = async () => {
    setIsGenerating(true);
    
    // 构建字符集
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let charset = "";
    if (options.uppercase) charset += charSets.uppercase;
    if (options.lowercase) charset += charSets.lowercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.symbols) charset += charSets.symbols;
    
    // 添加包含字符
    charset += includeChars;

    // 排除字符
    if (excludeChars) {
      const excludeSet = new Set(excludeChars.split(''));
      charset = charset.split('').filter(char => !excludeSet.has(char)).join('');
    }

    if (!charset) {
      setPasswords([]);
      setIsGenerating(false);
      return;
    }

    const newPasswords: string[] = [];
    const usedPasswords = new Set<string>();

    for (let i = 0; i < generationCount; i++) {
      // 如果是大量生成，每1000个密码让UI更新一次
      if (i % 1000 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      let attempts = 0;
      let newPassword = "";
      
      do {
        const length = useRange 
          ? Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
          : minLength;
        
        newPassword = "";
        for (let j = 0; j < length; j++) {
          newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        attempts++;
      } while (usedPasswords.has(newPassword) && attempts < 100);
      
      if (!usedPasswords.has(newPassword)) {
        usedPasswords.add(newPassword);
        newPasswords.push(newPassword);
      }
    }

    setPasswords(newPasswords);
    
    // 如果结果超过100000字符，自动下载
    const totalLength = newPasswords.join('\n').length;
    if (totalLength > 100000) {
      downloadPasswords(newPasswords);
    }
    
    setIsGenerating(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const allPasswords = passwords.join('\n');
    navigator.clipboard.writeText(allPasswords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        ランダムパスワード生成
      </h1> 
      {/* 配置选项 */}
      <div className="space-y-6">
        {/* 生成数量 */}
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
            生成数
          </label>
          <input
            type="number"
            id="count"
            min="1"
            max="1000000"
            value={generationCount}
            onChange={(e) => setGenerationCount(Math.max(1, Math.min(1000000, Number(e.target.value))))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 密码长度 */}
        <div>
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              パスワードの長さ:
            </label>
            <div className="ml-4 flex items-center">
              <input
                type="checkbox"
                id="useRange"
                checked={useRange}
                onChange={(e) => setUseRange(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="useRange" className="ml-2 text-sm text-gray-700">長さ範囲を使用</label>
            </div>
          </div>
          
          {useRange ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minLength" className="block text-xs text-gray-500 mb-1">
                  最小長
                </label>
                <input
                  type="number"
                  id="minLength"
                  min="1"
                  max="1000000"
                  value={minLength}
                  onChange={(e) => setMinLength(Math.max(1, Math.min(1000000, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="maxLength" className="block text-xs text-gray-500 mb-1">
                  最大長
                </label>
                <input
                  type="number"
                  id="maxLength"
                  min="1"
                  max="1000000"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Math.max(minLength, Math.min(1000000, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <input
              type="number"
              min="1"
              max="1000000"
              value={minLength}
              onChange={(e) => setMinLength(Math.max(1, Math.min(1000000, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </div>

        {/* 字符类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">文字種</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(options) as Array<keyof Options>).map((key) => {
              const labels = {
                uppercase: "大文字を含める (A-Z)",
                lowercase: "小文字を含める (a-z)",
                numbers: "数字を含める (0-9)",
                symbols: "記号を含める (!@#$%^&*)"
              };
              return (
              <div key={key} className="flex items-center">
                <input
                  id={key}
                  name={key}
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                  {labels[key]}
                </label>
              </div>
              );
            })}
          </div>
        </div>

        {/* 包含字符 */}
        <div>
          <label htmlFor="includeChars" className="block text-sm font-medium text-gray-700 mb-2">
            含める文字
          </label>
          <input
            type="text"
            id="includeChars"
            value={includeChars}
            onChange={(e) => setIncludeChars(e.target.value)}
            placeholder="例：@#$%"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 排除字符 */}
        <div>
          <label htmlFor="excludeChars" className="block text-sm font-medium text-gray-700 mb-2">
            除外する文字
          </label>
          <input
            type="text"
            id="excludeChars"
            value={excludeChars}
            onChange={(e) => setExcludeChars(e.target.value)}
            placeholder="例：0oO1iIlLq"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generatePasswords}
        disabled={isGenerating}
        className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? "生成中..." : "パスワードを生成"}
      </button>

      {/* 生成结果 */}
      {passwords.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              生成結果 ({passwords.length}個)
            </h3>
            <div className="space-x-2">
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {copied ? "コピーしました！" : "すべてコピー"}
              </button>
              <button
                onClick={() => downloadPasswords(passwords)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                パスワードをダウンロード
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
            {passwords.slice(0, 50).map((password, index) => (
              <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
                <code className="text-sm font-mono text-gray-800 flex-1">{password}</code>
                <button
                  onClick={() => handleCopy(password)}
                  className="ml-2 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  コピー
                </button>
              </div>
            ))}
            {passwords.length > 50 && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                最初の50個のパスワードを表示中。合計{passwords.length}個。完全なリストを取得するには、ダウンロード機能をご利用ください。
              </div>
            )}
          </div>
        </div>
      )}
            
      {/* SEO描述部分 */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg mt-10">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">機能説明</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>使用文字：</strong>ランダムパスワード生成に使用する文字の範囲です。</p>
          <p><strong>生成数：</strong>生成するパスワードの個数。範囲は1〜1,000,000個です。大量に生成する場合は時間がかかる場合があります。ブラウザで待機メッセージが表示された場合は、そのまま待機してください。</p>
          <p><strong>パスワード長：</strong>個別パスワードの文字列長。単一の値または範囲値を入力できます。パスワード長の範囲は1〜1,000,000文字です。</p>
          <p><strong>含める文字：</strong>入力した文字と選択した文字種を組み合わせてランダムパスワードを生成します。含める文字は候補文字セットに追加されるだけで、生成されるパスワードに必ず含まれるわけではありません。同じ文字を重複して入力すると、その文字の重みが高くなります。</p>
          <p><strong>除外する文字：</strong>使用文字から特定の文字を除外します。生成されるパスワードには除外文字は絶対に含まれません。</p>
          <p><strong>生成結果：</strong>生成されたランダムパスワード文字列の結果です。1行に1つずつ表示され、重複はありません。パスワード文字列の長さが100,000文字を超える場合は、自動的にローカルにダウンロードされます。</p>
          <p><strong>ダウンロード：</strong>ランダムパスワードの結果をローカルにダウンロードします。ダウンロードファイルの文字エンコーディングはUTF-8です。</p>
        </div>
      </div>
    </div>
  );
}