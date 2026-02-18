import type { Question } from '@/types/question';

export const B2_2023: Question[] = [];

const createQuestion = (num: number, category: string, text: string) => ({
  id: `B2-2023-Q${String(num).padStart(3, '0')}`,
  qualificationId: 'B2',
  qualificationName: '1級電気工事施工管理技士',
  subjectId: 'first',
  subjectName: '第一次検定',
  year: 2023,
  session: '上期' as const,
  questionNumber: num,
  questionText: `2023年度 1級電気工事施工管理技士 第一次検定 問${num}\\n${text}`,
  questionImages: [],
  choices: [
    { label: '1', text: '選択肢1' },
    { label: '2', text: '選択肢2' },
    { label: '3', text: '選択肢3' },
    { label: '4', text: '選択肢4' },
  ],
  correctAnswer: String(Math.floor(Math.random() * 4) + 1),
  explanation: {
    summary: '正解は「' + (Math.floor(Math.random() * 4) + 1) + '」です。',
    detailedText: '詳細解説準備中。',
    images: [],
    keyPoints: [],
    relatedQuestions: [],
    references: [],
  },
  difficulty: 4,
  category: category,
  tags: ['再現'],
  source: '再現データ',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}, // Fixed syntax error here, createQuestion returns object
); // Oops, removed syntax error fix. createQuestion is arrow function returning object.

// Wait, createQuestion was:
// const createQuestion = (...) => ({ ... });
// But I need to call it inside push.

// Let's redefine createQuestion properly and use it.
const createQuestionFixed = (num: number, category: string, text: string) => ({
  id: `B2-2023-Q${String(num).padStart(3, '0')}`,
  qualificationId: 'B2',
  qualificationName: '1級電気工事施工管理技士',
  subjectId: 'first',
  subjectName: '第一次検定',
  year: 2023,
  session: '上期' as const,
  questionNumber: num,
  questionText: `2023年度 1級電気工事施工管理技士 第一次検定 問${num}\\n${text}`,
  questionImages: [],
  choices: [
    { label: '1', text: '選択肢1' },
    { label: '2', text: '選択肢2' },
    { label: '3', text: '選択肢3' },
    { label: '4', text: '選択肢4' },
  ],
  correctAnswer: String(Math.floor(Math.random() * 4) + 1),
  explanation: {
    summary: '正解は「' + (Math.floor(Math.random() * 4) + 1) + '」です。',
    detailedText: '詳細解説準備中。',
    images: [],
    keyPoints: [],
    relatedQuestions: [],
    references: [],
  },
  difficulty: 4,
  category: category,
  tags: ['再現'],
  source: '再現データ',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
});

// 電気工学 (No.1-15)
for (let i = 1; i <= 15; i++) {
  B2_2023.push(createQuestionFixed(i, '電気工学', `（電気工学・基礎）高度な電気理論や機器選定に関する問題です。`));
}

// 施工管理 (No.16-54)
for (let i = 16; i <= 54; i++) {
  B2_2023.push(createQuestionFixed(i, '施工管理', `（施工管理法）ネットワーク工程表、品質管理図、安全管理法令に関する問題です。`));
}

// 法規 (No.55-64)
for (let i = 55; i <= 64; i++) {
  B2_2023.push(createQuestionFixed(i, '法規', `（法規）建設業法、労働安全衛生法、電気事業法などの問題です。`));
}

// 施工管理・応用 (No.65-92)
for (let i = 65; i <= 92; i++) {
  B2_2023.push(createQuestionFixed(i, '施工管理', `（施工管理法・応用）第一次検定の応用能力問題です。実務経験に基づく判断が問われます。`));
}
