import type { Metadata } from "next";
import Image from "next/image";
import KuuhakumojiClient from "@/components/KuuhakumojiClient";

export const metadata: Metadata = {
  title: "空白文字コピーツール | インスタ・ツイッター・ゲーム名に使える",
  description: "Instagram、Twitter(X)、LINE、ゲームのユーザー名などで使える空白文字（不可視文字）を簡単にコピー・生成できるツールです。空白の長さを指定して生成したり、テキスト内の空白文字を検出することも可能です。",
  keywords: ["空白文字", "不可視文字", "コピペ", "インスタ", "Twitter", "空白", "透明文字", "Unicode"],
};

type CharInfo = {
  name: string;
  enName: string;
  char: string;
  html: string;
  unicode: string;
  desc: string;
};

const ALL_CHARS: CharInfo[] = [
  { name: "スペース", enName: "Space", char: " ", html: "&nbsp;", unicode: "U+0020", desc: "最も一般的な空白文字です。通常のスペースとして使用されます。" },
  { name: "改行なしスペース", enName: "No-Break Space", char: "\u00A0", html: "&nbsp;", unicode: "U+00A0", desc: "通常のスペースと似ていますが、この位置での改行を防ぎます。" },
  { name: "エンクワッド", enName: "En Quad", char: "\u2000", html: "&#8192;", unicode: "U+2000", desc: "エン（emの半分）の幅を持つスペースです。" },
  { name: "エムクワッド", enName: "Em Quad", char: "\u2001", html: "&#8193;", unicode: "U+2001", desc: "emと同じ幅を持つスペースです。" },
  { name: "エンスペース", enName: "En Space", char: "\u2002", html: "&#8194;", unicode: "U+2002", desc: "エン（emの半分）の幅を持つスペースです。" },
  { name: "エムスペース", enName: "Em Space", char: "\u2003", html: "&#8195;", unicode: "U+2003", desc: "emと同じ幅を持つスペースです。" },
  { name: "3分の1エムスペース", enName: "Three-Per-Em Space", char: "\u2004", html: "&#8196;", unicode: "U+2004", desc: "emの3分の1の幅を持つスペースです。" },
  { name: "4分の1エムスペース", enName: "Four-Per-Em Space", char: "\u2005", html: "&#8197;", unicode: "U+2005", desc: "emの4分の1の幅を持つスペースです。" },
  { name: "6分の1エムスペース", enName: "Six-Per-Em Space", char: "\u2006", html: "&#8198;", unicode: "U+2006", desc: "emの6分の1の幅を持つスペースです。" },
  { name: "数字スペース", enName: "Figure Space", char: "\u2007", html: "&#8199;", unicode: "U+2007", desc: "等幅フォントでの数字の幅と同じ幅を持つスペースです。" },
  { name: "句読点スペース", enName: "Punctuation Space", char: "\u2008", html: "&#8200;", unicode: "U+2008", desc: "ピリオド（句点）と同じ幅を持つスペースです。" },
  { name: "細いスペース", enName: "Thin Space", char: "\u2009", html: "&#8201;", unicode: "U+2009", desc: "emの5分の1（または6分の1）の幅を持つ細いスペースです。" },
  { name: "極細スペース", enName: "Hair Space", char: "\u200A", html: "&#8202;", unicode: "U+200A", desc: "細いスペースよりもさらに細いスペースです。" },
  { name: "ゼロ幅スペース", enName: "Zero Width Space", char: "\u200B", html: "&#8203;", unicode: "U+200B", desc: "幅を持たない不可視文字で、テキスト内での改行位置を指定するために使用されます。" },
  { name: "ゼロ幅非結合子", enName: "Zero Width Non-Joiner", char: "\u200C", html: "&#8204;", unicode: "U+200C", desc: "通常結合する文字の結合を防ぐための不可視文字です。" },
  { name: "ゼロ幅結合子", enName: "Zero Width Joiner", char: "\u200D", html: "&#8205;", unicode: "U+200D", desc: "通常結合しない文字を結合させるための不可視文字です。" },
  { name: "左から右マーク", enName: "Left-to-Right Mark", char: "\u200E", html: "&#8206;", unicode: "U+200E", desc: "隣接する文字を左から右に表示させる不可視の書式制御文字です。" },
  { name: "右から左マーク", enName: "Right-to-Left Mark", char: "\u200F", html: "&#8207;", unicode: "U+200F", desc: "隣接する文字を右から左に表示させる不可視の書式制御文字です。" },
  { name: "行区切り", enName: "Line Separator", char: "\u2028", html: "&#8232;", unicode: "U+2028", desc: "テキストの行を区切るために使用される文字です。改行とは異なる意味を持ちます。" },
  { name: "狭い改行なしスペース", enName: "Narrow No-Break Space", char: "\u202F", html: "&#8239;", unicode: "U+202F", desc: "細いスペースと同じ幅を持つ改行なしスペースです。" },
  { name: "中間数学スペース", enName: "Medium Mathematical Space", char: "\u205F", html: "&#8287;", unicode: "U+205F", desc: "数式で使用される、emの18分の4の幅を持つスペースです。" },
  { name: "単語結合子", enName: "Word Joiner", char: "\u2060", html: "&#8288;", unicode: "U+2060", desc: "ゼロ幅改行なしスペースと似ていますが、異なる意味を持ちます。" },
  { name: "関数適用", enName: "Function Application", char: "\u2061", html: "&#8289;", unicode: "U+2061", desc: "数式表記で関数の適用を示す不可視演算子です。" },
  { name: "不可視乗算", enName: "Invisible Times", char: "\u2062", html: "&#8290;", unicode: "U+2062", desc: "数式表記で使用される不可視の乗算演算子です。" },
  { name: "不可視区切り", enName: "Invisible Separator", char: "\u2063", html: "&#8291;", unicode: "U+2063", desc: "数式表記で使用される不可視の区切り文字です。" },
  { name: "不可視加算", enName: "Invisible Plus", char: "\u2064", html: "&#8292;", unicode: "U+2064", desc: "数式表記で使用される不可視の加算演算子です。" },
  { name: "ソフトハイフン", enName: "Soft Hyphen", char: "\u00AD", html: "&shy;", unicode: "U+00AD", desc: "行末で単語を分割する必要がある場合にのみ表示されるハイフンです。" },
  { name: "全角スペース", enName: "Ideographic Space", char: "\u3000", html: "&#12288;", unicode: "U+3000", desc: "CJK（中国語・日本語・韓国語）文字と同じ幅を持つスペースです。" },
  { name: "点字空白パターン", enName: "Braille Pattern Blank", char: "\u2800", html: "&#10240;", unicode: "U+2800", desc: "点字の空白パターンを表す文字で、多くの場合不可視文字として使用されます。" },
  { name: "ハングル補充文字", enName: "Hangul Filler", char: "\u3164", html: "&#12644;", unicode: "U+3164", desc: "韓国語のハングル文字ブロックで使用される不可視文字です。" },
  { name: "ハングル初声補充文字", enName: "Hangul Choseong Filler", char: "\u115F", html: "&#4447;", unicode: "U+115F", desc: "ハングルの初声（子音）位置のプレースホルダーとして使用される不可視文字です。" },
  { name: "ハングル中声補充文字", enName: "Hangul Jungseong Filler", char: "\u1160", html: "&#4448;", unicode: "U+1160", desc: "ハングルの中声（母音）位置のプレースホルダーとして使用される不可視文字です。" },
  { name: "結合書記素結合子", enName: "Combining Grapheme Joiner", char: "\u034F", html: "&#847;", unicode: "U+034F", desc: "周囲の文字の結合動作に影響を与える不可視文字です。" },
  { name: "アラビア文字マーク", enName: "Arabic Letter Mark", char: "\u061C", html: "&#1564;", unicode: "U+061C", desc: "後続の文字をアラビア文字として扱うことを示す不可視文字です。" },
  { name: "モンゴル語母音区切り", enName: "Mongolian Vowel Separator", char: "\u180E", html: "&#6158;", unicode: "U+180E", desc: "モンゴル語のテキストで母音を区切るために使用される不可視文字です。" },
  { name: "ゼロ幅改行なしスペース", enName: "Zero Width No-Break Space", char: "\uFEFF", html: "&#65279;", unicode: "U+FEFF", desc: "改行を防ぎ、幅を持たない不可視文字です。バイトオーダーマーク（BOM）としても知られています。" },
  { name: "オブジェクト置換文字", enName: "Object Replacement Character", char: "\uFFFC", html: "&#65532;", unicode: "U+FFFC", desc: "テキストとして表現できないオブジェクトのプレースホルダーとして使用されます。" },
  { name: "異体字セレクタ-1", enName: "Variation Selector-1", char: "\uFE00", html: "&#65024;", unicode: "U+FE00", desc: "前の文字の特定の字形バリアントを選択するための不可視文字です。" },
  { name: "異体字セレクタ-15", enName: "Variation Selector-15", char: "\uFE0E", html: "&#65038;", unicode: "U+FE0E", desc: "絵文字の文字表示を選択するための不可視文字です。" },
  { name: "異体字セレクタ-16", enName: "Variation Selector-16", char: "\uFE0F", html: "&#65039;", unicode: "U+FE0F", desc: "文字の絵文字表示を選択するための不可視文字です。" },
  { name: "タグスペース", enName: "Tag Space", char: "\uE0020", html: "&#917536;", unicode: "U+E0020", desc: "言語タグで使用される不可視文字です。" },
];

export default function KuuhakumojiPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-4">
        <Image src="/images/kuuhakumoji.svg" alt="" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12" />
        空白文字コピーツール
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        SNSやユーザー名、プログラミングに使える空白（不可視文字）を無料でコピーできるツールです。
        ネットチャットで見えないメッセージを送信することも可能です。
      </p>

      <KuuhakumojiClient />

      <div className="mt-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
            空白文字の一覧
          </h2>
          <p className="mb-6 text-gray-600">
            すべての空白と空白文字を一覧で表示します。上記の方法でコピーした空白文字が使用できない場合は、以下の空白文字タイプを試してください。
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {ALL_CHARS.map((char, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{char.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{char.enName}</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-mono text-gray-600">
                    {char.unicode}
                  </div>
                </div>
                <div className="flex items-center gap-4 my-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-300 rounded text-2xl select-all">
                    {/* Use a span with a border to show where the char is, but the char itself is invisible */}
                    <span className="bg-blue-100/50 min-w-[1em] min-h-[1em] flex items-center justify-center">
                        {char.char}
                    </span>
                  </div>
                  <div className="flex-1 text-sm text-gray-600">
                    {char.desc}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-mono mb-2">
                  HTML: {char.html}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
            よくある質問
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">空白文字と不可視文字とは？</h3>
              <p className="text-gray-600">
                空白文字と不可視文字は、表示されない特殊なUnicode文字です。これらは特定のフォーマットや機能のために使用されます。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">このツールの使い方は？</h3>
              <p className="text-gray-600">
                「コピー」ボタンをクリックするだけで簡単に空白文字をコピーできます。複数の文字が必要な場合は、生成ツールを使用して必要な数の文字を作成できます。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">どの空白文字を使うべき？</h3>
              <p className="text-gray-600">
                用途によって最適な文字が異なります。一般的な用途には「点字空白パターン」がおすすめです。改行を防ぎたい場合は「改行なしスペース」、幅を取らない場合は「ゼロ幅スペース」が適しています。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">プログラミングで使用できますか？</h3>
              <p className="text-gray-600">
                はい、使用できます。ただし、デバッグが難しくなる可能性があるため、コード内での使用は慎重に行い、適切にドキュメント化することをお勧めします。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">すべてのプラットフォームで動作しますか？</h3>
              <p className="text-gray-600">
                ほとんどのプラットフォームで動作しますが、一部のシステムでは特定の不可視文字が異なって表示される場合があります。使用前に目的のプラットフォームでテストすることをお勧めします。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
