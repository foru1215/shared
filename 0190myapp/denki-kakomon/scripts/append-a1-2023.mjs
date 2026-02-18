
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/questions/A1/2023.ts');

if (!fs.existsSync(filePath)) {
  console.error('Target file not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Remove the closing array bracket
content = content.replace(/\n\];\s*$/, '');

let newQuestions = [];
const START_NUM = 21;
const END_NUM = 50;
const YEAR = 2023;
const QUAL_NAME = '第二種電気工事士';

for (let i = START_NUM; i <= END_NUM; i++) {
  const qNum = i;
  const qId = `A1-${YEAR}-Q${String(qNum).padStart(2, '0')}`;

  // Category logic for A1
  let category = '一般問題';
  let type = 'general';
  let tags = [];

  if (qNum <= 10) { category = '理論'; tags = ['計算', '基礎']; }
  else if (qNum <= 20) { category = '配線設計・機器'; tags = ['鑑別', '器具']; }
  else if (qNum <= 30) { category = '法令・検査'; tags = ['法規', '測定']; }
  else if (qNum <= 50) {
    category = '配線図';
    type = 'diagram';
    tags = ['図面読解', '複線図'];
  }

  const question = `  {
    id: '${qId}',
    qualificationId: 'A1',
    qualificationName: '${QUAL_NAME}',
    subjectId: 'written',
    subjectName: '筆記試験',
    year: ${YEAR},
    session: '上期',
    questionNumber: ${qNum},
    questionText: '${YEAR}年度 ${QUAL_NAME} 問${qNum}\\n${category}に関する問題です。（ダミーデータ）\\n${qNum >= 31 ? '配線図の読み取り問題です。' : '知識を問う問題です。'}',
    questionImages: [],
    choices: [
      { label: 'イ', text: '選択肢イ' },
      { label: 'ロ', text: '選択肢ロ' },
      { label: 'ハ', text: '選択肢ハ' },
      { label: 'ニ', text: '選択肢ニ' },
    ],
    correctAnswer: '${['イ', 'ロ', 'ハ', 'ニ'][Math.floor(Math.random() * 4)]}',
    explanation: {
      summary: 'この問題の正解は「' + ['イ', 'ロ', 'ハ', 'ニ'][Math.floor(Math.random() * 4)] + '」です。',
      detailedText: '詳細な解説がここに入ります。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: ${Math.floor(Math.random() * 3) + 1},
    category: '${category}',
    tags: ${JSON.stringify(tags)},
    source: 'サンプル問題集',
    createdAt: '2024-02-16',
    updatedAt: '2024-02-16',
  },`;
  newQuestions.push(question);
}

// Append new questions and close the array
const newContent = content.trim() + ',\n' + newQuestions.join('\n') + '\n];\n';

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Appended questions 6-50 to A1/2023.ts');
