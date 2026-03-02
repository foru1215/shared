import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUALIFICATIONS = [
  {
    id: 'A1', name: '第二種電気工事士',
    configs: [{ subject: 'written', name: '筆記試験', count: 50 }]
  },
  {
    id: 'A2', name: '第一種電気工事士',
    configs: [{ subject: 'written', name: '筆記試験', count: 50 }]
  },
  {
    id: 'B1', name: '2級電気工事施工管理技士',
    configs: [{ subject: 'first', name: '第一次検定', count: 64 }]
  },
  {
    id: 'B2', name: '1級電気工事施工管理技士',
    configs: [{ subject: 'first', name: '第一次検定', count: 92 }]
  },
  {
    id: 'C1', name: '第三種電気主任技術者',
    configs: [
      { subject: 'theory', name: '理論', count: 20 },
      { subject: 'power', name: '電力', count: 20 },
      { subject: 'machine', name: '機械', count: 20 },
      { subject: 'law', name: '法規', count: 20 }
    ]
  },
];

const YEARS = [2024, 2023];

const QUESTIONS_DIR = path.join(__dirname, '../src/data/questions');

// Ensure directory exists
if (!fs.existsSync(QUESTIONS_DIR)) {
  fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
}

function generateQuestionContent(qual, year) {
  let questions = [];
  const categoriesMap = {
    'A1': ['一般問題', '配線図', '鑑別'],
    'A2': ['理論', '電力', '機械', '法規', '一般問題', '配線図'],
    'B1': ['電気工学', '施工管理', '法規'],
    'B2': ['電気工学', '施工管理', '法規'],
    'C1': ['理論', '電力', '機械', '法規']
  };

  let globalQNum = 1;

  for (const config of qual.configs) {
    for (let i = 1; i <= config.count; i++) {
      const qIdNum = String(globalQNum).padStart(3, '0');
      // Simple category assignment
      const cats = categoriesMap[qual.id] || ['一般'];
      const category = cats[Math.floor(Math.random() * cats.length)];

      // For C1, category should match subject
      let actualCategory = category;
      if (qual.id === 'C1') {
        actualCategory = config.name;
      }

      // For B1, B2, adjust categories based on question number ranges (approx)
      if (qual.id.startsWith('B')) {
        if (i <= 20) actualCategory = '電気工学';
        else if (i <= 40) actualCategory = '施工管理';
        else actualCategory = '法規';
      }

      questions.push(`  {
    id: '${qual.id}-${year}-Q${qIdNum}',
    qualificationId: '${qual.id}',
    qualificationName: '${qual.name}',
    subjectId: '${config.subject}',
    subjectName: '${config.name}',
    year: ${year},
    session: '上期',
    questionNumber: ${globalQNum},
    questionText: '${year}年度 ${qual.name} (${config.name}) 問${i}\\n（再現データ・構成調整済み）\\n科目: ${config.name}\\n分野: ${actualCategory}',
    questionImages: [],
    choices: [
      { label: 'イ', text: '選択肢イ' },
      { label: 'ロ', text: '選択肢ロ' },
      { label: 'ハ', text: '選択肢ハ' },
      { label: 'ニ', text: '選択肢ニ' },
    ],
    correctAnswer: '${['イ', 'ロ', 'ハ', 'ニ'][Math.floor(Math.random() * 4)]}',
    explanation: {
      summary: '正解は「' + ['イ', 'ロ', 'ハ', 'ニ'][Math.floor(Math.random() * 4)] + '」です。',
      detailedText: '詳細な解説がここに入ります（準備中）。',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: ${Math.floor(Math.random() * 3) + 1},
    category: '${actualCategory}',
    tags: ['構成調整済'],
    source: '再現データ',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },`);
      globalQNum++;
    }
  }

  const code = `import type { Question } from '@/types/question';

export const ${qual.id}_${year}: Question[] = [
${questions.join('\n')}
];
`;
  return code;
}

// Cleanup Old Files
console.log('Cleaning up old files...');
for (const qual of QUALIFICATIONS) {
  const qualDir = path.join(QUESTIONS_DIR, qual.id);
  if (fs.existsSync(qualDir)) {
    const files = fs.readdirSync(qualDir);
    for (const file of files) {
      if (!file.endsWith('.ts')) continue;
      const yearMatch = file.match(/^(\d{4})\.ts$/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1], 10);
        if (!YEARS.includes(year)) {
          fs.unlinkSync(path.join(qualDir, file));
          console.log(`Deleted: ${qual.id}/${file}`);
        }
      }
    }
  }
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

    // Skip A1/2023 because it has manually corrected data
    if (qual.id === 'A1' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping A1/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // Skip A2/2023 because it has manually corrected data (Partially recreated)
    if (qual.id === 'A2' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping A2/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // Skip B1/2023
    if (qual.id === 'B1' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping B1/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // Skip B2/2023
    if (qual.id === 'B2' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping B2/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }

    // Skip C1/2023
    if (qual.id === 'C1' && year === 2023 && fs.existsSync(filePath)) {
      console.log(`Skipping C1/2023 file to preserve manual edits: ${qual.id}/${year}.ts`);
      skippedFiles++;
      continue;
    }


    // For other years, overwrite
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
