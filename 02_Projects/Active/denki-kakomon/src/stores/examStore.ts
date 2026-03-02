'use client';

import { create } from 'zustand';
import type { Question } from '@/types/question';
import type { ExamConfig, ExamState, ExamResult, ExamAnswer } from '@/types/exam';

interface ExamStore {
  examState: ExamState | null;
  result: ExamResult | null;
  startExam: (config: ExamConfig, questions: Question[]) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleBookmark: (questionId: string) => void;
  tick: () => void;
  submitExam: () => ExamResult;
  resetExam: () => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  examState: null,
  result: null,

  startExam: (config, questions) => {
    const bookmarked = new Set<string>();
    set({
      examState: {
        config,
        questions,
        currentIndex: 0,
        answers: {},
        bookmarked,
        startedAt: Date.now(),
        timeRemaining: config.timeLimit,
        status: 'in-progress',
      },
      result: null,
    });
  },

  answerQuestion: (questionId, answer) => {
    set((state) => {
      if (!state.examState) return state;
      return {
        examState: {
          ...state.examState,
          answers: { ...state.examState.answers, [questionId]: answer },
        },
      };
    });
  },

  goToQuestion: (index) => {
    set((state) => {
      if (!state.examState) return state;
      const clampedIndex = Math.max(0, Math.min(index, state.examState.questions.length - 1));
      return {
        examState: { ...state.examState, currentIndex: clampedIndex },
      };
    });
  },

  nextQuestion: () => {
    const state = get();
    if (!state.examState) return;
    if (state.examState.currentIndex < state.examState.questions.length - 1) {
      state.goToQuestion(state.examState.currentIndex + 1);
    }
  },

  prevQuestion: () => {
    const state = get();
    if (!state.examState) return;
    if (state.examState.currentIndex > 0) {
      state.goToQuestion(state.examState.currentIndex - 1);
    }
  },

  toggleBookmark: (questionId) => {
    set((state) => {
      if (!state.examState) return state;
      const newBookmarked = new Set(state.examState.bookmarked);
      if (newBookmarked.has(questionId)) {
        newBookmarked.delete(questionId);
      } else {
        newBookmarked.add(questionId);
      }
      return {
        examState: { ...state.examState, bookmarked: newBookmarked },
      };
    });
  },

  tick: () => {
    set((state) => {
      if (!state.examState || state.examState.status !== 'in-progress') return state;
      const newRemaining = state.examState.timeRemaining - 1;
      if (newRemaining <= 0) {
        return {
          examState: { ...state.examState, timeRemaining: 0, status: 'time-up' },
        };
      }
      return {
        examState: { ...state.examState, timeRemaining: newRemaining },
      };
    });
  },

  submitExam: () => {
    const state = get();
    if (!state.examState) throw new Error('No exam in progress');

    const { config, questions, answers, startedAt } = state.examState;
    const examAnswers: ExamAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selected: answers[q.id] || '',
      correct: q.correctAnswer,
      isCorrect: answers[q.id] === q.correctAnswer,
    }));

    const correctCount = examAnswers.filter((a) => a.isCorrect).length;
    const result: ExamResult = {
      qualificationId: config.qualificationId,
      subjectId: config.subjectId,
      year: config.year,
      totalQuestions: questions.length,
      correctCount,
      accuracy: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
      timeTaken: Math.round((Date.now() - startedAt) / 1000),
      answers: examAnswers,
      completedAt: new Date().toISOString(),
    };

    set({
      examState: { ...state.examState, status: 'completed' },
      result,
    });

    return result;
  },

  resetExam: () => {
    set({ examState: null, result: null });
  },
}));
