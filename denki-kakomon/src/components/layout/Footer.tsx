import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            電気系資格 過去問マスター
          </p>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              サイト概要
            </Link>
            <Link href="/settings" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              設定
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-text-secondary/60">
          過去問の著作権は各試験実施団体に帰属します。解説は独自に作成したものです。
        </p>
      </div>
    </footer>
  );
}
