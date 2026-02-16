import type { Question } from '@/types/question';

export const B1_2024: Question[] = [
    {
        id: 'B1-2024-1ST-Q01', qualificationId: 'B1', qualificationName: '2級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 1,
        questionText: '電気工事の施工計画に関する記述として、最も不適当なものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '施工計画書には、工程表、施工要領書、品質管理計画書等を含める' },
            { label: '2', text: '施工計画は、設計図書の内容を十分に把握した上で作成する' },
            { label: '3', text: '施工計画は、工事の途中で変更してはならない' },
            { label: '4', text: '施工計画には、安全管理計画を含めることが重要である' },
        ], correctAnswer: '3',
        explanation: {
            summary: '施工計画は状況に応じて適切に変更（見直し）することが必要',
            detailedText: '施工計画は一度策定したら変更不可ではなく、現場の状況変化や設計変更に応じて適切に見直しを行う必要があります。',
            images: [], keyPoints: ['施工計画は必要に応じて変更可能', '設計変更・現場条件変更時に見直す'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 2, category: '施工管理', tags: ['施工計画'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B1-2024-1ST-Q02', qualificationId: 'B1', qualificationName: '2級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 2,
        questionText: '品質管理において、管理図に関する記述として適当なものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '管理図は、工程が安定状態にあるか判断するために用いる' },
            { label: '2', text: '管理図は、不良品の数を表すグラフである' },
            { label: '3', text: '管理図は、工事の進捗を管理するためのものである' },
            { label: '4', text: '管理図は、材料の発注量を管理するものである' },
        ], correctAnswer: '1',
        explanation: {
            summary: '管理図は工程が統計的管理状態にあるかを判断するツール',
            detailedText: '管理図（Control Chart）は、UCL（上方管理限界線）とLCL（下方管理限界線）を設定し、データが管理限界内に収まっているかで工程の安定性を判断します。',
            images: [], keyPoints: ['UCL/LCLで工程の安定性を確認', 'シューハートが考案'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 2, category: '品質管理', tags: ['管理図', 'QC7つ道具'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B1-2024-1ST-Q03', qualificationId: 'B1', qualificationName: '2級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 3,
        questionText: '工程管理で用いるネットワーク工程表に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'クリティカルパスとは、最も短い経路のことである' },
            { label: '2', text: 'クリティカルパスは、必ず1本のみ存在する' },
            { label: '3', text: 'クリティカルパス上の作業が遅れると全体工期が遅れる' },
            { label: '4', text: 'フロートはすべての作業に存在する' },
        ], correctAnswer: '3',
        explanation: {
            summary: 'クリティカルパスは最長経路であり、その作業の遅延は全体工期に直結する',
            detailedText: 'ネットワーク工程表のクリティカルパスは所要日数が最長の経路で、フロート（余裕時間）が0の作業で構成されます。複数存在することもあります。',
            images: [], keyPoints: ['クリティカルパス＝最長経路', 'フロート0の作業で構成', '複数存在する場合もある'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 2, category: '工程管理', tags: ['ネットワーク工程表', 'クリティカルパス'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B1-2024-1ST-Q04', qualificationId: 'B1', qualificationName: '2級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 4,
        questionText: '労働安全衛生法において、事業者が行わなければならない安全衛生教育として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '雇入れ時の安全衛生教育は努力義務である' },
            { label: '2', text: '雇入れ時の安全衛生教育は義務である' },
            { label: '3', text: '安全衛生教育は正社員のみが対象である' },
            { label: '4', text: '安全衛生教育は管理者のみが受ければよい' },
        ], correctAnswer: '2',
        explanation: {
            summary: '雇入れ時の安全衛生教育は法律で義務付けられている',
            detailedText: '労働安全衛生法第59条により、事業者は労働者を雇い入れた時に安全衛生教育を行う義務があります。パートやアルバイトも含む全ての労働者が対象です。',
            images: [], keyPoints: ['雇入れ時教育は法的義務', '全労働者が対象', '労働安全衛生法第59条'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 2, category: '安全管理', tags: ['安全衛生教育', '労働安全衛生法'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B1-2024-1ST-Q05', qualificationId: 'B1', qualificationName: '2級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 5,
        questionText: '変圧器の結線方式で、Y-Δ結線（スター・デルタ結線）の特徴として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '一次側線間電圧と二次側線間電圧は同位相である' },
            { label: '2', text: '一次側と二次側の線間電圧に30°の位相差が生じる' },
            { label: '3', text: 'Y結線側は中性点接地ができない' },
            { label: '4', text: 'Δ結線側に第三高調波が流れない' },
        ], correctAnswer: '2',
        explanation: {
            summary: 'Y-Δ結線では一次側と二次側で30°の位相差が生じる',
            detailedText: 'Y-Δ結線の特徴：\n- 一次側と二次側の線間電圧に30°の位相差\n- Y結線側で中性点接地が可能\n- Δ結線側で第三高調波を環流させ波形改善',
            images: [], keyPoints: ['30°位相差', 'Y結線側は中性点接地可能', 'Δ結線で第三高調波環流'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '電気理論', tags: ['変圧器', '結線方式', 'Y-Δ結線'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
