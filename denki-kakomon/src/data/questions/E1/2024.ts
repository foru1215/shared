import type { Question } from '@/types/question';

export const E1_2024: Question[] = [
    {
        id: 'E1-2024-SYS-Q01', qualificationId: 'E1', qualificationName: '伝送交換主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 1,
        questionText: 'SDH（Synchronous Digital Hierarchy）のフレーム構成に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '基本フレーム周期は125μsである' },
            { label: '(2)', text: '基本フレーム周期は1msである' },
            { label: '(3)', text: 'STM-1の伝送速度は622Mbpsである' },
            { label: '(4)', text: 'SOHはペイロードに含まれる' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'SDHの基本フレーム周期は125μs（8kHz）',
            detailedText: 'SDHの特徴：\n- 基本フレーム周期: **125μs**（PCMと同じ）\n- STM-1: 155.52Mbps\n- STM-4: 622.08Mbps\n- STM-16: 2.48832Gbps\n- SOH（セクションオーバヘッド）はペイロード外',
            images: [], keyPoints: ['フレーム周期=125μs', 'STM-1=155.52Mbps', 'SOHはオーバヘッド領域'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 4, category: '伝送技術', tags: ['SDH', 'STM'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'E1-2024-SYS-Q02', qualificationId: 'E1', qualificationName: '伝送交換主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 2,
        questionText: 'MPLS（Multi-Protocol Label Switching）に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'IPヘッダの宛先アドレスに基づいてパケットを転送する' },
            { label: '(2)', text: 'ラベルと呼ばれる短い固定長の識別子でパケットを転送する' },
            { label: '(3)', text: 'OSI参照モデルの物理層で動作する' },
            { label: '(4)', text: 'トラフィックエンジニアリングの機能はない' },
        ], correctAnswer: '(2)',
        explanation: {
            summary: 'MPLSはラベル（短い固定長識別子）によるパケット転送技術',
            detailedText: 'MPLS: Layer 2とLayer 3の間で動作（レイヤ2.5とも呼ばれる）。ラベルスイッチングにより高速転送を実現。LSP（Label Switched Path）でトラフィックエンジニアリングが可能。',
            images: [], keyPoints: ['ラベルで高速転送', 'レイヤ2.5', 'LSPでトラフィックエンジニアリング'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 4, category: 'ネットワーク', tags: ['MPLS', 'ラベルスイッチング'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'E1-2024-SYS-Q03', qualificationId: 'E1', qualificationName: '伝送交換主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 3,
        questionText: '光ファイバ増幅器（EDFA）に使用される希土類元素として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'ネオジム（Nd）' },
            { label: '(2)', text: 'エルビウム（Er）' },
            { label: '(3)', text: 'イットリウム（Y）' },
            { label: '(4)', text: 'プラセオジム（Pr）' },
        ], correctAnswer: '(2)',
        explanation: {
            summary: 'EDFAはエルビウム（Er）添加ファイバを使用する光増幅器',
            detailedText: 'EDFA（Erbium-Doped Fiber Amplifier）：\n- 1.55μm帯の光信号を直接増幅\n- エルビウム添加ファイバに励起光を入射して信号光を増幅\n- 励起波長: 0.98μm or 1.48μm\n- WDMシステムの長距離伝送に不可欠',
            images: [], keyPoints: ['エルビウム（Er）を使用', '1.55μm帯で動作', 'WDM伝送に必須'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 4, category: '光通信', tags: ['EDFA', '光増幅器', 'エルビウム'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
