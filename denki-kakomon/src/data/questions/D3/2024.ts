import type { Question } from '@/types/question';

export const D3_2024: Question[] = [
    {
        id: 'D3-2024-BASIC-Q01', qualificationId: 'D3', qualificationName: '総合通信',
        subjectId: 'basic', subjectName: '電気通信技術の基礎', year: 2024, session: '上期', questionNumber: 1,
        questionText: '光ファイバの損失要因として、レイリー散乱損失に関する記述で正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '波長の4乗に比例する' },
            { label: '2', text: '波長の4乗に反比例する' },
            { label: '3', text: '波長に比例する' },
            { label: '4', text: '波長に無関係である' },
        ], correctAnswer: '2',
        explanation: {
            summary: 'レイリー散乱損失は波長の4乗に反比例する',
            detailedText: 'レイリー散乱は光ファイバのガラス内の微小な屈折率ゆらぎが原因。短波長ほど散乱が大きい。\n\n$\\alpha_R \\propto \\frac{1}{\\lambda^4}$\n\nこのため長波長（1.55μm帯）が長距離通信に適している。',
            images: [], formula: '\\alpha_R \\propto \\frac{1}{\\lambda^4}', keyPoints: ['波長の4乗に反比例', '短波長ほど損失大', '1.55μm帯が最も低損失'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '光通信', tags: ['レイリー散乱', '光ファイバ'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D3-2024-TECH-Q01', qualificationId: 'D3', qualificationName: '総合通信',
        subjectId: 'tech', subjectName: '端末設備の接続技術', year: 2024, session: '上期', questionNumber: 2,
        questionText: 'VoIPで音声をIPパケット化する際に使用される主なプロトコルの組合せとして正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'RTP + UDP' },
            { label: '2', text: 'FTP + TCP' },
            { label: '3', text: 'HTTP + TCP' },
            { label: '4', text: 'SMTP + UDP' },
        ], correctAnswer: '1',
        explanation: {
            summary: 'VoIPの音声データ伝送にはRTP/UDPが使用される',
            detailedText: 'VoIPプロトコル構成：\n- **呼制御**: SIP, H.323\n- **音声伝送**: RTP（Real-time Transport Protocol）over UDP\n- TCPではなくUDPを使う理由：リアルタイム性重視（再送制御不要）',
            images: [], keyPoints: ['RTP/UDPでリアルタイム伝送', 'TCPは再送遅延が生じるため不適', 'SIPで呼制御'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: 'ネットワーク', tags: ['VoIP', 'RTP', 'UDP'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D3-2024-LAW-Q01', qualificationId: 'D3', qualificationName: '総合通信',
        subjectId: 'law', subjectName: '法規', year: 2024, session: '上期', questionNumber: 3,
        questionText: '端末設備等規則における、アナログ電話端末の電気的条件として、直流回路を閉じた時の直流抵抗値の上限として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '50Ω以下' },
            { label: '2', text: '300Ω以下' },
            { label: '3', text: '1700Ω以下' },
            { label: '4', text: '1MΩ以上' },
        ], correctAnswer: '2',
        explanation: {
            summary: 'アナログ電話端末のオフフック時の直流抵抗の上限は300Ω以下',
            detailedText: 'アナログ電話端末の電気的条件（端末設備等規則）：\n- 直流回路を閉じたとき（オフフック）：直流抵抗 **300Ω以下**\n- 直流回路を開いたとき（オンフック）：直流抵抗 **1MΩ以上**',
            images: [], keyPoints: ['オフフック時: 300Ω以下', 'オンフック時: 1MΩ以上'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '法規', tags: ['端末設備等規則', 'アナログ電話'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
