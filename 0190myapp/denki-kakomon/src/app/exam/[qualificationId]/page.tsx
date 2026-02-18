'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getQualification } from '@/data/qualifications';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { ResultSummary } from '@/components/exam/ResultSummary';
import { TimerDisplay } from '@/components/ui/Timer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTimer } from '@/hooks/useTimer';
import { useExamStore } from '@/stores/examStore';
import { notFound } from 'next/navigation';
import type { Question } from '@/types/question';
import type { ExamResult, ExamAnswer } from '@/types/exam';

import { getQuestions } from '@/data/questions';

type ExamPhase = 'setup' | 'running' | 'result';

export default function ExamPage({ params }: { params: Promise<{ qualificationId: string }> }) {
    const { qualificationId } = use(params);
    const searchParams = useSearchParams(); // Needs dynamic import or Suspense boundary if used directly, but usually fine in page component
    // Note: Next.js 15+ might require wrapping in Suspense for searchParams usage in client components, 
    // but standard page props usually handle params/searchParams. 
    // Wait, this is a client component ('use client'), so useSearchParams hook is correct.

    const yearParam = searchParams.get('year');
    const targetYear = yearParam ? parseInt(yearParam, 10) : null;

    const qual = getQualification(qualificationId);
    const allQuestions = getQuestions(qualificationId);

    // Filter questions if year is specified
    const questions = targetYear
        ? allQuestions.filter(q => q.year === targetYear)
        : allQuestions;

    const [phase, setPhase] = useState<ExamPhase>('setup');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
    const [result, setResult] = useState<ExamResult | null>(null);
    const [startTime, setStartTime] = useState(0);

    const examConfig = qual?.examConfigs[0];
    const timeLimitSeconds = (examConfig?.timeMinutes || 30) * 60;

    const handleExpire = useCallback(() => {
        handleSubmit();
    }, []);

    const timer = useTimer({
        initialSeconds: timeLimitSeconds,
        warningThreshold: Math.floor(timeLimitSeconds * 0.25),
        criticalThreshold: Math.floor(timeLimitSeconds * 0.10),
        onExpire: handleExpire,
        autoStart: false,
    });

    if (!qual || questions.length === 0) {
        notFound();
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;

    function handleStartExam() {
        setPhase('running');
        setStartTime(Date.now());
        timer.start();
    }

    function handleAnswer(label: string) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: label }));
    }

    function handleSubmit() {
        timer.pause();
        const examAnswers: ExamAnswer[] = questions.map((q) => ({
            questionId: q.id,
            selected: answers[q.id] || '',
            correct: q.correctAnswer,
            isCorrect: answers[q.id] === q.correctAnswer,
        }));
        const correctCount = examAnswers.filter((a) => a.isCorrect).length;
        const examResult: ExamResult = {
            qualificationId,
            totalQuestions: questions.length,
            correctCount,
            accuracy: Math.round((correctCount / questions.length) * 100),
            timeTaken: Math.round((Date.now() - startTime) / 1000),
            answers: examAnswers,
            completedAt: new Date().toISOString(),
        };
        setResult(examResult);
        setPhase('result');
    }

    function toggleBookmark(qid: string) {
        setBookmarked((prev) => {
            const next = new Set(prev);
            if (next.has(qid)) next.delete(qid);
            else next.add(qid);
            return next;
        });
    }

    // ── Setup Phase ──
    if (phase === 'setup') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <div className="glass-card p-8" style={{ cursor: 'default' }}>
                    <span className="text-5xl block mb-4">⏱️</span>
                    <h1 className="text-2xl font-bold mb-2">試験モード</h1>
                    <p className="text-text-secondary mb-6">{qual.name}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-text-secondary">出題数</p>
                            <p className="text-xl font-bold mt-1">{questions.length}問</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-text-secondary">制限時間</p>
                            <p className="text-xl font-bold mt-1">{examConfig?.timeMinutes || 30}分</p>
                        </div>
                    </div>

                    <div className="bg-warning/10 rounded-xl p-4 mb-6 text-left text-sm">
                        <p className="font-bold text-warning mb-2">⚠️ 注意事項</p>
                        <ul className="space-y-1 text-text-secondary">
                            <li>• タイマーが0になると自動的に提出されます</li>
                            <li>• 全問回答後、「提出」ボタンで結果を確認できます</li>
                            <li>• ブラウザを閉じると進捗は失われます</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleStartExam}
                        className="w-full py-4 rounded-xl bg-primary-500 text-white text-lg font-bold hover:bg-primary-600 transition-colors"
                    >
                        試験を開始する
                    </button>

                    <Link href={`/${qualificationId}`} className="block mt-4 text-sm text-text-secondary hover:text-text-primary transition-colors">
                        ← 戻る
                    </Link>
                </div>
            </div>
        );
    }

    // ── Result Phase ──
    if (phase === 'result' && result) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <ResultSummary result={result} qualificationName={qual.name} />
            </div>
        );
    }

    // ── Running Phase ──
    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
            {/* Timer bar */}
            <div className="sticky top-16 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl py-3 mb-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-2">
                    <TimerDisplay
                        formatted={timer.formatted}
                        phase={timer.phase}
                        percentRemaining={timer.percentRemaining}
                    />
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-text-secondary">
                            回答: <strong className="text-text-primary">{answeredCount}</strong>/{questions.length}
                        </span>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm hover:bg-accent-600 transition-colors"
                        >
                            提出する
                        </button>
                    </div>
                </div>
                <ProgressBar value={answeredCount} max={questions.length} height={3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                {/* Main question area */}
                <div>
                    <QuestionCard
                        key={currentQuestion.id}
                        question={currentQuestion}
                        questionIndex={currentIndex}
                        totalQuestions={questions.length}
                        selectedAnswer={answers[currentQuestion.id] || null}
                        onAnswer={handleAnswer}
                        mode="exam"
                    />

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
                        >
                            ← 前へ
                        </button>
                        <button
                            onClick={() => toggleBookmark(currentQuestion.id)}
                            className={`px-4 py-2 rounded-xl text-sm transition-colors ${bookmarked.has(currentQuestion.id) ? 'bg-accent-500/20 text-accent-500' : 'bg-white/10 text-text-secondary hover:bg-white/20'
                                }`}
                        >
                            🔖 {bookmarked.has(currentQuestion.id) ? '保存済' : '保存'}
                        </button>
                        <button
                            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                            disabled={currentIndex === questions.length - 1}
                            className="px-5 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-30"
                        >
                            次へ →
                        </button>
                    </div>
                </div>

                {/* Side panel */}
                <div className="hidden lg:block">
                    <QuestionNavigator
                        totalQuestions={questions.length}
                        currentIndex={currentIndex}
                        answers={answers}
                        questionIds={questions.map((q) => q.id)}
                        bookmarked={bookmarked}
                        onNavigate={setCurrentIndex}
                    />
                </div>
            </div>
        </div>
    );
}
