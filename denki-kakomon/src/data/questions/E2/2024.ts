import type { Question } from '@/types/question';

export const E2_2024: Question[] = [
    {
        id: 'E2-2024-SYS-Q01', qualificationId: 'E2', qualificationName: '線路主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 1,
        questionText: '光ファイバケーブルの接続方法に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '融着接続は機械的接続より接続損失が大きい' },
            { label: '(2)', text: '融着接続は放電熱でファイバ端面を溶融接続する方法である' },
            { label: '(3)', text: 'メカニカルスプライスは融着接続より接続損失が小さい' },
            { label: '(4)', text: '光コネクタ接続は取り外しができない' },
        ], correctAnswer: '(2)',
        explanation: {
            summary: '融着接続は放電アークの熱でファイバ端面を溶融して接続する',
            detailedText: '光ファイバの接続方法比較：\n| 方法 | 損失 | 特徴 |\n|---|---|---|\n| 融着接続 | 0.1dB以下 | 放電熱で溶融、最も低損失 |\n| メカニカルスプライス | 0.2-0.5dB | V溝やマッチングオイル使用 |\n| 光コネクタ | 0.3-0.5dB | 着脱可能 |',
            images: [], keyPoints: ['融着接続が最も低損失', '放電アークで溶融', '光コネクタは着脱可能'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '線路設備', tags: ['光ファイバ接続', '融着接続'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'E2-2024-SYS-Q02', qualificationId: 'E2', qualificationName: '線路主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 2,
        questionText: '地中管路設備に関する記述として、不適当なものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '管路の入線張力を考慮して適切なマンホール間隔を設定する' },
            { label: '(2)', text: 'ハンドホールはマンホールより小型で、分岐点等に設置される' },
            { label: '(3)', text: '管路にはPF管やFEP管などの波付硬質ポリエチレン管が使われる' },
            { label: '(4)', text: '管路は直線のみで構成し、曲がりは一切設けてはならない' },
        ], correctAnswer: '(4)',
        explanation: {
            summary: '管路に曲がりを設けることは可能であり、曲率半径の基準を守れば問題ない',
            detailedText: '管路設備の設計指針：\n- 曲がりは曲率半径の基準を満たせば設置可能\n- マンホール間隔は入線張力と管路長を考慮\n- ハンドホールは小型のアクセスポイント\n- FEP管（波付硬質ポリエチレン管）が主流',
            images: [], keyPoints: ['管路に曲がりは設置可能', '曲率半径の基準を遵守', 'FEP管が一般的'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '線路設備', tags: ['管路設備', 'マンホール'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'E2-2024-SYS-Q03', qualificationId: 'E2', qualificationName: '線路主任技術者',
        subjectId: 'system', subjectName: '電気通信システム', year: 2024, session: '上期', questionNumber: 3,
        questionText: 'OTDR（Optical Time Domain Reflectometer）で測定できる項目として、不適当なものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'ファイバの長さ' },
            { label: '(2)', text: '接続点の位置と接続損失' },
            { label: '(3)', text: 'ファイバの波長分散' },
            { label: '(4)', text: 'ファイバの伝送損失分布' },
        ], correctAnswer: '(3)',
        explanation: {
            summary: 'OTDRは後方散乱光を測定するもので、波長分散の測定はできない',
            detailedText: 'OTDR測定可能項目：\n- ✅ ファイバ長\n- ✅ 接続点の位置と損失\n- ✅ 伝送損失の距離分布\n- ✅ 障害点の検出\n- ❌ 波長分散（別途分散測定器が必要）',
            images: [], keyPoints: ['OTDRは後方散乱光を利用', '波長分散は測定不可', '障害点探索に有効'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '測定技術', tags: ['OTDR', '光測定'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
