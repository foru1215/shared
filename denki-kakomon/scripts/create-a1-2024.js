const fs = require('fs');
const path = require('path');

const qUrl = 'https://www.shiken.or.jp/construction/upload/20240526_co_second_q01.pdf';
const aUrl = 'https://www.shiken.or.jp/construction/upload/20240526_co_second_a01.pdf';

let content = `import type { Question } from '@/types/question';

export const A1_2024: Question[] = [
`;

for (let i = 1; i <= 50; i++) {
    const qNum = String(i).padStart(3, '0');
    // Simple category estimation
    let category = '一般問題';
    if (i > 30) category = '配線図';

    content += `  {
    id: 'A1-2024-Q${qNum}',
    qualificationId: 'A1',
    qualificationName: '第二種電気工事士',
    subjectId: 'written',
    subjectName: '筆記試験',
    year: 2024,
    session: '上期',
    questionNumber: ${i},
    questionText: '2024年(令和6年) 上期 筆記試験 問${i}\\n\\n本問のテキスト・画像データは準備中です。\\n以下の公式PDFをご参照ください。\\n\\n[試験問題PDFを開く](${qUrl})',
    questionImages: [],
    choices: [
      { label: 'イ', text: '選択肢イ' },
      { label: 'ロ', text: '選択肢ロ' },
      { label: 'ハ', text: '選択肢ハ' },
      { label: 'ニ', text: '選択肢ニ' },
    ],
    correctAnswer: 'イ', // Temporary placeholder
    explanation: {
      summary: '正答データは準備中です。',
      detailedText: '正しい正解は以下の公式解答PDFをご参照ください。\\n\\n[解答PDFを開く](${aUrl})',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 3,
    category: '${category}',
    tags: ['PDF参照'],
    source: '公式サイト',
    createdAt: '2024-05-26',
    updatedAt: '2024-05-26',
  },
`;
}

content += `];\n`;

const targetDir = path.join(__dirname, '../src/data/questions/A1');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, '2024.ts'), content);
console.log('Created A1/2024.ts');
