'use client';

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    answers: Record<string, string>;
    questionIds: string[];
    bookmarked?: Set<string>;
    onNavigate: (index: number) => void;
}

export function QuestionNavigator({
    totalQuestions,
    currentIndex,
    answers,
    questionIds,
    bookmarked,
    onNavigate,
}: QuestionNavigatorProps) {
    return (
        <div className="glass-card p-4" style={{ cursor: 'default' }}>
            <p className="text-xs text-text-secondary mb-3">問題一覧</p>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalQuestions }, (_, i) => {
                    const qid = questionIds[i];
                    const isAnswered = qid && answers[qid];
                    const isCurrent = i === currentIndex;
                    const isBookmarked = qid && bookmarked?.has(qid);

                    let bg = 'bg-white/5 text-text-secondary';
                    if (isCurrent) bg = 'bg-primary-500 text-white ring-2 ring-primary-400/50';
                    else if (isAnswered) bg = 'bg-[var(--success)]/20 text-[var(--success)]';

                    return (
                        <button
                            key={i}
                            onClick={() => onNavigate(i)}
                            className={`relative w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-110 ${bg}`}
                        >
                            {i + 1}
                            {isBookmarked && (
                                <span className="absolute -top-1 -right-1 text-accent-500 text-xs">🔖</span>
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-primary-500 inline-block" /> 現在
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-[var(--success)]/30 inline-block" /> 解答済
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-white/5 inline-block" /> 未回答
                </span>
            </div>
        </div>
    );
}
