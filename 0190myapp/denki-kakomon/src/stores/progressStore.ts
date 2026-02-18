'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress } from '@/types/progress';

interface ProgressStore {
  progress: UserProgress;
  isLoaded: boolean;
  recordAnswer: (
    qualificationId: string,
    subjectId: string,
    year: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean,
    timeSpent: number
  ) => void;
  toggleBookmark: (questionId: string) => void;
  getAccuracy: (qualificationId?: string) => number;
  getWeakQuestions: () => string[];
  getBookmarks: () => string[];
  getTotalAnswered: () => number;
  getTotalCorrect: () => number;
  setLastSession: (qualificationId: string, subjectId: string, year: string, questionId: string) => void;
  lastSession: { qualificationId: string; subjectId: string; year: string; questionId: string } | null;
  resetProgress: () => void;
}

const emptyProgress: UserProgress = {
  visitorId: '',
  qualifications: {},
  weakQuestions: [],
  bookmarks: [],
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: emptyProgress,
      isLoaded: false,
      lastSession: null,

      recordAnswer: (qualificationId, subjectId, year, questionId, selectedAnswer, isCorrect, timeSpent) => {
        set((state) => {
          const p = { ...state.progress };
          if (!p.qualifications[qualificationId]) {
            p.qualifications[qualificationId] = {
              subjects: {},
              overallAccuracy: 0,
              totalTimeSpent: 0,
              lastStudiedAt: new Date().toISOString(),
            };
          }
          const qual = p.qualifications[qualificationId];
          if (!qual.subjects[subjectId]) {
            qual.subjects[subjectId] = { years: {} };
          }
          const subj = qual.subjects[subjectId];
          if (!subj.years[year]) {
            subj.years[year] = {
              questionsTotal: 0,
              questionsAnswered: 0,
              questionsCorrect: 0,
              lastAttemptAt: new Date().toISOString(),
              timeSpentSeconds: 0,
              answers: {},
            };
          }
          const yearData = subj.years[year];
          const existing = yearData.answers[questionId];
          if (existing) {
            existing.selectedAnswer = selectedAnswer;
            existing.isCorrect = isCorrect;
            existing.attemptCount += 1;
            existing.lastAttemptAt = new Date().toISOString();
          } else {
            yearData.answers[questionId] = {
              selectedAnswer,
              isCorrect,
              attemptCount: 1,
              lastAttemptAt: new Date().toISOString(),
              bookmarked: false,
            };
            yearData.questionsAnswered += 1;
          }
          if (isCorrect) yearData.questionsCorrect += 1;
          yearData.timeSpentSeconds += timeSpent;
          yearData.lastAttemptAt = new Date().toISOString();
          qual.totalTimeSpent += timeSpent;
          qual.lastStudiedAt = new Date().toISOString();

          // Update weak questions
          if (!isCorrect && !p.weakQuestions.includes(questionId)) {
            p.weakQuestions.push(questionId);
          } else if (isCorrect) {
            p.weakQuestions = p.weakQuestions.filter((id) => id !== questionId);
          }

          return { progress: p };
        });
      },

      toggleBookmark: (questionId) => {
        set((state) => {
          const bookmarks = state.progress.bookmarks.includes(questionId)
            ? state.progress.bookmarks.filter((id) => id !== questionId)
            : [...state.progress.bookmarks, questionId];
          return { progress: { ...state.progress, bookmarks } };
        });
      },

      getAccuracy: (qualificationId) => {
        const { progress } = get();
        let total = 0;
        let correct = 0;
        const quals = qualificationId
          ? { [qualificationId]: progress.qualifications[qualificationId] }
          : progress.qualifications;

        for (const qual of Object.values(quals)) {
          if (!qual) continue;
          for (const subj of Object.values(qual.subjects)) {
            for (const year of Object.values(subj.years)) {
              for (const answer of Object.values(year.answers)) {
                total += 1;
                if (answer.isCorrect) correct += 1;
              }
            }
          }
        }
        return total > 0 ? Math.round((correct / total) * 100) : 0;
      },

      getWeakQuestions: () => get().progress.weakQuestions,
      getBookmarks: () => get().progress.bookmarks,

      getTotalAnswered: () => {
        const { progress } = get();
        let total = 0;
        for (const qual of Object.values(progress.qualifications)) {
          for (const subj of Object.values(qual.subjects)) {
            for (const year of Object.values(subj.years)) {
              total += year.questionsAnswered;
            }
          }
        }
        return total;
      },

      getTotalCorrect: () => {
        const { progress } = get();
        let total = 0;
        for (const qual of Object.values(progress.qualifications)) {
          for (const subj of Object.values(qual.subjects)) {
            for (const year of Object.values(subj.years)) {
              total += year.questionsCorrect;
            }
          }
        }
        return total;
      },

      setLastSession: (qualificationId, subjectId, year, questionId) => {
        set({ lastSession: { qualificationId, subjectId, year, questionId } });
      },

      resetProgress: () => {
        set({ progress: emptyProgress, lastSession: null });
      },
    }),
    {
      name: 'denki-progress',
    }
  )
);
