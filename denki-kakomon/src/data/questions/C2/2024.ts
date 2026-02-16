import type { Question } from '@/types/question';

export const C2_2024: Question[] = [
    {
        id: 'C2-2024-THEORY-Q01', qualificationId: 'C2', qualificationName: '第二種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 1,
        questionText: '磁気回路において、起磁力F[A]、磁束φ[Wb]、磁気抵抗Rm[A/Wb]の関係として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'F = φ × Rm' },
            { label: '(2)', text: 'F = φ / Rm' },
            { label: '(3)', text: 'F = Rm / φ' },
            { label: '(4)', text: 'φ = F × Rm' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'オームの法則の磁気版：F = φRm',
            detailedText: '磁気回路のオームの法則：$F = \\phi R_m$\n\n電気回路と磁気回路の対比：\n| 電気回路 | 磁気回路 |\n|---|---|\n| V（電圧）| F（起磁力）|\n| I（電流）| φ（磁束）|\n| R（抵抗）| Rm（磁気抵抗）|',
            images: [], formula: 'F = \\phi R_m', keyPoints: ['磁気回路のオームの法則', '起磁力＝NI（巻数×電流）'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 3, category: '電磁気学', tags: ['磁気回路', '起磁力'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C2-2024-THEORY-Q02', qualificationId: 'C2', qualificationName: '第二種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 2,
        questionText: 'ラプラス変換に関する記述で、f(t) = e^(-at) のラプラス変換F(s)として正しいものはどれか。ただし a > 0 とする。',
        questionImages: [], choices: [
            { label: '(1)', text: 'F(s) = 1/(s+a)' },
            { label: '(2)', text: 'F(s) = 1/(s-a)' },
            { label: '(3)', text: 'F(s) = s/(s+a)' },
            { label: '(4)', text: 'F(s) = a/(s+a)' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'L[e^(-at)] = 1/(s+a)',
            detailedText: '$$\\mathcal{L}[e^{-at}] = \\int_0^{\\infty} e^{-at}e^{-st}dt = \\int_0^{\\infty} e^{-(s+a)t}dt = \\frac{1}{s+a}$$\n\n電験二種でよく使うラプラス変換：\n- L[1] = 1/s\n- L[t] = 1/s²\n- L[e^(-at)] = 1/(s+a)\n- L[sin ωt] = ω/(s²+ω²)',
            images: [], formula: '\\mathcal{L}[e^{-at}] = \\frac{1}{s+a}', keyPoints: ['基本的なラプラス変換の公式', '制御工学・過渡現象で必須'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 4, category: '数学', tags: ['ラプラス変換'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C2-2024-THEORY-Q03', qualificationId: 'C2', qualificationName: '第二種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 3,
        questionText: '半導体に関する記述として、誤っているものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '真性半導体の電気伝導は温度上昇により増加する' },
            { label: '(2)', text: 'n型半導体では電子が多数キャリアである' },
            { label: '(3)', text: 'p型半導体では正孔が多数キャリアである' },
            { label: '(4)', text: 'pn接合に逆方向電圧を加えると電流が大きく流れる' },
        ], correctAnswer: '(4)',
        explanation: {
            summary: 'pn接合に逆方向電圧を加えると空乏層が広がり電流はほとんど流れない',
            detailedText: 'pn接合の特性：\n- **順方向バイアス**：空乏層が狭くなり電流が流れる\n- **逆方向バイアス**：空乏層が広がりほとんど電流が流れない（わずかな逆方向飽和電流のみ）',
            images: [], keyPoints: ['逆方向バイアスでは空乏層拡大', '順方向で電流が流れる', '逆方向飽和電流は微小'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 3, category: '電子回路', tags: ['半導体', 'pn接合'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C2-2024-THEORY-Q04', qualificationId: 'C2', qualificationName: '第二種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 4,
        questionText: '対称座標法に関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: '不平衡三相量を正相・逆相・零相の3つの対称成分に分解する方法である' },
            { label: '(2)', text: '正相分と逆相分の回転方向は同じである' },
            { label: '(3)', text: '零相分は大きさも位相も異なる3つの成分からなる' },
            { label: '(4)', text: '対称座標法は平衡三相回路にのみ適用できる' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: '対称座標法は不平衡三相量を正相・逆相・零相の対称成分に分解する手法',
            detailedText: 'フォーテスキューの対称座標法：\n- **正相分**：正相回転する平衡成分\n- **逆相分**：逆相回転する平衡成分\n- **零相分**：同位相で同大きさの成分\n\n不平衡故障の解析に不可欠な手法。',
            images: [], keyPoints: ['正相＝正転平衡', '逆相＝逆転平衡', '零相＝同位相同大', 'フォーテスキューの定理'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 4, category: '電気理論', tags: ['対称座標法', '不平衡'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'C2-2024-THEORY-Q05', qualificationId: 'C2', qualificationName: '第二種電気主任技術者',
        subjectId: 'theory', subjectName: '理論', year: 2024, session: '上期', questionNumber: 5,
        questionText: '過渡現象に関する記述として、RL直列回路に直流電圧Vを印加した時の時定数として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '(1)', text: 'τ = L/R' },
            { label: '(2)', text: 'τ = R/L' },
            { label: '(3)', text: 'τ = LR' },
            { label: '(4)', text: 'τ = 1/(LR)' },
        ], correctAnswer: '(1)',
        explanation: {
            summary: 'RL回路の時定数 τ = L/R',
            detailedText: 'RL直列回路の時定数：$\\tau = \\frac{L}{R}$\n\nRC直列回路の時定数：$\\tau = CR$\n\n時定数は、過渡応答が最終値の63.2%に達するまでの時間。',
            images: [], formula: '\\tau = \\frac{L}{R}', keyPoints: ['RL回路: τ=L/R', 'RC回路: τ=CR', '63.2%に達する時間'], relatedQuestions: [],
            references: [{ title: '電気技術者試験センター', url: 'https://www.shiken.or.jp/' }],
        }, difficulty: 3, category: '電気理論', tags: ['過渡現象', '時定数', 'RL回路'], source: 'https://www.shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
