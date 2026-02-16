'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProgressStore } from '@/stores/progressStore';

export default function SettingsPage() {
    const settings = useSettingsStore();
    const { resetProgress, isLoaded } = useProgressStore();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        resetProgress();
        setShowResetConfirm(false);
        alert('学習データがリセットされました。');
    };

    if (!isLoaded) return null;

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-text-secondary mb-6">
                <Link href="/" className="hover:text-text-primary transition-colors">ホーム</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary">設定</span>
            </nav>

            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                ⚙️ 設定
            </h1>

            {/* General Settings */}
            <section className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-text-primary">一般設定</h2>
                <div className="glass-card overflow-hidden">
                    {/* Sounds */}
                    <div className="p-4 flex items-center justify-between border-b border-[var(--glass-border)]">
                        <div>
                            <p className="font-bold">効果音</p>
                            <p className="text-xs text-text-secondary">正解・不正解時の効果音を再生します（未実装）</p>
                        </div>
                        <button
                            onClick={settings.toggleSound}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-600'}`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    {/* Auto Submit - Example item */}
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold">自動判定</p>
                            <p className="text-xs text-text-secondary">選択肢を選んだ瞬間に判定を行います</p>
                        </div>
                        <button
                            onClick={settings.toggleAutoSubmit}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.autoSubmit ? 'bg-primary-500' : 'bg-gray-600'}`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.autoSubmit ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-text-primary">データ管理</h2>
                <div className="glass-card p-6">
                    <p className="text-sm text-text-secondary mb-4">
                        学習履歴（回答数、正答率、ブックマークなど）をすべて削除します。この操作は取り消せません。
                    </p>
                    {!showResetConfirm ? (
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="px-4 py-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors text-sm font-bold"
                        >
                            学習データをリセット
                        </button>
                    ) : (
                        <div className="p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 animate-fade-in">
                            <p className="font-bold text-[var(--error)] mb-2">本当によろしいですか？</p>
                            <p className="text-xs text-text-secondary mb-4">
                                すべての進行状況が失われます。
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 rounded-lg bg-[var(--error)] text-white text-sm hover:opacity-90 transition-opacity"
                                >
                                    はい、削除します
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-4 py-2 rounded-lg bg-white/10 text-text-primary text-sm hover:bg-white/20 transition-colors"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* About */}
            <section>
                <h2 className="text-lg font-bold mb-4 text-text-primary">アプリ情報</h2>
                <div className="glass-card p-6 text-sm text-text-secondary">
                    <div className="flex justify-between mb-2">
                        <span>バージョン</span>
                        <span className="font-mono">v0.1.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>開発</span>
                        <span>Antigravity (Google DeepMind)</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
