import type { Qualification } from '@/types/qualification';

export const CATEGORIES = [
    { id: 'electrician', name: '電気工事士', icon: '🔧', color: '#00bcd4' },
    { id: 'construction', name: '電気工事施工管理技士', icon: '🏗️', color: '#4caf50' },
    { id: 'chief', name: '電気主任技術者', icon: '⚡', color: '#ff9800' },
    { id: 'telecom-worker', name: '電気通信工事担任者', icon: '📡', color: '#9c27b0' },
    { id: 'telecom-chief', name: '電気通信主任技術者', icon: '🗼', color: '#e91e63' },
    { id: 'facility', name: 'その他（設備・管理系）', icon: '🏭', color: '#607d8b' },
    { id: 'safety', name: 'その他（安全・衛生系）', icon: '🦺', color: '#795548' },
] as const;

export const QUALIFICATIONS: Qualification[] = [
    // ── A. 電気工事士 ──
    {
        id: 'A1',
        name: '第二種電気工事士',
        shortName: '2種電工',
        category: 'electrician',
        description: '一般住宅や小規模店舗の電気工事ができる国家資格。電気系資格の登竜門。',
        subjects: [
            { id: 'written', name: '筆記試験' },
            { id: 'practical', name: '技能試験' },
        ],
        examConfigs: [
            { subjectId: 'written', timeMinutes: 120, questionCount: 50 },
        ],
        officialUrl: 'https://www.shiken.or.jp/',
        difficulty: 2,
        popularity: 10,
        dataStatus: 'available',
    },
    {
        id: 'A2',
        name: '第一種電気工事士',
        shortName: '1種電工',
        category: 'electrician',
        description: '自家用電気工作物（最大500kW未満）の電気工事ができる国家資格。',
        subjects: [
            { id: 'written', name: '筆記試験' },
            { id: 'practical', name: '技能試験' },
        ],
        examConfigs: [
            { subjectId: 'written', timeMinutes: 140, questionCount: 50 },
        ],
        officialUrl: 'https://www.shiken.or.jp/',
        difficulty: 3,
        popularity: 8,
        dataStatus: 'available',
    },

    // ── B. 電気工事施工管理技士 ──
    {
        id: 'B1',
        name: '2級電気工事施工管理技士',
        shortName: '2級セコカン電気',
        category: 'construction',
        description: '電気工事の施工管理を行うための国家資格（2級）。',
        subjects: [
            { id: 'first', name: '第一次検定' },
            { id: 'second', name: '第二次検定' },
        ],
        examConfigs: [
            { subjectId: 'first', timeMinutes: 130, questionCount: 64 },
        ],
        officialUrl: 'https://www.fcip-shiken.jp/',
        difficulty: 3,
        popularity: 7,
        dataStatus: 'available',
    },
    {
        id: 'B2',
        name: '1級電気工事施工管理技士',
        shortName: '1級セコカン電気',
        category: 'construction',
        description: '電気工事の施工管理を行うための国家資格（1級）。監理技術者になれる。',
        subjects: [
            { id: 'first', name: '第一次検定' },
            { id: 'second', name: '第二次検定' },
        ],
        examConfigs: [
            { subjectId: 'first', timeMinutes: 150, questionCount: 92 },
        ],
        officialUrl: 'https://www.fcip-shiken.jp/',
        difficulty: 4,
        popularity: 7,
        dataStatus: 'available',
    },

    // ── C. 電気主任技術者 ──
    {
        id: 'C1',
        name: '第三種電気主任技術者',
        shortName: '電験三種',
        category: 'chief',
        description: '電圧5万V未満の事業用電気工作物の工事・維持・運用の保安監督ができる。',
        subjects: [
            { id: 'theory', name: '理論' },
            { id: 'power', name: '電力' },
            { id: 'machine', name: '機械' },
            { id: 'law', name: '法規' },
        ],
        examConfigs: [
            { subjectId: 'theory', timeMinutes: 90, questionCount: 20 },
            { subjectId: 'power', timeMinutes: 90, questionCount: 20 },
            { subjectId: 'machine', timeMinutes: 90, questionCount: 20 },
            { subjectId: 'law', timeMinutes: 65, questionCount: 20 },
        ],
        officialUrl: 'https://www.shiken.or.jp/',
        difficulty: 4,
        popularity: 9,
        dataStatus: 'available',
    },
];

export function getQualification(id: string) {
    return QUALIFICATIONS.find((q) => q.id === id);
}

export function getCategoryInfo(id: string) {
    return CATEGORIES.find((c) => c.id === id);
}

