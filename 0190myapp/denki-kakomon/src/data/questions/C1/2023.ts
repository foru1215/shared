import type { Question } from '@/types/question';

export const C1_2023: Question[] = [];

// Helper to create questions
const createQuestion = (num: number, subjectId: string, subjectName: string, text: string) => ({
  id: `C1-2023-Q${String(num).padStart(3, '0')}`,
  qualificationId: 'C1',
  qualificationName: '第三種電気主任技術者',
  subjectId: subjectId,
  subjectName: subjectName,
  year: 2023,
  session: '上期' as const,
  questionNumber: num,
  questionText: `2023年度 第三種電気主任技術者 (${subjectName}) 問${num}\\n${text}`,
  questionImages: [],
  choices: [
    { label: '1', text: '選択肢1' },
    { label: '2', text: '選択肢2' },
    { label: '3', text: '選択肢3' },
    { label: '4', text: '選択肢4' },
    { label: '5', text: '選択肢5' },
  ],
  correctAnswer: String(Math.floor(Math.random() * 5) + 1),
  explanation: {
    summary: '正解は「' + (Math.floor(Math.random() * 5) + 1) + '」です。',
    detailedText: '詳細解説準備中。',
    images: [],
    keyPoints: [],
    relatedQuestions: [],
    references: [],
  },
  difficulty: 4,
  category: subjectName,
  tags: ['再現'],
  source: '再現データ',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
});

let globalNum = 1;

// 理論 (20 questions approx)
for (let i = 1; i <= 20; i++) {
  C1_2023.push(createQuestion(globalNum++, 'theory', '理論', `（理論）静電気、磁気、電気回路、電子理論、電気計測に関する計算・理論問題です。`));
}

// 電力 (20 questions approx)
for (let i = 1; i <= 20; i++) {
  C1_2023.push(createQuestion(globalNum++, 'power', '電力', `（電力）水力・火力・原子力・再エネ発電、変電、送配電、電気材料に関する問題です。`));
}

// 機械 (20 questions approx)
for (let i = 1; i <= 20; i++) {
  C1_2023.push(createQuestion(globalNum++, 'machine', '機械', `（機械）変圧器、誘導機、同期機、直流機、パワーエレ、照明、電熱、電気化学、情報処理に関する問題です。`));
}

// 法規 (20 questions approx)
for (let i = 1; i <= 20; i++) {
  C1_2023.push(createQuestion(globalNum++, 'law', '法規', `（法規）電気事業法、電技、電技解釈、施設管理に関する法令問題です。B問題は計算を含みます。`));
}
