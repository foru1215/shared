import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUALIFICATIONS = [
  { id: 'A1', name: '第二種電気工事士', subject: 'written', subjectName: '筆記試験' },
  { id: 'A2', name: '第一種電気工事士', subject: 'written', subjectName: '筆記試験' },
  { id: 'B1', name: '2級電気工事施工管理技士', subject: 'first', subjectName: '第一次検定' },
  { id: 'B2', name: '1級電気工事施工管理技士', subject: 'first', subjectName: '第一次検定' },
  { id: 'C1', name: '第三種電気主任技術者', subject: 'theory', subjectName: '理論' },
  { id: 'C2', name: '第二種電気主任技術者', subject: 'theory', subjectName: '理論' },
  { id: 'C3', name: '第一種電気主任技術者', subject: 'theory', subjectName: '理論' },
  { id: 'D1', name: 'アナログ通信', subject: 'basic', subjectName: '基礎' },
  { id: 'D2', name: 'デジタル通信', subject: 'basic', subjectName: '基礎' },
  { id: 'D3', name: '総合通信', subject: 'basic', subjectName: '基礎' },
  { id: 'E1', name: '伝送交換主任技術者', subject: 'system', subjectName: '電気通信システム' },
  { id: 'E2', name: '線路主任技術者', subject: 'system', subjectName: '電気通信システム' },
  { id: 'F3', name: '消防設備士', subject: 'law', subjectName: '法令' },
  { id: 'F5', name: 'エネルギー管理士', subject: 'general', subjectName: '必須基礎' },
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 - i); // 2024 to 2015

const QUESTIONS_DIR = path.join(__dirname, '../src/data/questions');

// Ensure directory exists
if (!fs.existsSync(QUESTIONS_DIR)) {
  fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
}

function generateQuestionContent(qual, year) {
  const code = `import type { Question } from '@/types/question';

export const ${qual.id}_${year}: Question[] = [
  {
    id: '${qual.id}-${year}-Q01',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${qual.subject}',
    subjectName: '${qual.subjectName}',
    year: ${year},
    session: '上期',
    questionNumber: 1,
    questionText: '${year}年度 ${qual.name} (${qual.subjectName}) 問1\\nこれは過去問題のサンプルテキストです。実際の問題文はここに表示されます。',
    questionImages: [],
    choices: [
      { label: 'イ', text: '50 [A]' },
      { label: 'ロ', text: '75 [A]' },
      { label: 'ハ', text: '100 [A]' },
      { label: 'ニ', text: '125 [A]' },
    ],
    correctAnswer: 'ロ',
    explanation: {
      summary: 'この問題の正解は「ロ」です。',
      detailedText: '詳細な解説がここに入ります。\\n\\n計算式などのMarkdownも使用可能です。\\n$V = IR$',
      images: [],
      keyPoints: ['オームの法則', 'キルヒホッフの法則'],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 3,
    category: '一般問題',
    tags: ['サンプル'],
    source: 'サンプル問題集',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '${qual.id}-${year}-Q02',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${qual.subject}',
    subjectName: '${qual.subjectName}',
    year: ${year},
    session: '上期',
    questionNumber: 2,
    questionText: '${year}年度 ${qual.name} 問2\\n次の記述のうち、正しいものはどれか。',
    questionImages: [],
    choices: [
      { label: 'イ', text: '選択肢1' },
      { label: 'ロ', text: '選択肢2' },
      { label: 'ハ', text: '選択肢3' },
      { label: 'ニ', text: '選択肢4' },
    ],
    correctAnswer: 'イ',
    explanation: {
      summary: '正解は「イ」です。',
      detailedText: '解説文です。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 2,
    category: '法令',
    tags: [],
    source: 'サンプル問題集',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '${qual.id}-${year}-Q03',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${qual.subject}',
    subjectName: '${qual.subjectName}',
    year: ${year},
    session: '上期',
    questionNumber: 3,
    questionText: '${year}年度 ${qual.name} 問3\\n計算問題のサンプルです。',
    questionImages: [],
    choices: [
      { label: 'イ', text: '100 [V]' },
      { label: 'ロ', text: '200 [V]' },
      { label: 'ハ', text: '300 [V]' },
      { label: 'ニ', text: '400 [V]' },
    ],
    correctAnswer: 'ハ',
    explanation: {
      summary: '正解は「ハ」です。',
      detailedText: '解説文です。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 4,
    category: '計算',
    tags: [],
    source: 'サンプル問題集',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '${qual.id}-${year}-Q04',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${qual.subject}',
    subjectName: '${qual.subjectName}',
    year: ${year},
    session: '上期',
    questionNumber: 4,
    questionText: '${year}年度 ${qual.name} 問4\\n図記号に関する問題です。',
    questionImages: [],
    choices: [
      { label: 'イ', text: 'コンセント' },
      { label: 'ロ', text: 'スイッチ' },
      { label: 'ハ', text: 'パイロットランプ' },
      { label: 'ニ', text: '接地端子' },
    ],
    correctAnswer: 'ニ',
    explanation: {
      summary: '正解は「ニ」です。',
      detailedText: '解説文です。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 1,
    category: '鑑別',
    tags: [],
    source: 'サンプル問題集',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '${qual.id}-${year}-Q05',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${qual.subject}',
    subjectName: '${qual.subjectName}',
    year: ${year},
    session: '上期',
    questionNumber: 5,
    questionText: '${year}年度 ${qual.name} 問5\\n配線設計に関する問題です。',
    questionImages: [],
    choices: [
      { label: 'イ', text: '1.6mm' },
      { label: 'ロ', text: '2.0mm' },
      { label: 'ハ', text: '2.6mm' },
      { label: 'ニ', text: '3.2mm' },
    ],
    correctAnswer: 'ロ',
    explanation: {
      summary: '正解は「ロ」です。',
      detailedText: '解説文です。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 2,
    category: '配線設計',
    tags: [],
    source: 'サンプル問題集',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];
`;
  return code;
}

// Generate Question Files
console.log('Generating question files...');
let totalFiles = 0;
let skippedFiles = 0;

for (const qual of QUALIFICATIONS) {
  const qualDir = path.join(QUESTIONS_DIR, qual.id);
  if (!fs.existsSync(qualDir)) {
    fs.mkdirSync(qualDir, { recursive: true });
  }

  for (const year of YEARS) {
    const filePath = path.join(qualDir, `${year}.ts`);
    // Skip 2024 files (assume they are manually created/verified)
    if (year === 2024 && fs.existsSync(filePath)) {
      console.log(`Skipping 2024 file: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // Skip A1/2023 because it has manually corrected data (5 real questions)
    // We will handle it separately or keep it as is for now
    if (qual.id === 'A1' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping A1/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // For other years, overwrite (to fix issues like missing source field)
    const content = generateQuestionContent(qual, year);
    fs.writeFileSync(filePath, content, 'utf8');
    if (fs.existsSync(filePath)) {
      console.log(`Overwritten/Created: ${qual.id}/${year}.ts`);
    } else {
      console.log(`Created: ${qual.id}/${year}.ts`);
    }
    totalFiles++;
  }
}

// Generate Index File
console.log('Generating index.ts...');
const indexFilePath = path.join(QUESTIONS_DIR, 'index.ts');
let indexContent = `// Central question data registry
// Auto-generated by scripts/generate-data.js
import type { Question } from '@/types/question';

`;

// Imports
for (const qual of QUALIFICATIONS) {
  for (const year of YEARS) {
    indexContent += `import { ${qual.id}_${year} } from '@/data/questions/${qual.id}/${year}';\n`;
  }
}

// All Questions Mapping
indexContent += `\n// All questions grouped by qualification ID
export const allQuestions: Record<string, Question[]> = {\n`;

for (const qual of QUALIFICATIONS) {
  indexContent += `  ${qual.id}: [\n`;
  for (const year of YEARS) {
    indexContent += `    ...${qual.id}_${year},\n`;
  }
  indexContent += `  ],\n`;
}
indexContent += `};\n`;

// Helper functions (same as before)
indexContent += `
// Question count by qualification and year (for display)
export const questionCounts: Record<string, Record<string, number>> = {};
for (const [qualId, questions] of Object.entries(allQuestions)) {
  questionCounts[qualId] = {};
  for (const q of questions) {
    const year = String(q.year);
    questionCounts[qualId][year] = (questionCounts[qualId][year] || 0) + 1;
  }
}

// Helper to get questions for a specific qualification
export function getQuestions(qualificationId: string): Question[] {
  return allQuestions[qualificationId] || [];
}

// Helper to get question counts for a qualification
export function getQuestionCounts(qualificationId: string): Record<string, number> {
  return questionCounts[qualificationId] || {};
}
`;

fs.writeFileSync(indexFilePath, indexContent, 'utf8');
console.log(`Updated: index.ts`);
console.log(`\nDone! Created ${totalFiles} files, skipped ${skippedFiles} files.`);
