'use client';

import { v4 as uuidv4 } from 'uuid';

const VISITOR_KEY = 'denki-visitor-id';
const LAST_SESSION_KEY = 'denki-last-session';

export function getVisitorId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
        id = uuidv4();
        localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
}

export function generateRecoveryCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export interface LastSession {
    qualificationId: string;
    qualificationName: string;
    subjectId: string;
    subjectName: string;
    year: string;
    questionIndex: number;
    timestamp: string;
}

export function saveLastSession(session: LastSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
}

export function getLastSession(): LastSession | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as LastSession;
    } catch {
        return null;
    }
}

export function clearLastSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LAST_SESSION_KEY);
}
