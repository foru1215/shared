import type { Question } from '@/types/question';

export const F3_2024: Question[] = [
    {
        id: 'F3-2024-LAW-Q01', qualificationId: 'F3', qualificationName: '消防設備士',
        subjectId: 'law', subjectName: '消防関係法令', year: 2024, session: '上期', questionNumber: 1,
        questionText: '消防法において、防火対象物の関係者が設置・維持しなければならないものとして、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '消防用設備等' },
            { label: '2', text: '非常用発電設備のみ' },
            { label: '3', text: '避雷設備のみ' },
            { label: '4', text: '消防署の指示する設備のみ' },
        ], correctAnswer: '1',
        explanation: {
            summary: '消防法第17条により防火対象物の関係者は消防用設備等の設置・維持が義務',
            detailedText: '消防法第17条：防火対象物の関係者は、政令で定める技術上の基準に従って、消防用設備等を設置し、維持しなければならない。\n\n消防用設備等とは：\n- 消火設備（消火器、スプリンクラー等）\n- 警報設備（自動火災報知設備等）\n- 避難設備（誘導灯、避難はしご等）\n- 消防用水\n- 消火活動上必要な施設',
            images: [], keyPoints: ['消防法第17条', '設置と維持の両方が義務', '5種類の消防用設備等'], relatedQuestions: [],
            references: [{ title: '消防試験研究センター', url: 'https://www.shoubo-shiken.or.jp/' }],
        }, difficulty: 2, category: '消防法令', tags: ['消防法', '消防用設備'], source: 'https://www.shoubo-shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'F3-2024-BASIC-Q01', qualificationId: 'F3', qualificationName: '消防設備士',
        subjectId: 'basic', subjectName: '基礎的知識', year: 2024, session: '上期', questionNumber: 2,
        questionText: '自動火災報知設備の感知器の種類として、正しいものの組合せはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '差動式スポット型・定温式スポット型・光電式スポット型' },
            { label: '2', text: '差動式スポット型・定温式スポット型・圧力式スポット型' },
            { label: '3', text: '電磁式スポット型・定温式スポット型・光電式スポット型' },
            { label: '4', text: '差動式スポット型・高温式スポット型・光電式スポット型' },
        ], correctAnswer: '1',
        explanation: {
            summary: '感知器は熱感知器（差動式・定温式）と煙感知器（光電式・イオン化式）に大別',
            detailedText: '自動火災報知設備の感知器分類：\n| 分類 | 種類 | 原理 |\n|---|---|---|\n| 熱感知器 | 差動式 | 温度上昇率で感知 |\n| 熱感知器 | 定温式 | 一定温度で感知 |\n| 煙感知器 | 光電式 | 光の散乱で煙を検知 |\n| 煙感知器 | イオン化式 | イオン電流変化で検知 |\n| 炎感知器 | 赤外線式等 | 炎の光を検知 |',
            images: [], keyPoints: ['差動式=温度上昇率', '定温式=一定温度', '光電式=煙の光散乱'], relatedQuestions: [],
            references: [{ title: '消防試験研究センター', url: 'https://www.shoubo-shiken.or.jp/' }],
        }, difficulty: 2, category: '設備構造', tags: ['感知器', '自動火災報知設備'], source: 'https://www.shoubo-shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
    {
        id: 'F3-2024-STR-Q01', qualificationId: 'F3', qualificationName: '消防設備士',
        subjectId: 'structure', subjectName: '構造・機能・整備', year: 2024, session: '上期', questionNumber: 3,
        questionText: 'スプリンクラー設備の閉鎖型ヘッドに関する記述として、正しいものはどれか。',
        questionImages: [], choices: [
            { label: '1', text: '火災時に手動で開放する必要がある' },
            { label: '2', text: '感熱体が溶融または破壊されて自動的に放水する' },
            { label: '3', text: '常時放水状態にある' },
            { label: '4', text: '煙感知器と連動して開放される' },
        ], correctAnswer: '2',
        explanation: {
            summary: '閉鎖型ヘッドは感熱体（ヒュージブルリンク等）が熱で溶融して自動放水',
            detailedText: 'スプリンクラーヘッドの種類：\n- **閉鎖型**：感熱体で封止、火災熱で溶融→自動放水（最も一般的）\n- **開放型**：常時開放、一斉開放弁で制御\n\n閉鎖型の感熱体：\n- ヒュージブルリンク（溶融型）\n- グラスバルブ（破壊型）',
            images: [], keyPoints: ['閉鎖型ヘッドが最も一般的', '感熱体の溶融/破壊で自動放水', '個別に作動する'], relatedQuestions: [],
            references: [{ title: '消防試験研究センター', url: 'https://www.shoubo-shiken.or.jp/' }],
        }, difficulty: 2, category: '設備構造', tags: ['スプリンクラー', '閉鎖型ヘッド'], source: 'https://www.shoubo-shiken.or.jp/', createdAt: '2024-01-01', updatedAt: '2024-01-01',
    },
];
