'use client';

import type { TimerPhase } from '@/types/exam';

interface TimerDisplayProps {
    formatted: string;
    phase: TimerPhase;
    percentRemaining: number;
}

const phaseStyles: Record<TimerPhase, { color: string; className: string }> = {
    normal: { color: 'var(--primary-500)', className: '' },
    warning: { color: 'var(--warning)', className: 'animate-pulse' },
    critical: { color: 'var(--error)', className: 'animate-pulse' },
    expired: { color: 'var(--error)', className: '' },
};

export function TimerDisplay({ formatted, phase, percentRemaining }: TimerDisplayProps) {
    const style = phaseStyles[phase];

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle
                        cx="18" cy="18" r="15.5"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3"
                    />
                    <circle
                        cx="18" cy="18" r="15.5"
                        fill="none"
                        stroke={style.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${percentRemaining} ${100 - percentRemaining}`}
                        className="transition-all duration-1000"
                    />
                </svg>
                <span className="absolute text-xs" style={{ color: style.color }}>🕐</span>
            </div>
            <span
                className={`text-xl font-mono font-bold tabular-nums ${style.className}`}
                style={{ color: style.color }}
            >
                {phase === 'expired' ? '時間切れ' : formatted}
            </span>
        </div>
    );
}
