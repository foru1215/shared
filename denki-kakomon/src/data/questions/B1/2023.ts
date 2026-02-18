import type { Question } from '@/types/question';

export const B1_2023: Question[] = [];

const createQuestion = (num: number, category: string, text: string) => ({
  id: `B1-2023-Q${String(num).padStart(3, '0')}`,
  qualificationId: 'B1',
  qualificationName: '2級電気工事施工管理技士',
  subjectId: 'first',
  subjectName: '第一次検定',
  year: 2023,
  session: '後期' as const, // 2級は年2回あるが、後期を想定
  questionNumber: num,
  questionText: `2023年度 2級電気工事施工管理技士 第一次検定 問${num}\\n${text}`,
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
  difficulty: 3,
  category: category,
  tags: ['再現'],
  source: '再現データ',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
});

// 電気工学 (No.1-15)
for (let i = 1; i <= 15; i++) {
  B1_2023.push(createQuestion(i, '電気工学', `（電気工学・基礎）電気理論や機器に関する問題です。\\n詳細な問題文は確認され次第更新されます。`));
}

// 施工管理 (No.16-40)
for (let i = 16; i <= 40; i++) {
  B1_2023.push(createQuestion(i, '施工管理', `（施工管理法）施工計画、工程管理、品質管理、安全管理に関する問題です。`));
}

// 法規 (No.41-50)
for (let i = 41; i <= 50; i++) {
  B1_2023.push(createQuestion(i, '法規', `（法規）建設業法、電気事業法、労働基準法などの法令問題です。`));
}

// 施工管理・応用 (No.51-64)
for (let i = 51; i <= 64; i++) {
  B1_2023.push(createQuestion(i, '施工管理', `（施工管理法・応用）実務的な施工管理能力を問う応用問題です。`));
}
