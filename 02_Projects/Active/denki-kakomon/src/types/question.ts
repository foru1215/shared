export interface QuestionImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ExplanationBlock {
  summary: string;
  detailedText: string;
  images: QuestionImage[];
  formula?: string;
  keyPoints: string[];
  relatedQuestions?: string[];
  references: {
    title: string;
    url: string;
  }[];
}

export interface Choice {
  label: string;
  text: string;
  image?: string;
}

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type SessionType = '上期' | '下期' | '前期' | '後期';

export interface Question {
  id: string;
  qualificationId: string;
  qualificationName: string;
  subjectId: string;
  subjectName: string;
  year: number;
  session: SessionType;
  questionNumber: number;
  questionText: string;
  questionImages: QuestionImage[];
  choices: Choice[];
  correctAnswer: string;
  explanation: ExplanationBlock;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}
