'use client';

import type { ExplanationBlock } from '@/types/question';

interface ExplanationPanelProps {
    explanation: ExplanationBlock;
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
    return (
        <div className="glass-card p-6 animate-slide-in-up" style={{ cursor: 'default' }}>
            <h3 className="text-lg font-bold text-primary-400 mb-3 flex items-center gap-2">
                📖 解説
            </h3>

            {/* Summary */}
            <div className="bg-primary-500/10 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium">{explanation.summary}</p>
            </div>

            {/* Detailed explanation */}
            <div className="prose prose-invert prose-sm max-w-none mb-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">
                    {explanation.detailedText.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                            return <h4 key={i} className="text-base font-bold text-text-primary mt-4 mb-2">{line.replace('## ', '')}</h4>;
                        }
                        if (line.startsWith('### ')) {
                            return <h5 key={i} className="text-sm font-bold text-text-primary mt-3 mb-1">{line.replace('### ', '')}</h5>;
                        }
                        if (line.startsWith('- ')) {
                            return <p key={i} className="ml-4">• {line.replace('- ', '')}</p>;
                        }
                        if (line.startsWith('$$') && line.endsWith('$$')) {
                            return <p key={i} className="text-center font-mono text-primary-300 my-2">{line.replace(/\$/g, '')}</p>;
                        }
                        if (line.startsWith('|')) {
                            return <p key={i} className="font-mono text-xs">{line}</p>;
                        }
                        return line ? <p key={i}>{line}</p> : <br key={i} />;
                    })}
                </div>
            </div>

            {/* Formula */}
            {explanation.formula && (
                <div className="bg-white/5 rounded-lg p-3 mb-4 border border-[var(--glass-border)]">
                    <p className="text-xs text-text-secondary mb-1">関連公式</p>
                    <p className="font-mono text-primary-300 text-center">{explanation.formula}</p>
                </div>
            )}

            {/* Key points */}
            {explanation.keyPoints.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-bold text-accent-500 mb-2">💡 ポイント</p>
                    <ul className="space-y-1">
                        {explanation.keyPoints.map((point, i) => (
                            <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                <span className="text-accent-500 mt-0.5">•</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Images */}
            {explanation.images.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                    {explanation.images.map((img, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-[var(--glass-border)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.alt} className="max-w-full h-auto" />
                            {img.caption && <p className="text-xs text-text-secondary p-2">{img.caption}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* References */}
            {explanation.references.length > 0 && (
                <div className="border-t border-[var(--glass-border)] pt-3">
                    <p className="text-xs text-text-secondary mb-1">参考:</p>
                    {explanation.references.map((ref, i) => (
                        <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary-400 hover:underline mr-3">
                            {ref.title} ↗
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
