"use client";
import React, { useState } from "react";

const calcTabs = [
  {
    title: "パーセント計算",
    desc: "AはBの何パーセント、AのB%は？など、基本的なパーセント計算。",
    items: [
      {
        label: "AはBの何パーセント？",
        formula: "A ÷ B × 100%",
        inputs: ["A", "B"],
        calc: (a: number, b: number) => b !== 0 ? (a / b) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "AのB%は？",
        formula: "A × B ÷ 100",
        inputs: ["A", "B%"],
        calc: (a: number, b: number) => (a * b) / 100,
        suffix: ""
      },
      {
        label: "AはBのうち何%増減？",
        formula: "(A - B) ÷ B × 100%",
        inputs: ["A（新しい値）", "B（元の値）"],
        calc: (a: number, b: number) => b !== 0 ? ((a - b) / b) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "AのB%増減後の値は？",
        formula: "A × (1 ± B ÷ 100)",
        inputs: ["A", "B%"],
        calc: (a: number, b: number) => a * (1 + b / 100),
        suffix: ""
      }
    ]
  },
  {
    title: "比率・比の計算",
    desc: "A:Bの比率、AのうちBの割合、比率から値を逆算など。",
    items: [
      {
        label: "A:Bの比率（%）",
        formula: "A ÷ (A + B) × 100%",
        inputs: ["A", "B"],
        calc: (a: number, b: number) => (a + b) !== 0 ? (a / (a + b)) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "AのうちBの割合（%）",
        formula: "B ÷ A × 100%",
        inputs: ["A", "B"],
        calc: (a: number, b: number) => a !== 0 ? (b / a) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "比率からA・Bを逆算",
        formula: "A = 合計 × (比率A ÷ 100)",
        inputs: ["合計", "比率A%"],
        calc: (a: number, b: number) => (a * b) / 100,
        suffix: " (Aの値)"
      }
    ]
  },
  {
    title: "割引・値引き計算",
    desc: "割引後の価格、割引率、割引額などを計算。",
    items: [
      {
        label: "A円のB%割引後の価格",
        formula: "A × (1 - B ÷ 100)",
        inputs: ["A（元の価格）", "B%（割引率）"],
        calc: (a: number, b: number) => a * (1 - b / 100),
        suffix: "円"
      },
      {
        label: "A円からB円割引した割引率",
        formula: "B ÷ A × 100%",
        inputs: ["A（元の価格）", "B（割引額）"],
        calc: (a: number, b: number) => a !== 0 ? (b / a) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "A円のB%割引額",
        formula: "A × B ÷ 100",
        inputs: ["A（元の価格）", "B%（割引率）"],
        calc: (a: number, b: number) => (a * b) / 100,
        suffix: "円"
      }
    ]
  },
  {
    title: "増減・差分計算",
    desc: "増減率、差分、増減後の値などを計算。",
    items: [
      {
        label: "AからBへの増減率（%）",
        formula: "(B - A) ÷ A × 100%",
        inputs: ["A（元の値）", "B（新しい値）"],
        calc: (a: number, b: number) => a !== 0 ? ((b - a) / a) * 100 : NaN,
        suffix: "%"
      },
      {
        label: "AからBへの差分",
        formula: "B - A",
        inputs: ["A（元の値）", "B（新しい値）"],
        calc: (a: number, b: number) => b - a,
        suffix: ""
      },
      {
        label: "AのB%増減後の値",
        formula: "A × (1 ± B ÷ 100)",
        inputs: ["A", "B%"],
        calc: (a: number, b: number) => a * (1 + b / 100),
        suffix: ""
      }
    ]
  }
];

export default function PercentCalcClient() {
  const [tab, setTab] = useState(0);
  // 每个 tab 下的所有 item 输入和结果都独立保存
  const [vals, setVals] = useState(calcTabs.map(tab => tab.items.map(() => ["", ""])));
  const [results, setResults] = useState(calcTabs.map(tab => tab.items.map(() => "")));

  const handleInput = (tabIdx: number, itemIdx: number, inputIdx: number, v: string) => {
    setVals(prev => {
      const next = prev.map(arr => arr.map(inputs => [...inputs]));
      next[tabIdx][itemIdx][inputIdx] = v;
      return next;
    });
  };

  const handleCalc = (tabIdx: number, itemIdx: number) => {
    const a = parseFloat(vals[tabIdx][itemIdx][0]);
    const b = parseFloat(vals[tabIdx][itemIdx][1]);
    let res = "";
    if (isNaN(a) || isNaN(b)) {
      res = "数字を入力してください";
    } else {
      const r = calcTabs[tabIdx].items[itemIdx].calc(a, b);
      res = isNaN(r) ? "計算できません" : r.toLocaleString(undefined, { maximumFractionDigits: 6 }) + calcTabs[tabIdx].items[itemIdx].suffix;
    }
    setResults(prev => {
      const next = prev.map(arr => [...arr]);
      next[tabIdx][itemIdx] = res;
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 900, minHeight: 700, margin: "32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #e0e0e0", padding: 32 }}>
      <h1 style={{ fontSize: 32, margin: "0 0 16px", textAlign: "center", letterSpacing: 1 }}>パーセント・比率・割引・増減計算ツール</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, justifyContent: "center", flexWrap: "wrap" }}>
        {calcTabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding: "8px 18px", fontSize: 16, background: i === tab ? "#0070f3" : "#f3f3f3", color: i === tab ? "#fff" : "#333", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: i === tab ? 700 : 400, boxShadow: i === tab ? "0 2px 8px #e0eaff" : "none" }}>{t.title}</button>
        ))}
      </div>
      <div style={{ background: "#f8faff", borderRadius: 8, padding: 18, marginBottom: 18, minHeight: 80 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{calcTabs[tab].title}</div>
        <div style={{ fontSize: 14, color: "#666" }}>{calcTabs[tab].desc}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {calcTabs[tab].items.map((it, idx) => (
          <div key={idx} style={{ background: "#f9f9fb", borderRadius: 8, padding: 18, boxShadow: "0 1px 4px #f0f0f0" }}>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{it.label}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>公式：{it.formula}</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              {it.inputs.map((label, i2) => (
                <input key={i2} type="number" value={vals[tab][idx][i2]} onChange={e => handleInput(tab, idx, i2, e.target.value)} placeholder={label} style={{ flex: 1, fontSize: 16, padding: 8, border: "1px solid #ddd", borderRadius: 5, background: "#fafcff" }} />
              ))}
            </div>
            <button onClick={() => handleCalc(tab, idx)} style={{ width: "100%", padding: 10, fontSize: 16, background: "#0070f3", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", marginBottom: 8, fontWeight: 600 }}>計算する</button>
            <div style={{ minHeight: 28, fontSize: 19, color: results[tab][idx] ? "#0070f3" : "#bbb", textAlign: "center", marginBottom: 4, fontWeight: 700 }}>{results[tab][idx]}</div>
          </div>
        ))}
      </div>
  <details open style={{ fontSize: 14, color: "#444", background: "#f8f8f8", borderRadius: 6, padding: 12, margin: "28px 0 10px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>使い方・例</summary>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>上部タブでカテゴリを切り替え、各計算項目がすべて展開表示されます。</li>
          <li>数値を入力し「計算する」を押すと結果が表示されます。</li>
          <li>【例2】AはBの何パーセント？→A=30, B=200 → 15%</li>
          <li>【例3】A円のB%割引後→A=1000, B=15 → 850円</li> 
          <li>パーセントは100分の1を表す単位です。</li>
          <li>割引計算や比率計算、増減率など幅広く対応。</li>
          <li>小数・マイナス値も入力可能です。</li>
          <li>【例3】定価8,000円の商品が20%オフの場合：8,000 × (1 - 0.2) = 6,400円。割引額は1,600円。</li>
          <li>【例4】テスト100点満点で72点の場合：72 ÷ 100 × 100% = 72%。得点率は72%です。</li>
          <li>【例5】昨年の売上が50万円、今年が60万円の場合：((60-50) ÷ 50) × 100% = 20%。前年比20%増。</li>
          <li>【30パーセントオフ計算例】定価10,000円の商品が30%オフの場合：10,000 × (1 - 0.3) = 7,000円。割引額は3,000円。</li>
          <li>【20パーセントオフ計算例】定価5,000円の商品が20%オフの場合：5,000 × (1 - 0.2) = 4,000円。割引額は1,000円。</li>
        </ul>
      </details>
      <details style={{ fontSize: 14, color: "#444", background: "#f8f8f8", borderRadius: 6, padding: 12, margin: "18px 0 10px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>30パーセントオフ早見表</summary>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 340 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>価格</th>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>割引額 (30%)</th>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>割引後</th>
              </tr>
            </thead>
            <tbody>
              {[
                [100,30,70],[200,60,140],[300,90,210],[400,120,280],[500,150,350],[600,180,420],[700,210,490],[800,240,560],[900,270,630]
              ].map(([p, d, a]) => (
                <tr key={p}>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{p}円</td>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{d}円</td>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{a}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <details style={{ fontSize: 14, color: "#444", background: "#f8f8f8", borderRadius: 6, padding: 12, margin: "10px 0 10px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>20パーセントオフ早見表</summary>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 340 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>価格</th>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>割引額 (20%)</th>
                <th style={{ border: '1px solid #ddd', padding: '4px 8px' }}>割引後</th>
              </tr>
            </thead>
            <tbody>
              {[
                [100,20,80],[200,40,160],[300,60,240],[400,80,320],[500,100,400],[600,120,480],[700,140,560],[800,160,640],[900,180,720]
              ].map(([p, d, a]) => (
                <tr key={p}>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{p}円</td>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{d}円</td>
                  <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>{a}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      
     </div>
  );
}
