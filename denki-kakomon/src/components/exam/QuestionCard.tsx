'use client';

import { useState } from 'react';
import type { Question, Choice } from '@/types/question';
import { ExplanationPanel } from '@/components/exam/ExplanationPanel';

interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    totalQuestions: number;
    selectedAnswer: string | null;
    onAnswer: (label: string) => void;
    mode: 'practice' | 'exam';
    showResult?: boolean;
}

export function QuestionCard({
    question,
    questionIndex,
    totalQuestions,
    selectedAnswer,
    onAnswer,
    mode,
    showResult = false,
}: QuestionCardProps) {
    const [revealed, setRevealed] = useState(false);
    const isAnswered = selectedAnswer !== null;
    const showExplanation = mode === 'practice' && (revealed || showResult);
    const isCorrect = selectedAnswer === question.correctAnswer;

    const handleSelect = (label: string) => {
        if (mode === 'exam' || !isAnswered) {
            onAnswer(label);
            if (mode === 'practice') {
                setRevealed(true);
            }
        }
    };

    const getChoiceStyle = (choice: Choice): string => {
        const base = 'w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3';

        if (!showExplanation && !showResult) {
            if (selectedAnswer === choice.label) {
                return `${base} border-primary-400 bg-primary-500/20 ring-2 ring-primary-400/50`;
            }
            return `${base} border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-primary-400/50 hover:bg-white/5`;
        }

        // After reveal
        if (choice.label === question.correctAnswer) {
            return `${base} border-[var(--success)] bg-[var(--success)]/15 animate-glow-correct`;
        }
        if (selectedAnswer === choice.label && !isCorrect) {
            return `${base} border-[var(--error)] bg-[var(--error)]/15 animate-shake`;
        }
        return `${base} border-[var(--glass-border)] bg-[var(--glass-bg)] opacity-60`;
    };

    return (
        <div className="animate-fade-in">
            {/* Question header */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-medium text-text-secondary bg-white/10 px-3 py-1 rounded-full">
                    問{questionIndex + 1} / {totalQuestions}
                </span>
                <span className="text-xs text-text-secondary">
                    {question.qualificationName} {question.year}年 {question.session}
                </span>
            </div>

            {/* Question text */}
            <div className="glass-card p-6 mb-6" style={{ cursor: 'default' }}>
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {question.questionText}
                </p>
                {question.questionImages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                        {question.questionImages.map((img, i) => (
                            <div key={i} className="rounded-lg overflow-hidden border border-[var(--glass-border)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={img.alt} className="max-w-full h-auto" />
                                {img.caption && (
                                    <p className="text-xs text-text-secondary p-2 text-center">{img.caption}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Choices */}
            <div className="space-y-3 mb-6">
                {question.choices.map((choice) => (
                    <button
                        key={choice.label}
                        onClick={() => handleSelect(choice.label)}
                        className={getChoiceStyle(choice)}
                        disabled={mode === 'practice' && isAnswered && revealed}
                    >
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">
                            {choice.label}
                        </span>
                        <span className="pt-1">{choice.text}</span>
                    </button>
                ))}
            </div>

            {/* Result indicator */}
            {showExplanation && (
                <div className={`mb-4 p-3 rounded-xl text-center font-bold text-lg ${isCorrect ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--error)]/20 text-[var(--error)]'
                    }`}>
                    {isCorrect ? '✓ 正解！' : `✗ 不正解（正解: ${question.correctAnswer}）`}
                </div>
            )}

            {/* Explanation */}
            {showExplanation && (
                <ExplanationPanel explanation={question.explanation} />
            )}
        </div>
    );
}
