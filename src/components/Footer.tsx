import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#f8f8f8", padding: "24px 0 12px", marginTop: 40, borderTop: "1px solid #eee" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", fontSize: 15, color: "#888" }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/percent-calc" style={{ color: "#0070f3", textDecoration: "underline", marginRight: 16 }}>パーセント計算</Link>
          <Link href="/random-password" style={{ color: "#0070f3", textDecoration: "underline" }}>パスワード生成</Link>
        </div>
        <div>© {new Date().getFullYear()} MajiTool</div>
      </div>
    </footer>
  );
}
