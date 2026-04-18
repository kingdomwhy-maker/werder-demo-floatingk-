import "./globals.css";

export const metadata = {
  title: "SV Werder Bremen · 赞助商权益追踪",
  description: "赞助商权益追踪与品牌运营简报演示",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
