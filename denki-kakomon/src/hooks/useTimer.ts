'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerPhase } from '@/types/exam';

interface UseTimerOptions {
    initialSeconds: number;
    warningThreshold?: number;   // seconds remaining
    criticalThreshold?: number;  // seconds remaining
    onExpire?: () => void;
    autoStart?: boolean;
}

interface UseTimerReturn {
    timeRemaining: number;
    isRunning: boolean;
    phase: TimerPhase;
    formatted: string;
    percentRemaining: number;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
}

export function useTimer({
    initialSeconds,
    warningThreshold = 600,
    criticalThreshold = 300,
    onExpire,
    autoStart = false,
}: UseTimerOptions): UseTimerReturn {
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onExpireRef = useRef(onExpire);

    onExpireRef.current = onExpire;

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!isRunning) {
            clearTimer();
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onExpireRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return clearTimer;
    }, [isRunning, clearTimer]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const resume = useCallback(() => setIsRunning(true), []);
    const reset = useCallback(() => {
        setTimeRemaining(initialSeconds);
        setIsRunning(false);
    }, [initialSeconds]);

    const phase: TimerPhase =
        timeRemaining <= 0
            ? 'expired'
            : timeRemaining <= criticalThreshold
                ? 'critical'
                : timeRemaining <= warningThreshold
                    ? 'warning'
                    : 'normal';

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    const formatted = hours > 0
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const percentRemaining = initialSeconds > 0 ? (timeRemaining / initialSeconds) * 100 : 0;

    return {
        timeRemaining,
        isRunning,
        phase,
        formatted,
        percentRemaining,
        start,
        pause,
        resume,
        reset,
    };
}
