const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = path.join(__dirname, '../src/data/questions');

const configs = [
    {
        id: 'A2', name: '第一種電気工事士', year: 2024, session: '下期',
        count: 50, subjectId: 'written', subjectName: '筆記試験',
        qUrl: 'https://www.shiken.or.jp/construction/upload/20241006_co_first_q01.pdf',
        aUrl: 'https://www.shiken.or.jp/construction/upload/20241006_co_first_a01.pdf',
        categoryMap: (i) => i <= 10 ? '計算問題' : i <= 30 ? '一般問題' : '配線図'
    },
    {
        id: 'B1', name: '2級電気工事施工管理技士', year: 2024, session: '第一次検定',
        count: 64, subjectId: 'first', subjectName: '第一次検定',
        qUrl: 'https://www.fcip-shiken.jp/',
        aUrl: 'https://www.fcip-shiken.jp/',
        categoryMap: (i) => i <= 20 ? '電気工学' : i <= 50 ? '施工管理' : '法規'
    },
    {
        id: 'B2', name: '1級電気工事施工管理技士', year: 2024, session: '第一次検定',
        count: 92, subjectId: 'first', subjectName: '第一次検定',
        qUrl: 'https://www.tac-school.co.jp/file/tac/kouza_denkikoujisekokan/2024pdf/R6_1-1.pdf',
        aUrl: 'https://www.tac-school.co.jp/kouza_denkikoujisekokan/denkikoujisekoukanri1_guide_kakomon.html',
        categoryMap: (i) => i <= 15 ? '電気工学' : i <= 60 ? '施工管理' : '法規'
    }
];

const c1Config = {
    id: 'C1', name: '第三種電気主任技術者', year: 2024, session: '下期',
    subjects: [
        { id: 'theory', name: '理論', count: 20, qUrl: 'https://www.shiken.or.jp/chief/upload/20240324_ch_third_q01.pdf' },
        { id: 'power', name: '電力', count: 20, qUrl: 'https://www.shiken.or.jp/chief/upload/20240324_ch_third_q02.pdf' },
        { id: 'machine', name: '機械', count: 20, qUrl: 'https://www.shiken.or.jp/chief/upload/20240324_ch_third_q03.pdf' },
        { id: 'law', name: '法規', count: 20, qUrl: 'https://www.shiken.or.jp/chief/upload/20240324_ch_third_q04.pdf' }
    ],
    aUrl: 'https://www.shiken.or.jp/chief/upload/20240324_ch_third_a01.pdf'
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Generate A2, B1, B2
for (const conf of configs) {
    let content = `import type { Question } from '@/types/question';

export const ${conf.id}_${conf.year}: Question[] = [
`;

    for (let i = 1; i <= conf.count; i++) {
        const qNum = String(i).padStart(3, '0');
        const category = conf.categoryMap(i);

        content += `  {
    id: '${conf.id}-${conf.year}-Q${qNum}',
    qualificationId: '${conf.id}',
    qualificationName: '${conf.name}',
    subjectId: '${conf.subjectId}',
    subjectName: '${conf.subjectName}',
    year: ${conf.year},
    session: '${conf.session}',
    questionNumber: ${i},
    questionText: '${conf.year}年(${conf.session}) 問${i}\\n\\n本問のテキスト・画像データは準備中です。\\n以下の公式資料等をご参照ください。\\n\\n[試験問題を開く](${conf.qUrl})',
    questionImages: [],
    choices: [
      { label: '1', text: '選択肢1' }, // Using 1-4 for construction/chief usually, but keeping consistency maybe? A1/A2 use イロハニ. B1/B2/C1 use 123445.
      // Let's use generic logic based on Qual type if possible, or just default.
      // A1, A2 -> イロハニ. B1, B2, C1 -> 1,2,3,4(5).
      // Here we assume simple text placeholder.
      { label: '2', text: '選択肢2' },
      { label: '3', text: '選択肢3' },
      { label: '4', text: '選択肢4' },
    ],
    correctAnswer: '1', 
    explanation: {
      summary: '正答データは準備中です。',
      detailedText: '正しい正解は以下の公式解答等をご参照ください。\\n\\n[解答を開く](${conf.aUrl})',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 3,
    category: '${category}',
    tags: ['PDF参照'],
    source: '公式サイト/TAC',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
`;
    }
    content += `];\n`;

    const targetDir = path.join(QUESTIONS_DIR, conf.id);
    ensureDir(targetDir);
    fs.writeFileSync(path.join(targetDir, `${conf.year}.ts`), content);
    console.log(`Created ${conf.id}/${conf.year}.ts`);
}

// Generate C1
let c1Content = `import type { Question } from '@/types/question';

export const C1_${c1Config.year}: Question[] = [
`;

let c1GlobalCount = 1;
for (const sub of c1Config.subjects) {
    for (let i = 1; i <= sub.count; i++) {
        const qNum = String(c1GlobalCount).padStart(3, '0');

        c1Content += `  {
    id: 'C1-${c1Config.year}-Q${qNum}',
    qualificationId: 'C1',
    qualificationName: '第三種電気主任技術者',
    subjectId: '${sub.id}',
    subjectName: '${sub.name}',
    year: ${c1Config.year},
    session: '${c1Config.session}',
    questionNumber: ${i}, // Per subject number
    questionText: '${c1Config.year}年(${c1Config.session}) ${sub.name} 問${i}\\n\\n本問のテキスト・画像データは準備中です。\\n以下の公式PDFをご参照ください。\\n\\n[試験問題PDFを開く](${sub.qUrl})',
    questionImages: [],
    choices: [
      { label: '1', text: '選択肢1' },
      { label: '2', text: '選択肢2' },
      { label: '3', text: '選択肢3' },
      { label: '4', text: '選択肢4' },
      { label: '5', text: '選択肢5' },
    ],
    correctAnswer: '1', 
    explanation: {
      summary: '正答データは準備中です。',
      detailedText: '正しい正解は以下の公式解答PDFをご参照ください。\\n\\n[解答PDFを開く](${c1Config.aUrl})',
      images: [],
      keyPoints: [],
      relatedQuestions: [],
      references: [],
    },
    difficulty: 3,
    category: '${sub.name}',
    tags: ['PDF参照'],
    source: '公式サイト',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
`;
        c1GlobalCount++;
    }
}
c1Content += `];\n`;
const c1Dir = path.join(QUESTIONS_DIR, 'C1');
ensureDir(c1Dir);
fs.writeFileSync(path.join(c1Dir, `${c1Config.year}.ts`), c1Content);
console.log(`Created C1/${c1Config.year}.ts`);
