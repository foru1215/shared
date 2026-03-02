export interface UserIdentification {
  visitorId: string;
  fingerprint: string;
  recoveryCode?: string;
  lastAccessAt: string;
}

export interface QuestionAnswer {
  selectedAnswer: string;
  isCorrect: boolean;
  attemptCount: number;
  lastAttemptAt: string;
  bookmarked: boolean;
}

export interface YearProgress {
  questionsTotal: number;
  questionsAnswered: number;
  questionsCorrect: number;
  lastAttemptAt: string;
  timeSpentSeconds: number;
  answers: Record<string, QuestionAnswer>;
}

export interface SubjectProgress {
  years: Record<string, YearProgress>;
}

export interface QualificationProgress {
  subjects: Record<string, SubjectProgress>;
  overallAccuracy: number;
  totalTimeSpent: number;
  lastStudiedAt: string;
}

export interface UserProgress {
  visitorId: string;
  qualifications: Record<string, QualificationProgress>;
  weakQuestions: string[];
  bookmarks: string[];
}
