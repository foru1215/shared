import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '電気系資格 過去問マスター',
    template: '%s | 電気過去問マスター',
  },
  description:
    '電気工事士・電験三種・施工管理技士など26資格の過去問を無料で学習。登録不要、ブラウザだけで過去問演習・進捗管理・試験シミュレーションが可能。',
  keywords: [
    '電気工事士',
    '電験三種',
    '過去問',
    '電気系資格',
    '施工管理技士',
    '無料',
    '学習',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="dark">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
