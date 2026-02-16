import type { Question } from '@/types/question';

export const D1_2024: Question[] = [
    {
        id: 'D1-2024-BASIC-Q01', qualificationId: 'D1', qualificationName: 'アナログ通信',
        subjectId: 'basic', subjectName: '電気通信技術の基礎', year: 2024, session: '上期', questionNumber: 1,
        questionText: 'アナログ信号をデジタル信号に変換する過程（PCM）の順序として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '標本化 → 量子化 → 符号化' },
            { label: '2', text: '量子化 → 標本化 → 符号化' },
            { label: '3', text: '符号化 → 標本化 → 量子化' },
            { label: '4', text: '標本化 → 符号化 → 量子化' },
        ], correctAnswer: '1',
        explanation: {
            summary: 'PCM: 標本化(サンプリング) → 量子化 → 符号化',
            detailedText: 'PCM（パルス符号変調）の3ステップ：\n1. **標本化**：連続信号を一定間隔でサンプリング（ナイキストの定理：信号最高周波数の2倍以上）\n2. **量子化**：サンプル値を離散値に丸める\n3. **符号化**：離散値をビット列（2進数）に変換',
            images: [], keyPoints: ['PCMの順序は「標量符」', 'ナイキスト周波数＝最高周波数の2倍', '量子化誤差（量子化雑音）が発生'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 2, category: '通信技術', tags: ['PCM', '標本化', 'A/D変換'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D1-2024-BASIC-Q02', qualificationId: 'D1', qualificationName: 'アナログ通信',
        subjectId: 'basic', subjectName: '電気通信技術の基礎', year: 2024, session: '上期', questionNumber: 2,
        questionText: '電話回線における2線-4線変換に用いられる回路はどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'ハイブリッド回路' },
            { label: '2', text: 'ブリッジ回路' },
            { label: '3', text: 'コルピッツ回路' },
            { label: '4', text: 'フリップフロップ回路' },
        ], correctAnswer: '1',
        explanation: {
            summary: 'ハイブリッド回路（ハイブリッドトランス）が2線-4線変換に使用される',
            detailedText: 'ハイブリッド回路は、2線式（送受信兼用）と4線式（送受信分離）の変換を行います。平衡ネットワークとの整合が重要で、不整合があるとエコーが発生します。',
            images: [], keyPoints: ['ハイブリッド回路で2W-4W変換', '不整合でエコー発生', '電話交換機で使用'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '通信技術', tags: ['ハイブリッド回路', '2線-4線変換'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D1-2024-LAW-Q01', qualificationId: 'D1', qualificationName: 'アナログ通信',
        subjectId: 'law', subjectName: '法規', year: 2024, session: '上期', questionNumber: 3,
        questionText: '電気通信事業法において、工事担任者の資格が必要な工事として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '端末設備を電気通信回線に接続する工事' },
            { label: '2', text: '電気通信事業者の設備内部の工事' },
            { label: '3', text: 'LANケーブルの敷設工事のみ' },
            { label: '4', text: '電話機の設定変更' },
        ], correctAnswer: '1',
        explanation: {
            summary: '工事担任者は端末設備を電気通信回線に接続する工事に必要',
            detailedText: '電気通信事業法第71条により、端末設備を電気通信回線設備に接続する工事は、工事担任者資格者証の交付を受けた者が行うか監督する必要があります。',
            images: [], keyPoints: ['端末設備の回線接続工事が対象', '電気通信事業法第71条', '設定変更のみは不要'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 2, category: '法規', tags: ['電気通信事業法', '工事担任者'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
