import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '햇빛구 육아용품 대여실',
  description: '육아용품 대여 이력과 소독 기록을 관리하는 직원용 도구 (가상 데이터)',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/items" className="brand">
              햇빛구 육아용품 대여실
            </Link>
            <span className="header-note">직원용 관리 도구 · 가상 데이터</span>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
