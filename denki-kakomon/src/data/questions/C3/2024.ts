import type { Question } from '@/types/question';

export const C3_2024: Question[] = [
    {
        id: 'C3-2024-THEORY-Q01', qualificationId: 'C3', qualificationName: '第一種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 1,
        questionText: 'マクスウェルの電磁方程式のうち、ファラデーの電磁誘導の法則を表す式として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '∇×E = -∂B/∂t' },
            { label: '(2)', text: '∇×H = J + ∂D/∂t' },
            { label: '(3)', text: '∇·D = ρ' },
            { label: '(4)', text: '∇·B = 0' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'ファラデーの法則：∇×E = -∂B/∂t（磁束の変化が電場を誘起）',
            detailedText: 'マクスウェル方程式（微分形）：\n1. $\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$（ファラデーの法則）\n2. $\\nabla \\times \\mathbf{H} = \\mathbf{J} + \\frac{\\partial \\mathbf{D}}{\\partial t}$（アンペア-マクスウェルの法則）\n3. $\\nabla \\cdot \\mathbf{D} = \\rho$（ガウスの法則）\n4. $\\nabla \\cdot \\mathbf{B} = 0$（磁束保存則）',
            images: [], formula: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}', keyPoints: ['4つの方程式の意味と対応を理解', '(2)はアンペア-マクスウェル', '(4)は磁気単極子の不在'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 5, category: '電磁気学', tags: ['マクスウェル方程式', 'ファラデーの法則'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C3-2024-THEORY-Q02', qualificationId: 'C3', qualificationName: '第一種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 2,
        questionText: '分布定数回路の特性インピーダンスZ₀を表す式として正しいものはどれか。ただし、R, L, G, C は単位長さ当たりの抵抗、インダクタンス、コンダクタンス、静電容量とする。',
        questionImages: [], choices: [
            { label: '(1)', text: 'Z₀ = √((R+jωL)/(G+jωC))' },
            { label: '(2)', text: 'Z₀ = √((R+jωL)(G+jωC))' },
            { label: '(3)', text: 'Z₀ = (R+jωL)/(G+jωC)' },
            { label: '(4)', text: 'Z₀ = √(L/C)' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: '特性インピーダンス Z₀ = √((R+jωL)/(G+jωC))',
            detailedText: '一般の分布定数回路：$Z_0 = \\sqrt{\\frac{R+j\\omega L}{G+j\\omega C}}$\n\n無損失線路（R=0, G=0）の場合：$Z_0 = \\sqrt{\\frac{L}{C}}$（純抵抗値）\n\n伝搬定数：$\\gamma = \\sqrt{(R+j\\omega L)(G+j\\omega C)}$',
            images: [], formula: 'Z_0 = \\sqrt{\\frac{R+j\\omega L}{G+j\\omega C}}', keyPoints: ['無損失線路ではZ₀=√(L/C)', '伝搬定数γとの関係'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 5, category: '電磁気学', tags: ['分布定数回路', '特性インピーダンス'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C3-2024-THEORY-Q03', qualificationId: 'C3', qualificationName: '第一種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 3,
        questionText: 'ポインティングベクトルに関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '電磁エネルギーの流れの密度と方向を表すベクトルである' },
            { label: '(2)', text: '電界の回転を表すベクトルである' },
            { label: '(3)', text: '磁界の発散を表すスカラーである' },
            { label: '(4)', text: '変位電流の大きさを表すベクトルである' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'ポインティングベクトル S = E × H は電磁エネルギーの流れを表す',
            detailedText: '$\\mathbf{S} = \\mathbf{E} \\times \\mathbf{H}$ [W/m²]\n\nポインティングベクトルは電磁エネルギーが単位時間・単位面積あたりに流れる量と方向を表します。',
            images: [], formula: '\\mathbf{S} = \\mathbf{E} \\times \\mathbf{H}', keyPoints: ['S = E × H', '単位は [W/m²]', '電磁波のエネルギー伝送を表す'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 4, category: '電磁気学', tags: ['ポインティングベクトル', '電磁エネルギー'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
