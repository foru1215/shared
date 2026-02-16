import type { Question } from '@/types/question';

export const F5_2024: Question[] = [
    {
        id: 'F5-2024-GEN-Q01', qualificationId: 'F5', qualificationName: 'エネルギー管理士',
        subjectId: 'general', subjectName: 'エネルギー総合管理及び法規', year: 2024, session: '上期', questionNumber: 1,
        questionText: 'エネルギーの使用の合理化等に関する法律（省エネ法）において、第一種エネルギー管理指定工場等の指定基準として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '年間エネルギー使用量が原油換算で1,500kL以上' },
            { label: '(2)', text: '年間エネルギー使用量が原油換算で3,000kL以上' },
            { label: '(3)', text: '年間電力使用量が1,000万kWh以上' },
            { label: '(4)', text: '年間エネルギー使用量が原油換算で500kL以上' },
        ], correctAnswer: '(2)',
        explanation: {
            summary: '第一種指定は原油換算3,000kL/年以上',
            detailedText: '省エネ法のエネルギー管理指定工場等：\n| 区分 | 基準 | 義務 |\n|---|---|---|\n| 第一種 | 3,000kL/年以上 | エネルギー管理士の選任 |\n| 第二種 | 1,500kL以上3,000kL未満 | エネルギー管理員の選任 |',
            images: [], keyPoints: ['第一種=3,000kL以上', '第二種=1,500kL以上', '原油換算で判定'], relatedQuestions: [],
            references: [{ title: '省エネルギーセンター', url: 'https://www.eccj.or.jp/' }],
        }, difficulty: 3, category: '法規', tags: ['省エネ法', '指定工場'], source: 'https://www.eccj.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'F5-2024-BASIC-Q01', qualificationId: 'F5', qualificationName: 'エネルギー管理士',
        subjectId: 'electric-basic', subjectName: '電気の基礎', year: 2024, session: '上期', questionNumber: 2,
        questionText: '三相誘導電動機の始動方式に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'スターデルタ始動では、始動電流は全電圧始動の1/3になる' },
            { label: '(2)', text: 'スターデルタ始動では、始動電流は全電圧始動の1/2になる' },
            { label: '(3)', text: 'インバータ始動は周波数を変えずに電圧のみ変化させる' },
            { label: '(4)', text: 'リアクトル始動は始動電流を増加させる方法である' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'スターデルタ始動では始動電流が全電圧始動の1/3に低減',
            detailedText: 'スターデルタ始動：\n- スター結線で始動 → デルタ結線に切替\n- 始動時の線間電圧が1/√3に低下\n- 始動電流 = 全電圧始動の **1/3**\n- 始動トルクも1/3に低下',
            images: [], formula: 'I_{始動(Y)} = \\frac{1}{3} I_{始動(\\Delta)}', keyPoints: ['始動電流1/3', '始動トルクも1/3', '電圧が1/√3→電流は(1/√3)²=1/3'], relatedQuestions: [],
            references: [{ title: '省エネルギーセンター', url: 'https://www.eccj.or.jp/' }],
        }, difficulty: 3, category: '電気機器', tags: ['誘導電動機', 'スターデルタ始動'], source: 'https://www.eccj.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'F5-2024-FAC-Q01', qualificationId: 'F5', qualificationName: 'エネルギー管理士',
        subjectId: 'electric-facility', subjectName: '電気設備及びその管理', year: 2024, session: '上期', questionNumber: 3,
        questionText: '力率改善に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '進相コンデンサを設置すると力率が改善（向上）する' },
            { label: '(2)', text: 'リアクトルを追加すると力率が改善する' },
            { label: '(3)', text: '力率改善により有効電力が増加する' },
            { label: '(4)', text: '力率は常に1以上である' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: '遅れ力率の負荷に進相コンデンサを並列接続して力率を改善（1に近づける）',
            detailedText: '力率改善の効果：\n- 電流の減少 → 電力損失の低減\n- 電圧降下の改善\n- 設備容量の有効利用\n- 電気料金の割引（基本料金の力率割引制度）\n\n$$Q_C = P(\\tan\\varphi_1 - \\tan\\varphi_2)$$',
            images: [], formula: 'Q_C = P(\\tan\\varphi_1 - \\tan\\varphi_2)', keyPoints: ['進相コンデンサで遅れ力率を改善', '電流減少・損失低減', '電気料金の力率割引'], relatedQuestions: [],
            references: [{ title: '省エネルギーセンター', url: 'https://www.eccj.or.jp/' }],
        }, difficulty: 3, category: '電気設備', tags: ['力率改善', '進相コンデンサ'], source: 'https://www.eccj.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
