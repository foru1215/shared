# 電気系資格 過去問学習サイト構築 — Claude Code Opus 4.6 向け詳細指示書

---

## 1. プロジェクト概要

### 1.1 目的
日本国内の電気系資格（全26種類以上）の過去問を網羅した、**登録不要・無料**のWebベース学習プラットフォームを構築する。ユーザーはブラウザだけで過去問演習・進捗管理・試験シミュレーションが行える。

### 1.2 対象資格一覧（全カテゴリ）

#### A. 電気工事士
| ID | 資格名 | 略称 |
|----|--------|------|
| A1 | 第二種電気工事士 | 2種電工 |
| A2 | 第一種電気工事士 | 1種電工 |

#### B. 電気工事施工管理技士
| ID | 資格名 | 略称 |
|----|--------|------|
| B1 | 2級電気工事施工管理技士 | 2級セコカン電気 |
| B2 | 1級電気工事施工管理技士 | 1級セコカン電気 |

#### C. 電気主任技術者
| ID | 資格名 | 略称 |
|----|--------|------|
| C1 | 第三種電気主任技術者 | 電験三種 |
| C2 | 第二種電気主任技術者 | 電験二種 |
| C3 | 第一種電気主任技術者 | 電験一種 |

#### D. 電気通信の工事担任者
| ID | 資格名 | 略称 |
|----|--------|------|
| D1 | アナログ通信（旧：AI種） | アナログ通信 |
| D2 | デジタル通信（旧：DD種） | デジタル通信 |
| D3 | 総合通信（旧：AI・DD総合種） | 総合通信 |

#### E. 電気通信主任技術者
| ID | 資格名 | 略称 |
|----|--------|------|
| E1 | 伝送交換主任技術者 | 伝送交換 |
| E2 | 線路主任技術者 | 線路 |

#### F. その他の資格（電気・設備・管理系）
| ID | 資格名 | 略称 |
|----|--------|------|
| F1 | 認定電気工事従事者 | 認定電工 |
| F2 | 特種電気工事資格者 | 特種電工 |
| F3 | 消防設備士（甲種1〜5類、乙種1〜7類） | 消防設備士 |
| F4 | 計装士（1級・2級） | 計装士 |
| F5 | エネルギー管理士 | エネ管 |

#### G. その他の資格（安全・衛生系）
| ID | 資格名 | 略称 |
|----|--------|------|
| G1 | 高所作業車運転者 | 高所作業車 |
| G2 | 電気取扱者（低圧） | 低圧電気取扱 |
| G3 | 電気取扱者（高圧・特別高圧） | 高圧電気取扱 |
| G4 | 職長・安全衛生責任者教育 | 職長教育 |
| G5 | 玉掛け作業者 | 玉掛け |
| G6 | 高圧ケーブル工事技能認定 | 高圧ケーブル |

---

## 2. 技術要件

### 2.1 技術スタック

```
フロントエンド:
  - Next.js 14+ (App Router)
  - TypeScript（厳格モード）
  - Tailwind CSS v3
  - Framer Motion（アニメーション）
  - Zustand（状態管理）
  - Chart.js or Recharts（進捗グラフ）

バックエンド:
  - Next.js API Routes
  - Prisma ORM
  - SQLite（開発時）/ PostgreSQL（本番）

インフラ:
  - Vercel or VPS（nginx + Let's Encrypt）
  - HTTPS 必須（TLS 1.2以上）

データ管理:
  - localStorage（ユーザー進捗の永続化）
  - IndexedDB（大量データのキャッシュ）
  - フィンガープリント（ブラウザ識別）
```

### 2.2 HTTPS・セキュリティ要件

```yaml
必須セキュリティ対策:
  TLS:
    - TLS 1.2 以上を強制
    - HSTS ヘッダー設定（max-age=31536000; includeSubDomains）
    - HTTP → HTTPS 自動リダイレクト

  HTTPヘッダー:
    - Content-Security-Policy（CSP）を設定
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - X-XSS-Protection: 1; mode=block
    - Referrer-Policy: strict-origin-when-cross-origin
    - Permissions-Policy: camera=(), microphone=(), geolocation=()

  入力バリデーション:
    - すべてのユーザー入力をサニタイズ
    - XSS対策（DOMPurify使用）
    - SQLインジェクション対策（Prismaのパラメータバインディング）

  レート制限:
    - API エンドポイントにレート制限を実装
    - 1分あたり60リクエストまで

  データ保護:
    - Cookie: Secure; HttpOnly; SameSite=Strict
    - CSRF トークン実装
    - 個人情報は一切収集しない
```

---

## 3. ユーザー識別・進捗管理（登録不要）

### 3.1 ブラウザフィンガープリント方式

```typescript
// ユーザー識別の仕組み（登録不要）
interface UserIdentification {
  // 初回アクセス時にUUID v4を生成しlocalStorageに保存
  visitorId: string;             // UUID v4
  
  // ブラウザフィンガープリント（FingerprintJS使用）
  fingerprint: string;           // ブラウザ固有ハッシュ
  
  // 復元用コード（オプション）
  recoveryCode: string;          // 8桁の英数字コード
  
  // 最終アクセス日時
  lastAccessAt: Date;
}
```

### 3.2 進捗データ構造

```typescript
interface UserProgress {
  visitorId: string;
  
  // 資格ごとの進捗
  qualifications: {
    [qualificationId: string]: {
      // 科目ごとの進捗
      subjects: {
        [subjectId: string]: {
          // 年度ごとの回答状況
          years: {
            [year: string]: {
              questionsTotal: number;
              questionsAnswered: number;
              questionsCorrect: number;
              lastAttemptAt: Date;
              timeSpentSeconds: number;
              // 各問題の回答履歴
              answers: {
                [questionId: string]: {
                  selectedAnswer: string;
                  isCorrect: boolean;
                  attemptCount: number;
                  lastAttemptAt: Date;
                  bookmarked: boolean;
                };
              };
            };
          };
        };
      };
      // 総合統計
      overallAccuracy: number;
      totalTimeSpent: number;
      lastStudiedAt: Date;
    };
  };
  
  // 苦手問題リスト
  weakQuestions: string[];  // questionId の配列
  
  // ブックマーク
  bookmarks: string[];      // questionId の配列
}
```

### 3.3 データ永続化戦略

```
保存先の優先順位:
1. localStorage   — 主要な進捗データ（JSON形式、最大5MB）
2. IndexedDB      — 問題データのキャッシュ（大容量対応）
3. サーバーサイド  — visitorId + fingerprint でサーバーにもバックアップ
4. 復元コード     — 端末変更時にデータ復元するための8桁コード発行

データ同期フロー:
  アクセス時:
    1. localStorageからvisitorIdを読み取り
    2. 存在しない場合 → 新規UUID生成 & fingerprint取得
    3. サーバーに問い合わせ → 既存データがあれば同期
    4. 「続きから再開」ボタンを表示
```

---

## 4. 過去問データ収集・構造化

### 4.1 データソース

```yaml
公式・準公式ソース:
  電気技術者試験センター: https://www.shiken.or.jp/
  日本データ通信協会: https://www.dekyo.or.jp/
  消防試験研究センター: https://www.shoubo-shiken.or.jp/
  建設業振興基金: https://www.fcip-shiken.jp/

信頼性の高い参考サイト:
  過去問.com: https://kakomonn.com/
  電気の資格とお勉強: https://eleking.net/
  電験王: https://denken-ou.com/
  工事士.com: https://www.koujishi.com/
  過去問ドットコム: https://kakomon-quiz.com/
  電気工事士受験対策ネット: https://www.denki21.com/

画像参照元:
  - 公式試験問題PDF（図面・回路図・配線図など）
  - 上記参考サイトの解説画像（出典明記必須）
  - 自作の解説図（SVG/PNG形式で生成）
```

### 4.2 問題データスキーマ

```typescript
interface Question {
  id: string;                    // "A1-2024-AM-Q01" 形式
  qualificationId: string;       // 資格ID（A1, B2, C1 など）
  qualificationName: string;     // 資格正式名称
  subjectId: string;             // 科目ID
  subjectName: string;           // 科目名（例：「理論」「電力」「法規」）
  year: number;                  // 出題年度
  session: string;               // "上期" | "下期" | "前期" | "後期"
  questionNumber: number;        // 問題番号
  
  // 問題内容
  questionText: string;          // 問題文（Markdown対応）
  questionImages: QuestionImage[];  // 問題に付随する画像
  
  // 選択肢
  choices: {
    label: string;               // "ア" | "イ" | "ウ" | "エ" or "1" | "2" | "3" | "4"
    text: string;                // 選択肢テキスト
    image?: string;              // 選択肢画像（ある場合）
  }[];
  
  // 正答・解説
  correctAnswer: string;         // 正解のlabel
  explanation: ExplanationBlock; // 解説
  
  // メタデータ
  difficulty: 1 | 2 | 3 | 4 | 5; // 難易度（1=易 〜 5=難）
  category: string;              // 分野タグ（例：「オームの法則」「変圧器」）
  tags: string[];                // 追加タグ
  source: string;                // 出典URL
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionImage {
  url: string;                   // 画像パス
  alt: string;                   // alt テキスト
  caption?: string;              // キャプション
  width?: number;
  height?: number;
}

interface ExplanationBlock {
  summary: string;               // 解説の要約（1〜2行）
  detailedText: string;          // 詳細解説（Markdown対応）
  images: QuestionImage[];       // 解説画像（回路図、計算過程、図解など）
  formula?: string;              // 関連公式（LaTeX形式）
  keyPoints: string[];           // 要点リスト
  relatedQuestions?: string[];   // 関連問題のID
  references: {                  // 参考文献
    title: string;
    url: string;
  }[];
}
```

### 4.3 資格別の科目構成

```yaml
第二種電気工事士:
  筆記試験:
    - 電気の基礎理論
    - 配電理論と配線設計
    - 電気機器・配線器具・電気工事用材料・工具
    - 電気工事の施工方法
    - 一般用電気工作物の検査方法
    - 一般用電気工作物の保安に関する法令
    - 配線図
  技能試験:
    - 候補問題（No.1〜No.13）

第一種電気工事士:
  筆記試験:
    - 電気の基礎理論
    - 配電理論と配線設計
    - 電気応用
    - 電気機器・蓄電池
    - 電気工事の施工方法
    - 自家用電気工作物の検査方法
    - 配線図
    - 発電施設・送電施設・変電施設の基礎
    - 一般用・自家用電気工作物の保安に関する法令
  技能試験:
    - 候補問題（年度ごと）

電験三種:
  科目:
    - 理論
    - 電力
    - 機械
    - 法規

電験二種:
  一次試験:
    - 理論
    - 電力
    - 機械
    - 法規
  二次試験:
    - 電力・管理
    - 機械・制御

電験一種:
  一次試験:
    - 理論
    - 電力
    - 機械
    - 法規
  二次試験:
    - 電力・管理
    - 機械・制御

2級電気工事施工管理技士:
  第一次検定:
    - 電気工学等
    - 施工管理法
    - 法規
  第二次検定:
    - 施工管理法（記述）

1級電気工事施工管理技士:
  第一次検定:
    - 電気工学等
    - 施工管理法
    - 法規
  第二次検定:
    - 施工管理法（記述）

工事担任者（アナログ通信）:
  科目:
    - 電気通信技術の基礎
    - 端末設備の接続のための技術及び理論
    - 端末設備の接続に関する法規

工事担任者（デジタル通信）:
  科目:
    - 電気通信技術の基礎
    - 端末設備の接続のための技術及び理論
    - 端末設備の接続に関する法規

工事担任者（総合通信）:
  科目:
    - 電気通信技術の基礎
    - 端末設備の接続のための技術及び理論
    - 端末設備の接続に関する法規

伝送交換主任技術者:
  科目:
    - 電気通信システム
    - 伝送交換設備及び設備管理
    - 法規
    - 専門的能力（伝送、交換、データ通信、通信電力のうち1科目選択）

線路主任技術者:
  科目:
    - 電気通信システム
    - 線路設備及び設備管理
    - 法規
    - 専門的能力（通信線路、通信土木のうち1科目選択）

消防設備士:
  甲種:
    - 消防関係法令
    - 基礎的知識（機械 or 電気）
    - 消防用設備等の構造・機能・整備
    - 実技（鑑別等・製図）
  乙種:
    - 消防関係法令
    - 基礎的知識（機械 or 電気）
    - 消防用設備等の構造・機能・整備
    - 実技（鑑別等）

エネルギー管理士:
  試験科目:
    - エネルギー総合管理及び法規
    - 熱と流体の流れの基礎（熱分野）/ 電気の基礎（電気分野）
    - 燃料と燃焼（熱分野）/ 電気設備及びその管理（電気分野）
    - 熱利用設備及びその管理（熱分野）/ 電力応用（電気分野）

計装士:
  科目:
    - 学科A（計装一般知識）
    - 学科B（計装設計・工事概要）
    - 実技試験
```

---

## 5. UI/UX 設計

### 5.1 ページ構成

```
/                          → トップページ（資格一覧・ダッシュボード）
/[qualificationId]         → 資格詳細ページ（科目一覧・進捗サマリー）
/[qualificationId]/[year]  → 年度別問題一覧
/exam/[qualificationId]    → 試験モード（タイマー付き本番形式）
/practice/[qualificationId]→ 練習モード（1問ずつ解説付き）
/weak-points               → 苦手問題一覧
/bookmarks                 → ブックマーク一覧
/stats                     → 学習統計ダッシュボード
/search                    → 問題検索
/settings                  → 設定・データ管理
/about                     → サイト概要・利用規約
```

### 5.2 トップページ設計

```
┌─────────────────────────────────────────────────────┐
│  ⚡ 電気系資格 過去問マスター                         │
│  ─ 26資格・数万問の過去問を無料で学習 ─              │
├─────────────────────────────────────────────────────┤
│  📊 あなたの学習状況                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │総解答数│ │正答率 │ │学習日数│ │連続日数│             │
│  │ 1,234 │ │ 78%  │ │  45  │ │  7   │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  🔄 続きから再開                                     │
│  ┌───────────────────────────────────────┐          │
│  │ 電験三種 理論 令和5年度 問12 から再開    │          │
│  └───────────────────────────────────────┘          │
│                                                     │
│  📚 資格カテゴリ                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │電気工事士 │ │施工管理  │ │電気主任  │              │
│  │ 2資格   │ │ 2資格   │ │ 3資格   │                │
│  │ 進捗:45%│ │ 進捗:20%│ │ 進捗:60%│               │
│  └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │工事担任者 │ │通信主任  │ │設備・管理│              │
│  │ 3資格   │ │ 2資格   │ │ 5資格   │                │
│  └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐                                       │
│  │安全・衛生│                                       │
│  │ 6資格   │                                        │
│  └─────────┘                                       │
└─────────────────────────────────────────────────────┘
```

### 5.3 試験モード画面設計

```
┌─────────────────────────────────────────────────────┐
│ 🕐 残り時間: 01:45:30   問題: 15/50   正答: 12/14   │
│ ████████████████████░░░░░░░░░░░░░░ 30%              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  問15. 図のような回路において、端子a-b間の           │
│  合成抵抗[Ω]は。                                    │
│                                                     │
│  ┌─────────────────────┐                            │
│  │   [回路図の画像]      │                            │
│  └─────────────────────┘                            │
│                                                     │
│  ○ ア. 2Ω                                          │
│  ● イ. 4Ω                                          │
│  ○ ウ. 6Ω                                          │
│  ○ エ. 8Ω                                          │
│                                                     │
│  ┌────┐ ┌────┐ ┌──────┐ ┌──────┐                  │
│  │ 前へ │ │ 次へ │ │ 🔖保存 │ │ 後で見る │             │
│  └────┘ └────┘ └──────┘ └──────┘                  │
│                                                     │
│  問題一覧:                                           │
│  [1✓][2✓][3✗][4✓]...[14✓][15●][16○]...[50○]     │
└─────────────────────────────────────────────────────┘
```

### 5.4 デザインシステム

```css
/* カラーパレット */
:root {
  /* プライマリ（電気をイメージする青〜シアン） */
  --primary-50: #e0f7fa;
  --primary-100: #b2ebf2;
  --primary-500: #00bcd4;
  --primary-700: #0097a7;
  --primary-900: #006064;
  
  /* アクセント（エネルギーをイメージするオレンジ〜アンバー） */
  --accent-500: #ff9800;
  --accent-700: #f57c00;
  
  /* 正解・不正解 */
  --success: #4caf50;
  --error: #f44336;
  --warning: #ff9800;
  
  /* ダークモード対応 */
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  
  /* グラスモーフィズム */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* ダークモード基本 */
body {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  min-height: 100vh;
}

/* カードデザイン（グラスモーフィズム） */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 188, 212, 0.15);
}
```

### 5.5 アニメーション要件

```
必須アニメーション:
  1. ページ遷移: Framer Motion の AnimatePresence でフェード＋スライド
  2. 正解時: 緑色の光るパルスエフェクト + チェックマークアニメ
  3. 不正解時: 赤色の軽いシェイク + ✕マークアニメ
  4. 進捗バー: スムーズなフィルアニメーション
  5. タイマー: 残り10分で赤く点滅、残り5分でパルス強化
  6. カード: ホバー時に浮き上がりエフェクト
  7. スコア更新: カウントアップアニメーション
  8. ストリーク: 連続正解で虹色のボーダーエフェクト
  9. ローディング: スケルトンスクリーン（Shimmerエフェクト）
  10. モーダル: バウンドイン / フェードアウト
```

---

## 6. 試験モード（タイマー機能）詳細仕様

### 6.1 試験設定

```typescript
interface ExamConfig {
  qualificationId: string;
  subjectId?: string;        // 科目指定（省略時は全科目）
  year?: number;             // 年度指定（省略時はランダム）
  
  // タイマー設定
  timeLimit: number;         // 制限時間（秒）
  warningThreshold: number;  // 警告表示の残り時間（秒）
  criticalThreshold: number; // 危険表示の残り時間（秒）
  
  // 出題設定
  questionCount: number;     // 出題数
  shuffleQuestions: boolean; // 問題順シャッフル
  shuffleChoices: boolean;   // 選択肢シャッフル
  
  // モード
  mode: 'exam' | 'practice' | 'weak-review' | 'random';
}
```

### 6.2 資格ごとの実際の試験時間設定

```yaml
試験時間マッピング:
  第二種電気工事士_筆記: 120分 / 50問
  第一種電気工事士_筆記: 140分 / 50問
  電験三種_理論: 90分 / 20問（A問題14+B問題6）
  電験三種_電力: 90分 / 20問
  電験三種_機械: 90分 / 20問
  電験三種_法規: 65分 / 20問
  電験二種_一次各科目: 90分
  電験二種_二次各科目: 120分
  電験一種_一次各科目: 90分
  電験一種_二次各科目: 120分
  2級施工管理_一次: 130分 / 64問
  1級施工管理_一次: 午前150分+午後60分 / 92問
  工事担任者_各科目: 40〜80分（科目による）
  消防設備士_甲種: 195分
  消防設備士_乙種: 105分
  エネルギー管理士_各科目: 80分
```

### 6.3 タイマーUI仕様

```typescript
// タイマーの視覚的表現
interface TimerDisplay {
  // 通常時（残り50%以上）
  normal: {
    color: '#00bcd4';          // シアン
    animation: 'none';
    fontSize: '1.5rem';
  };
  
  // 警告時（残り25%〜50%）
  warning: {
    color: '#ff9800';          // オレンジ
    animation: 'pulse 2s ease-in-out infinite';
    fontSize: '1.5rem';
  };
  
  // 危険時（残り10%以下）
  critical: {
    color: '#f44336';          // 赤
    animation: 'pulse 0.5s ease-in-out infinite';
    fontSize: '1.8rem';
    soundAlert: true;          // ビープ音（設定でOFF可能）
  };
  
  // 時間切れ
  expired: {
    color: '#f44336';
    text: '時間切れ';
    autoSubmit: true;          // 自動提出
  };
}
```

---

## 7. 解説機能の詳細仕様

### 7.1 解説表示の要件

```
解説に含めるべき要素:
  1. 正解と正解理由の明示
  2. 各選択肢がなぜ正解/不正解かの説明
  3. 関連する法令・規格の引用（該当する場合）
  4. 計算問題の場合：ステップバイステップの計算過程
  5. 図解・画像（回路図、ベクトル図、配線図、機器写真など）
  6. 覚えるべきポイントのハイライト
  7. 関連問題へのリンク
  8. 参考サイトへのリンク

画像が必要な問題の例:
  - 回路図の問題 → 回路図 + 等価回路の画像
  - 配線図の問題 → 配線図 + 各記号の説明画像
  - 機器の識別問題 → 機器の写真
  - ベクトル図の問題 → ベクトル図の画像
  - 計算問題 → 計算過程を図示した画像

画像が不要な問題の例:
  - 単純な暗記問題（法令の数値、用語の定義）
  - テキストのみで理解可能な問題
```

### 7.2 数式レンダリング

```
KaTeX を使用して LaTeX 数式をレンダリング:

対応すべき数式例:
  - オームの法則: V = IR
  - 電力: P = VI = I²R = V²/R
  - インピーダンス: Z = √(R² + (XL - XC)²)
  - 三相電力: P = √3 × VL × IL × cosφ
  - 変圧器: V₁/V₂ = N₁/N₂
  - デシベル: dB = 20 log₁₀(V₁/V₂)
```

---

## 8. レスポンシブデザイン

```css
/* ブレークポイント */
--mobile: 320px - 767px;     /* スマートフォン */
--tablet: 768px - 1023px;    /* タブレット */
--desktop: 1024px - 1439px;  /* デスクトップ */
--wide: 1440px+;             /* ワイドスクリーン */

/* モバイルファーストで設計 */
/* スマホでの操作性を最優先（通勤中の学習を想定） */
```

### モバイル対応の重要ポイント
```
1. タッチターゲット: 最小44px × 44px
2. 選択肢: タップしやすい大きなボタン
3. スワイプ: 左右スワイプで前後の問題に移動
4. 画像: ピンチズームで拡大可能
5. タイマー: 画面上部に固定表示
6. オフライン: ServiceWorkerで問題をキャッシュ
```

---

## 9. パフォーマンス要件

```yaml
Core Web Vitals目標:
  LCP: < 2.5秒
  FID: < 100ms
  CLS: < 0.1

最適化手法:
  - 画像: WebP形式、遅延読み込み、適切なサイズ指定
  - コード: Tree shaking、コード分割、動的インポート
  - フォント: サブセット化されたGoogle Fonts（Noto Sans JP）
  - キャッシュ: Service Worker によるオフライン対応
  - SSG: 問題ページは静的生成（ISR対応）
  - バンドル: gzip/brotli圧縮
```

---

## 10. SEO・アクセシビリティ

```yaml
SEO:
  - 各資格・年度ページに固有のtitle・description
  - 構造化データ（JSON-LD）: FAQPage, BreadcrumbList
  - sitemap.xml 自動生成
  - robots.txt 設定
  - OGP / Twitter Card メタタグ

アクセシビリティ:
  - WCAG 2.1 AA準拠
  - キーボードナビゲーション完全対応
  - スクリーンリーダー対応（ARIA属性）
  - 色覚多様性対応（色だけに頼らないUI）
  - フォントサイズ変更対応
  - ハイコントラストモード
```

---

## 11. ディレクトリ構成

```
project-root/
├── public/
│   ├── images/
│   │   ├── questions/          # 問題画像
│   │   │   ├── A1/             # 資格IDごと
│   │   │   │   ├── 2024/
│   │   │   │   │   ├── Q01.webp
│   │   │   │   │   └── ...
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── explanations/       # 解説画像
│   │   ├── icons/              # アイコン
│   │   └── og/                 # OGP画像
│   ├── favicon.ico
│   ├── manifest.json
│   └── sw.js                   # Service Worker
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # トップページ
│   │   ├── [qualificationId]/
│   │   │   ├── page.tsx        # 資格詳細
│   │   │   └── [year]/
│   │   │       └── page.tsx    # 年度別問題
│   │   ├── exam/
│   │   │   └── [qualificationId]/
│   │   │       └── page.tsx    # 試験モード
│   │   ├── practice/
│   │   │   └── [qualificationId]/
│   │   │       └── page.tsx    # 練習モード
│   │   ├── weak-points/
│   │   │   └── page.tsx
│   │   ├── bookmarks/
│   │   │   └── page.tsx
│   │   ├── stats/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── questions/
│   │       ├── progress/
│   │       └── stats/
│   │
│   ├── components/
│   │   ├── ui/                 # 汎用UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ...
│   │   ├── layout/             # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── exam/               # 試験関連コンポーネント
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── ChoiceList.tsx
│   │   │   ├── ExamTimer.tsx
│   │   │   ├── QuestionNavigator.tsx
│   │   │   ├── ResultSummary.tsx
│   │   │   └── ExplanationPanel.tsx
│   │   ├── dashboard/          # ダッシュボード
│   │   │   ├── StatsOverview.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── QualificationGrid.tsx
│   │   └── common/
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       └── Breadcrumb.tsx
│   │
│   ├── data/                   # 過去問データ（JSON）
│   │   ├── qualifications.ts   # 資格マスタ
│   │   ├── questions/
│   │   │   ├── A1/             # 資格IDごとのディレクトリ
│   │   │   │   ├── 2024.json
│   │   │   │   ├── 2023.json
│   │   │   │   └── ...
│   │   │   ├── B1/
│   │   │   ├── C1/
│   │   │   └── ...
│   │   └── exam-configs.ts     # 試験設定マスタ
│   │
│   ├── hooks/                  # カスタムフック
│   │   ├── useTimer.ts
│   │   ├── useProgress.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useFingerprint.ts
│   │   ├── useExam.ts
│   │   └── useSearch.ts
│   │
│   ├── stores/                 # Zustand ストア
│   │   ├── examStore.ts
│   │   ├── progressStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── lib/                    # ユーティリティ
│   │   ├── storage.ts          # localStorage/IndexedDB管理
│   │   ├── fingerprint.ts      # ブラウザフィンガープリント
│   │   ├── analytics.ts        # 学習分析ロジック
│   │   ├── security.ts         # セキュリティユーティリティ
│   │   └── constants.ts        # 定数定義
│   │
│   ├── types/                  # TypeScript型定義
│   │   ├── question.ts
│   │   ├── progress.ts
│   │   ├── exam.ts
│   │   └── user.ts
│   │
│   └── styles/                 # グローバルスタイル
│       ├── globals.css
│       ├── animations.css
│       └── themes.css
│
├── prisma/
│   └── schema.prisma
│
├── scripts/
│   ├── scrape-questions.ts     # 過去問スクレイピング
│   ├── validate-data.ts        # データバリデーション
│   └── generate-images.ts      # 解説画像生成
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 12. 過去問データ作成の優先順位

```
Phase 1（MVP - 最も需要が高い資格）:
  1. 第二種電気工事士（過去10年分）
  2. 電験三種（過去10年分）
  3. 第一種電気工事士（過去10年分）

Phase 2（需要中〜高):
  4. 2級電気工事施工管理技士（過去5年分）
  5. 1級電気工事施工管理技士（過去5年分）
  6. 消防設備士 乙種4類・甲種4類（過去5年分）
  7. エネルギー管理士（過去5年分）

Phase 3（需要中):
  8. 電験二種（過去5年分）
  9. 工事担任者 全種（過去5年分）
  10. 消防設備士 その他類（過去5年分）

Phase 4（需要低〜中):
  11. 電験一種（過去5年分）
  12. 電気通信主任技術者（過去5年分）
  13. 計装士（過去5年分）
  14. その他安全衛生系資格

各フェーズの収録問題数の目安:
  Phase 1: 約3,000問
  Phase 2: 約2,000問
  Phase 3: 約2,000問
  Phase 4: 約1,000問
  合計: 約8,000問以上
```

---

## 13. 実装時の注意事項

```
1. 著作権への配慮:
   - 過去問は公表された試験問題（著作権法第36条の適用）
   - 解説は独自に作成すること
   - 画像引用時は出典を必ず明記
   - 参考サイトのコンテンツをそのままコピーしない

2. データの正確性:
   - 正解は公式解答を基準とする
   - 法令改正による問題の有効/無効を表示
   - 「この問題は法令改正により現在の正解と異なる可能性があります」の注記

3. パフォーマンス:
   - 8,000問以上のデータを効率的に管理
   - ページネーション・仮想スクロール
   - 画像の遅延読み込み

4. エラーハンドリング:
   - オフライン時のフォールバック
   - データ読み込みエラー時のリトライ
   - localStorage容量超過時の対応

5. テスト:
   - ユニットテスト（Jest + React Testing Library）
   - E2Eテスト（Playwright）
   - アクセシビリティテスト（axe-core）
   - パフォーマンステスト（Lighthouse CI）
```

---

## 14. 追加機能（実装推奨）

```yaml
学習支援機能:
  - 間隔反復学習（SRS）アルゴリズム
  - AIによる弱点分析と推奨問題提示
  - 学習カレンダー（GitHub風のヒートマップ）
  - 目標設定と達成度トラッキング
  - 学習時間のグラフ化

ソーシャル機能（登録不要の範囲で）:
  - 各問題の正答率表示（匿名統計）
  - 「この問題を間違えた人が多い」バッジ

その他:
  - PWA対応（ホーム画面に追加）
  - ダークモード / ライトモード切り替え
  - フォントサイズ調整
  - 問題の印刷機能
  - CSV/PDFエクスポート（成績表）
  - 年度ごとの合格ライン表示
  - 学習メモ機能（各問題にメモを残せる）
```

---

## 15. デプロイ・運用

```yaml
開発環境:
  Node.js: 20.x LTS
  npm: 10.x
  エディタ: VS Code（推奨拡張機能リスト付き）

デプロイ先:
  推奨: Vercel（Next.jsとの親和性）
  代替: AWS (EC2 + CloudFront) or VPS (nginx + Let's Encrypt)

CI/CD:
  - GitHub Actions
  - main ブランチへのpushで自動デプロイ
  - PRごとにプレビューデプロイ
  - Lighthouse CIでパフォーマンス監視

監視:
  - Vercel Analytics
  - エラー追跡: Sentry
  - アップタイム監視: UptimeRobot
```

---

## 16. 実装の進め方（Claude Code への指示順序）

```
Step 1: プロジェクト初期化
  → Next.js + TypeScript + Tailwind CSS のセットアップ
  → ESLint + Prettier 設定
  → ディレクトリ構成の作成

Step 2: デザインシステム構築
  → グローバルCSS（カラー、タイポグラフィ、アニメーション）
  → 共通UIコンポーネント（Button, Card, Modal, Timer, ProgressBar）

Step 3: データ層の構築
  → 資格マスタデータの作成
  → 問題データのスキーマ定義
  → localStorage / IndexedDB の管理ユーティリティ
  → ブラウザフィンガープリント実装

Step 4: Phase 1 の過去問データ作成
  → 第二種電気工事士の過去問収集・構造化（最低直近3年分）
  → 電験三種の過去問収集・構造化（最低直近3年分）
  → 第一種電気工事士の過去問収集・構造化（最低直近3年分）

Step 5: コアページの実装
  → トップページ（ダッシュボード）
  → 資格一覧・詳細ページ
  → 練習モード（1問ずつ解説付き）
  → 試験モード（タイマー付き）

Step 6: 進捗管理機能
  → 進捗の保存・読み込み
  → 「続きから再開」機能
  → 苦手問題・ブックマーク
  → 統計ダッシュボード

Step 7: セキュリティ実装
  → HTTPS設定
  → セキュリティヘッダー
  → CSP設定
  → 入力サニタイズ

Step 8: PWA・パフォーマンス最適化
  → Service Worker
  → 画像最適化
  → コード分割
  → キャッシュ戦略

Step 9: テスト・品質保証
  → ユニットテスト
  → E2Eテスト
  → アクセシビリティテスト
  → パフォーマンステスト

Step 10: Phase 2〜4 のデータ追加
  → 残りの資格の過去問を順次追加
```

---

## 17. 品質チェックリスト

```
□ 全26資格がトップページに表示される
□ 各資格で最低1年分の過去問が解ける
□ 試験モードでタイマーが正常動作する
□ 時間切れ時に自動提出される
□ 正解・不正解の判定が正確
□ 解説が表示される（画像付き）
□ 進捗がlocalStorageに保存される
□ ブラウザを閉じて再度開いても進捗が復元される
□ 「続きから再開」が正常動作する
□ 苦手問題リストが正しく更新される
□ ブックマーク機能が動作する
□ 統計ダッシュボードにグラフが表示される
□ モバイルで正常に表示・操作できる
□ ダークモード/ライトモードが切り替わる
□ HTTPS で配信される
□ セキュリティヘッダーが正しく設定される
□ Lighthouse スコア 90点以上（全カテゴリ）
□ 数式がKaTeXで正しくレンダリングされる
□ 画像がWebP形式で最適化されている
□ Service Workerでオフライン対応している
□ 404ページが適切に表示される
□ ローディング状態が表示される
□ エラー発生時にユーザーフレンドリーなメッセージが出る
□ キーボードのみで全機能操作可能
□ 出典が適切に記載されている
```

---

> **この指示書に従い、Phase 1 の3資格（第二種電気工事士・電験三種・第一種電気工事士）を優先して実装を開始してください。まずStep 1〜3の基盤構築から着手し、動作確認可能な状態を目指してください。**
