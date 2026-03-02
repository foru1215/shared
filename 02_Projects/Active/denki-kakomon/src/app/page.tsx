'use client';

import Link from 'next/link';
import { CATEGORIES, QUALIFICATIONS, getCategoryInfo } from '@/data/qualifications';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { useProgressStore } from '@/stores/progressStore';
import { getLastSession } from '@/lib/storage';
import { useEffect, useState } from 'react';
import type { LastSession } from '@/lib/storage';

export default function HomePage() {
  const { getTotalAnswered, getTotalCorrect, getAccuracy } = useProgressStore();
  const [lastSession, setLastSession] = useState<LastSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastSession(getLastSession());
  }, []);

  const totalAnswered = mounted ? getTotalAnswered() : 0;
  const totalCorrect = mounted ? getTotalCorrect() : 0;
  const accuracy = mounted ? getAccuracy() : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-primary-400">⚡</span> 電気系資格 過去問マスター
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
          26種類以上の電気系資格の過去問を無料で学習。登録不要、ブラウザだけで始められます。
        </p>
      </div>

      {/* Stats */}
      {mounted && totalAnswered > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-up">
          <StatCard label="総解答数" value={String(totalAnswered)} icon="📝" />
          <StatCard label="正答率" value={`${accuracy}%`} icon="🎯" />
          <StatCard label="正解数" value={String(totalCorrect)} icon="✅" />
          <StatCard label="不正解数" value={String(totalAnswered - totalCorrect)} icon="📖" />
        </div>
      )}

      {/* Resume */}
      {lastSession && (
        <div className="glass-card p-4 mb-8 flex items-center justify-between" style={{ cursor: 'default' }}>
          <div>
            <p className="text-sm text-text-secondary">🔄 前回の続きから</p>
            <p className="font-medium mt-1">
              {lastSession.qualificationName} {lastSession.subjectName} {lastSession.year}年
            </p>
          </div>
          <Link
            href={`/practice/${lastSession.qualificationId}?year=${lastSession.year}&subject=${lastSession.subjectId}&start=${lastSession.questionIndex}`}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm hover:bg-primary-600 transition-colors"
          >
            再開する
          </Link>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const quals = QUALIFICATIONS.filter((q) => q.category === cat.id);
          if (quals.length === 0) return null;
          return (
            <section key={cat.id} className="animate-slide-in-up">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <Badge variant="info" size="sm">{quals.length}資格</Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quals.map((qual) => (
                  <QualificationCard key={qual.id} qualification={qual} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass-card p-4 text-center" style={{ cursor: 'default' }}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  );
}

function QualificationCard({ qualification }: { qualification: typeof QUALIFICATIONS[0] }) {
  const cat = getCategoryInfo(qualification.category);
  const statusVariant = qualification.dataStatus === 'available' ? 'success'
    : qualification.dataStatus === 'coming-soon' ? 'warning' : 'default';
  const statusLabel = qualification.dataStatus === 'available' ? '学習可能'
    : qualification.dataStatus === 'coming-soon' ? '準備中' : '計画中';

  const difficultyStars = '★'.repeat(qualification.difficulty) + '☆'.repeat(5 - qualification.difficulty);

  return (
    <Link href={qualification.dataStatus === 'available' ? `/${qualification.id}` : '#'}>
      <div className={`glass-card p-5 h-full ${qualification.dataStatus !== 'available' ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-sm leading-tight">{qualification.name}</h3>
          <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
        </div>
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">{qualification.description}</p>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span style={{ color: cat?.color }}>{difficultyStars}</span>
          <span>{qualification.subjects.length}科目</span>
        </div>
        {qualification.dataStatus === 'available' && (
          <ProgressBar value={0} className="mt-3" height={4} />
        )}
      </div>
    </Link>
  );
}
