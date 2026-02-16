'use client';

import { use } from 'react';
import Link from 'next/link';
import { getQualification, getCategoryInfo } from '@/data/qualifications';
import { Badge } from '@/components/ui/Badge';
import { notFound } from 'next/navigation';

import { getQuestionCounts } from '@/data/questions';

export default function QualificationPage({ params }: { params: Promise<{ qualificationId: string }> }) {
    const { qualificationId } = use(params);
    const qual = getQualification(qualificationId);

    if (!qual || qual.dataStatus !== 'available') {
        notFound();
    }

    const cat = getCategoryInfo(qual.category);
    const years = getQuestionCounts(qualificationId);
    const difficultyStars = '★'.repeat(qual.difficulty) + '☆'.repeat(5 - qual.difficulty);

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-text-secondary mb-6">
                <Link href="/" className="hover:text-text-primary transition-colors">ホーム</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary">{qual.name}</span>
            </nav>

            {/* Header */}
            <div className="glass-card p-6 mb-8" style={{ cursor: 'default' }}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{cat?.icon}</span>
                            <Badge variant="info">{cat?.name}</Badge>
                        </div>
                        <h1 className="text-2xl font-bold">{qual.name}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm" style={{ color: cat?.color }}>{difficultyStars}</p>
                        <p className="text-xs text-text-secondary mt-1">難易度</p>
                    </div>
                </div>
                <p className="text-text-secondary text-sm">{qual.description}</p>
            </div>

            {/* Subjects */}
            <section className="mb-8">
                <h2 className="text-lg font-bold mb-4">📚 試験科目</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {qual.subjects.map((subj) => {
                        const examConfig = qual.examConfigs.find((ec) => ec.subjectId === subj.id);
                        return (
                            <div key={subj.id} className="glass-card p-4" style={{ cursor: 'default' }}>
                                <h3 className="font-bold text-sm">{subj.name}</h3>
                                {examConfig && (
                                    <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                                        <span>⏱️ {examConfig.timeMinutes}分</span>
                                        <span>📋 {examConfig.questionCount}問</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Available years */}
            <section className="mb-8">
                <h2 className="text-lg font-bold mb-4">📅 年度別過去問</h2>
                {Object.keys(years).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(years).map(([year, count]) => (
                            <div key={year} className="glass-card p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">令和{parseInt(year) - 2018}年度 ({year}年)</h3>
                                    <p className="text-xs text-text-secondary mt-1">{count}問収録</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/practice/${qualificationId}?year=${year}`}
                                        className="px-3 py-2 rounded-lg bg-primary-500/20 text-primary-400 text-xs hover:bg-primary-500/30 transition-colors"
                                    >
                                        練習
                                    </Link>
                                    <Link
                                        href={`/exam/${qualificationId}?year=${year}`}
                                        className="px-3 py-2 rounded-lg bg-accent-500/20 text-accent-500 text-xs hover:bg-accent-500/30 transition-colors"
                                    >
                                        試験
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center text-text-secondary" style={{ cursor: 'default' }}>
                        <p className="text-4xl mb-2">🚧</p>
                        <p>問題データは現在準備中です</p>
                    </div>
                )}
            </section>

            {/* Quick start */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href={`/practice/${qualificationId}`}
                    className="flex-1 glass-card p-6 text-center hover:border-primary-400/50 transition-colors"
                >
                    <span className="text-3xl block mb-2">📖</span>
                    <span className="font-bold">練習モード</span>
                    <p className="text-xs text-text-secondary mt-1">1問ずつ解説付きで学習</p>
                </Link>
                <Link
                    href={`/exam/${qualificationId}`}
                    className="flex-1 glass-card p-6 text-center hover:border-accent-500/50 transition-colors"
                >
                    <span className="text-3xl block mb-2">⏱️</span>
                    <span className="font-bold">試験モード</span>
                    <p className="text-xs text-text-secondary mt-1">本番形式でタイマー付き</p>
                </Link>
            </div>
        </div>
    );
}
