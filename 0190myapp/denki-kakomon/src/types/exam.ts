import type { Question } from './question';

export type ExamMode = 'exam' | 'practice' | 'weak-review' | 'random';

export interface ExamConfig {
  qualificationId: string;
  subjectId?: string;
  year?: number;
  session?: string;
  timeLimit: number;
  warningThreshold: number;
  criticalThreshold: number;
  questionCount: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  mode: ExamMode;
}

export interface ExamState {
  config: ExamConfig;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  bookmarked: Set<string>;
  startedAt: number;
  timeRemaining: number;
  status: 'not-started' | 'in-progress' | 'paused' | 'completed' | 'time-up';
}

export interface ExamAnswer {
  questionId: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
}

export interface ExamResult {
  qualificationId: string;
  subjectId?: string;
  year?: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  timeTaken: number;
  answers: ExamAnswer[];
  completedAt: string;
}

export type TimerPhase = 'normal' | 'warning' | 'critical' | 'expired';
