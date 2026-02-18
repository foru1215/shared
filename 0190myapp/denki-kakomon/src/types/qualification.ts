import type { Difficulty } from './question';

export interface QualificationCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  questionCount?: number;
}

export interface ExamTimeConfig {
  subjectId: string;
  timeMinutes: number;
  questionCount: number;
}

export type DataStatus = 'available' | 'coming-soon' | 'planned';

export interface Qualification {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  subjects: Subject[];
  examConfigs: ExamTimeConfig[];
  officialUrl: string;
  difficulty: Difficulty;
  popularity: number;
  dataStatus: DataStatus;
}
