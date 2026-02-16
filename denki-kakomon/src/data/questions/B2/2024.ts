import type { Question } from '@/types/question';

export const B2_2024: Question[] = [
    {
        id: 'B2-2024-1ST-Q01', qualificationId: 'B2', qualificationName: '1級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 1,
        questionText: '電気工事における工程管理に関する記述として、最も適当なものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'バーチャート工程表は、各作業の相互関係を明確に把握できる' },
            { label: '2', text: 'ネットワーク工程表は、各作業の相互関係を明確に把握できる' },
            { label: '3', text: 'グラフ式工程表は、各作業間のフロートを容易に算出できる' },
            { label: '4', text: 'マイルストーン工程表は、作業の手順が詳細にわかる' },
        ], correctAnswer: '2',
        explanation: {
            summary: 'ネットワーク工程表は作業間の相互関係やクリティカルパスが明確にわかる',
            detailedText: '各工程表の特徴：\n- **バーチャート**：作業の開始・終了時期が分かりやすいが相互関係は不明確\n- **ネットワーク**：作業間の相互関係、クリティカルパス、フロートが明確\n- **グラフ式**：進捗率の把握に適する\n- **マイルストーン**：重要管理点のみを示す',
            images: [], keyPoints: ['ネットワーク＝相互関係明確', 'バーチャート＝時期把握', 'グラフ式＝進捗率'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '工程管理', tags: ['工程表', 'ネットワーク'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B2-2024-1ST-Q02', qualificationId: 'B2', qualificationName: '1級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 2,
        questionText: '建設業法に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '監理技術者は、2級施工管理技士の資格があれば選任できる' },
            { label: '2', text: '特定建設業の許可を受けた者は、監理技術者を置かなければならない' },
            { label: '3', text: '監理技術者は、主任技術者を兼ねることはできない' },
            { label: '4', text: '一般建設業では、下請金額に関わらず主任技術者で足りる' },
        ], correctAnswer: '2',
        explanation: {
            summary: '特定建設業の許可業者は、元請として一定額以上を下請発注する場合、監理技術者を配置する',
            detailedText: '建設業法第26条により、特定建設業者が元請として4,500万円（建築一式は7,000万円）以上を下請発注する場合は監理技術者が必要。監理技術者の資格は1級施工管理技士等。',
            images: [], keyPoints: ['特定建設業＝監理技術者が必要', '1級資格が必要', '建設業法第26条'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '法規', tags: ['建設業法', '監理技術者'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B2-2024-1ST-Q03', qualificationId: 'B2', qualificationName: '1級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 3,
        questionText: '高圧受電設備に関する記述として、不適当なものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '断路器（DS）は、負荷電流を遮断できる' },
            { label: '2', text: '遮断器（CB）は、短絡電流を遮断できる' },
            { label: '3', text: '計器用変圧器（VT）は、高電圧を低電圧に変成する' },
            { label: '4', text: '計器用変流器（CT）は、大電流を小電流に変成する' },
        ], correctAnswer: '1',
        explanation: {
            summary: '断路器（DS）は無負荷状態でのみ開閉可能で、負荷電流は遮断できない',
            detailedText: '断路器（DS: Disconnect Switch）は保守点検時に回路を目視で確認できる開路状態にする機器。消弧能力がないため負荷電流や短絡電流は遮断できません。',
            images: [], keyPoints: ['DSは無負荷開閉のみ', 'CBは短絡電流を遮断可能', 'DSに消弧能力なし'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '電気設備', tags: ['高圧受電設備', '断路器', '遮断器'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B2-2024-1ST-Q04', qualificationId: 'B2', qualificationName: '1級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 4,
        questionText: '電気設備の接地工事に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'A種接地工事の接地抵抗値は10Ω以下である' },
            { label: '2', text: 'B種接地工事は低圧電路に施す' },
            { label: '3', text: 'C種接地工事の接地抵抗値は100Ω以下である' },
            { label: '4', text: 'D種接地工事の接地抵抗値は10Ω以下である' },
        ], correctAnswer: '1',
        explanation: {
            summary: 'A種接地工事の接地抵抗値は10Ω以下',
            detailedText: '接地工事の種類と接地抵抗値：\n| 種類 | 接地抵抗 | 用途 |\n|---|---|---|\n| A種 | 10Ω以下 | 高圧・特別高圧の機器 |\n| B種 | 計算値 | 変圧器の中性点 |\n| C種 | 10Ω以下 | 300V超の低圧機器 |\n| D種 | 100Ω以下 | 300V以下の低圧機器 |',
            images: [], keyPoints: ['A種=10Ω以下', 'B種=計算値', 'C種=10Ω以下', 'D種=100Ω以下'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '電気設備', tags: ['接地工事', '接地抵抗'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'B2-2024-1ST-Q05', qualificationId: 'B2', qualificationName: '1級電気工事施工管理技士',
        subjectId: 'first', subjectName: '第一次検定', year: 2024, session: '上期', questionNumber: 5,
        questionText: '電力の需要率、負荷率及び不等率に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '需要率は、最大需要電力を設備容量で除した値である' },
            { label: '2', text: '負荷率は、設備容量を平均需要電力で除した値である' },
            { label: '3', text: '不等率は常に1未満である' },
            { label: '4', text: '需要率は常に1を超える' },
        ], correctAnswer: '1',
        explanation: {
            summary: '需要率 = 最大需要電力 / 設備容量',
            detailedText: '- **需要率** = 最大需要電力 ÷ 設備容量（0〜1）\n- **負荷率** = 平均需要電力 ÷ 最大需要電力（0〜1）\n- **不等率** = 各負荷の最大需要電力の合計 ÷ 合成最大需要電力（1以上）',
            images: [], keyPoints: ['需要率=最大/設備', '負荷率=平均/最大', '不等率≧1'], relatedQuestions: [],
            references: [{ title: '全国建設研修センター', url: 'https://www.fcip-shiken.jp/' }],
        }, difficulty: 3, category: '電気設備', tags: ['需要率', '負荷率', '不等率'], source: 'https://www.fcip-shiken.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
