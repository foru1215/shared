'use client';

interface ProgressBarProps {
    value: number;        // 0-100
    max?: number;
    color?: string;
    height?: number;
    showLabel?: boolean;
    animated?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    color,
    height = 8,
    showLabel = false,
    animated = true,
    className = '',
}: ProgressBarProps) {
    const percent = Math.min(Math.max((value / max) * 100, 0), 100);
    const resolvedColor = color || (percent >= 80 ? 'var(--success)' : percent >= 50 ? 'var(--accent-500)' : 'var(--primary-500)');

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between mb-1">
                    <span className="text-xs text-text-secondary">{Math.round(percent)}%</span>
                </div>
            )}
            <div
                className="w-full rounded-full overflow-hidden"
                style={{
                    height: `${height}px`,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`h-full rounded-full ${animated ? 'transition-all duration-700 ease-out' : ''}`}
                    style={{
                        width: `${percent}%`,
                        backgroundColor: resolvedColor,
                    }}
                />
            </div>
        </div>
    );
}
