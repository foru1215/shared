'use client';

import type { ExamResult } from '@/types/exam';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';

interface ResultSummaryProps {
    result: ExamResult;
    qualificationName: string;
}

export function ResultSummary({ result, qualificationName }: ResultSummaryProps) {
    const isPassed = result.accuracy >= 60;
    const minutes = Math.floor(result.timeTaken / 60);
    const seconds = result.timeTaken % 60;

    return (
        <div className="max-w-2xl mx-auto animate-slide-in-up">
            {/* Hero result */}
            <div className={`glass-card p-8 text-center mb-6 ${isPassed ? 'border-[var(--success)]' : 'border-[var(--error)]'}`} style={{ cursor: 'default' }}>
                <div className={`text-6xl mb-4 ${isPassed ? '' : 'animate-shake'}`}>
                    {isPassed ? '🎉' : '📚'}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {isPassed ? '合格ライン到達！' : 'もう少し！'}
                </h2>
                <p className="text-text-secondary">{qualificationName}</p>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-5 text-center" style={{ cursor: 'default' }}>
                    <p className="text-3xl font-bold" style={{ color: isPassed ? 'var(--success)' : 'var(--error)' }}>
                        {result.accuracy}%
                    </p>
                    <p className="text-sm text-text-secondary mt-1">正答率</p>
                    <ProgressBar value={result.accuracy} className="mt-3" />
                </div>
                <div className="glass-card p-5 text-center" style={{ cursor: 'default' }}>
                    <p className="text-3xl font-bold text-primary-400">
                        {result.correctCount}/{result.totalQuestions}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">正解数</p>
                </div>
                <div className="glass-card p-5 text-center" style={{ cursor: 'default' }}>
                    <p className="text-3xl font-bold text-accent-500">
                        {minutes}:{String(seconds).padStart(2, '0')}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">所要時間</p>
                </div>
                <div className="glass-card p-5 text-center" style={{ cursor: 'default' }}>
                    <p className="text-3xl font-bold text-text-primary">
                        {result.answers.filter(a => a.selected === '').length}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">未回答</p>
                </div>
            </div>

            {/* Answer breakdown */}
            <div className="glass-card p-6 mb-6" style={{ cursor: 'default' }}>
                <h3 className="font-bold mb-4">回答一覧</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {result.answers.map((a, i) => (
                        <div key={a.questionId}
                            className={`flex items-center justify-between p-3 rounded-lg ${a.isCorrect ? 'bg-[var(--success)]/10' : 'bg-[var(--error)]/10'
                                }`}>
                            <span className="text-sm">問{i + 1}</span>
                            <span className="text-sm">
                                あなたの回答: <strong>{a.selected || '未回答'}</strong>
                            </span>
                            <span className="text-sm">正解: <strong>{a.correct}</strong></span>
                            <span className={`text-lg ${a.isCorrect ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                                {a.isCorrect ? '✓' : '✗'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <Link href="/" className="px-6 py-3 rounded-xl bg-white/10 text-text-primary hover:bg-white/20 transition-colors">
                    トップに戻る
                </Link>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                    もう一度挑戦
                </button>
            </div>
        </div>
    );
}
