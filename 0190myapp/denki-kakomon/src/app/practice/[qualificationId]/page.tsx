'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getQualification } from '@/data/qualifications';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { useProgressStore } from '@/stores/progressStore';
import { saveLastSession } from '@/lib/storage';
import { notFound } from 'next/navigation';
import type { Question } from '@/types/question';

import { getQuestions } from '@/data/questions';

export default function PracticePage({ params }: { params: Promise<{ qualificationId: string }> }) {
    const { qualificationId } = use(params);
    const searchParams = useSearchParams();
    const yearParam = searchParams.get('year');

    // If year is specified, find the index of the first question for that year
    const targetYear = yearParam ? parseInt(yearParam, 10) : null;
    let initialStartIndex = parseInt(searchParams.get('start') || '0', 10);

    const qual = getQualification(qualificationId);
    const questions = getQuestions(qualificationId);

    // Adjust startIndex if year is provided and not manually overridden by start param
    if (targetYear && !searchParams.get('start')) {
        const foundIndex = questions.findIndex(q => q.year === targetYear);
        if (foundIndex !== -1) {
            initialStartIndex = foundIndex;
        }
    }

    const { recordAnswer } = useProgressStore();

    const [currentIndex, setCurrentIndex] = useState(initialStartIndex);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentQuestion = questions[currentIndex];

    const handleAnswer = useCallback((label: string) => {
        if (!currentQuestion) return;
        const isCorrect = label === currentQuestion.correctAnswer;
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: label }));
        recordAnswer(
            qualificationId,
            currentQuestion.subjectId,
            String(currentQuestion.year),
            currentQuestion.id,
            label,
            isCorrect,
            0
        );
        // Save session
        if (qual) {
            saveLastSession({
                qualificationId,
                qualificationName: qual.name,
                subjectId: currentQuestion.subjectId,
                subjectName: currentQuestion.subjectName,
                year: String(currentQuestion.year),
                questionIndex: currentIndex,
                timestamp: new Date().toISOString(),
            });
        }
    }, [currentQuestion, currentIndex, qualificationId, qual, recordAnswer]);

    if (!qual || questions.length === 0) {
        notFound();
    }

    const goNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    };
    const goPrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-text-secondary mb-6">
                <Link href="/" className="hover:text-text-primary transition-colors">ホーム</Link>
                <span className="mx-2">/</span>
                <Link href={`/${qualificationId}`} className="hover:text-text-primary transition-colors">{qual.name}</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary">練習モード</span>
            </nav>

            <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
                📖 練習モード
                <span className="text-sm font-normal text-text-secondary">— {qual.name}</span>
            </h1>

            {/* Question Card */}
            <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionIndex={currentIndex}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion.id] || null}
                onAnswer={handleAnswer}
                mode="practice"
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-text-primary hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← 前の問題
                </button>
                <span className="text-sm text-text-secondary">
                    {currentIndex + 1} / {questions.length}
                </span>
                <button
                    onClick={goNext}
                    disabled={currentIndex === questions.length - 1}
                    className="px-5 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    次の問題 →
                </button>
            </div>
        </div>
    );
}
