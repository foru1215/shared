import type { Question } from '@/types/question';

export const D2_2024: Question[] = [
    {
        id: 'D2-2024-BASIC-Q01', qualificationId: 'D2', qualificationName: 'デジタル通信',
        subjectId: 'basic', subjectName: '電気通信技術の基礎', year: 2024, session: '上期', questionNumber: 1,
        questionText: 'ISDN基本インタフェースの伝送速度として正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '64kbps' },
            { label: '2', text: '128kbps' },
            { label: '3', text: '144kbps' },
            { label: '4', text: '192kbps' },
        ], correctAnswer: '4',
        explanation: {
            summary: 'ISDN基本インタフェース: 2B+D = 2×64+16 = 144kbps だが、フレーム同期等で192kbps',
            detailedText: 'ISDN基本インタフェース（BRI）：\n- Bチャネル: 64kbps × 2 = 128kbps（情報チャネル）\n- Dチャネル: 16kbps（信号チャネル）\n- 情報部: 2B+D = 144kbps\n- フレーム同期等を含めた伝送速度: **192kbps**',
            images: [], keyPoints: ['BRI = 2B+D', 'Bch=64kbps, Dch=16kbps', '物理層の伝送速度は192kbps'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 3, category: '通信技術', tags: ['ISDN', 'BRI'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D2-2024-TECH-Q01', qualificationId: 'D2', qualificationName: 'デジタル通信',
        subjectId: 'tech', subjectName: '端末設備の接続技術', year: 2024, session: '上期', questionNumber: 2,
        questionText: 'Ethernet（IEEE 802.3）の1000BASE-Tで使用するUTPケーブルのカテゴリとして適切なものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'カテゴリ3以上' },
            { label: '2', text: 'カテゴリ5以上' },
            { label: '3', text: 'カテゴリ5e以上' },
            { label: '4', text: 'カテゴリ6以上' },
        ], correctAnswer: '3',
        explanation: {
            summary: '1000BASE-Tはカテゴリ5e以上のUTPケーブルが必要',
            detailedText: 'UTPケーブルのカテゴリと対応速度：\n| カテゴリ | 最大速度 |\n|---|---|\n| Cat3 | 10Mbps |\n| Cat5 | 100Mbps |\n| Cat5e | 1Gbps |\n| Cat6 | 1Gbps(10Gbps短距離) |\n| Cat6A | 10Gbps |',
            images: [], keyPoints: ['1000BASE-T = Cat5e以上', '4ペア8芯すべて使用', '最大100m'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 2, category: 'ネットワーク', tags: ['Ethernet', 'UTPケーブル'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'D2-2024-TECH-Q02', qualificationId: 'D2', qualificationName: 'デジタル通信',
        subjectId: 'tech', subjectName: '端末設備の接続技術', year: 2024, session: '上期', questionNumber: 3,
        questionText: 'OSI参照モデルのトランスポート層で動作するプロトコルとして正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: 'IP' },
            { label: '2', text: 'TCP' },
            { label: '3', text: 'HTTP' },
            { label: '4', text: 'ARP' },
        ], correctAnswer: '2',
        explanation: {
            summary: 'TCPはトランスポート層（第4層）で動作する',
            detailedText: 'OSI参照モデルの各層と代表的プロトコル：\n| 層 | 名称 | プロトコル例 |\n|---|---|---|\n| 7 | アプリケーション | HTTP, FTP, SMTP |\n| 4 | トランスポート | **TCP**, UDP |\n| 3 | ネットワーク | IP |\n| 2 | データリンク | Ethernet |',
            images: [], keyPoints: ['TCP/UDPはトランスポート層', 'IPはネットワーク層', 'HTTPはアプリケーション層'], relatedQuestions: [],
            references: [{ title: 'デジタル技術教育協会', url: 'https://www.dekyo.or.jp/' }],
        }, difficulty: 2, category: 'ネットワーク', tags: ['OSI参照モデル', 'TCP'], source: 'https://www.dekyo.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
