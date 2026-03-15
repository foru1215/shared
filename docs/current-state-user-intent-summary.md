# Current State / User Intent / Conversation Summary

## この文書の役割

この文書は、現時点での状況、ユーザーの希望、この会話で決まったこと、実装済みのこと、未解決のことを 1 本にまとめた引き継ぎ用メモです。

## 正本と前提

このリポジトリでは、次を正本として扱う。

- `data/project-seed.yaml`
- `docs/project-plan-summary.md`
- `docs/project-plan.md`

実装・同期・再同期は、必ず `project-seed.yaml` を最優先に読む。

## 現在のプロジェクト状態

`data/project-seed.yaml` の現状態は次のとおり。

- project: `Career Transition 24-Month Plan`
- owner / repo: `foru1215/shared-auto-sync`
- 期間: `2026-03-14` 〜 `2028-03-31`
- phases: `7`
- epics: `8`
- issues: `50`
- phase_cards: `7`
- win_conditions: `20`
- labels: `22`
- project_fields: `28`

現在の構造は、単なる issue 群ではなく、次の階層で運用する前提になっている。

1. Phase Card
2. Win Condition
3. Issue

## この会話の中で実装したこと

### 1. GitHub Projects 同期基盤

- `scripts/github_project_sync.py` を中心に、seed から GitHub Projects へ同期する基盤を実装
- dry-run / apply / 再 dry-run / audit / validate を実装
- idempotent で、再実行時に重複作成しないように調整
- marker / field mapping / status 計算 / issue 本文テンプレートを整備

### 2. seed の細粒度化

- 各 issue に `task_type`, `work_steps`, `deliverables`, `dod`, `completion_check`, `next_action`, `daily_execution` などを付与
- phase card と win condition を追加
- board 上で「今やること」と「今はやらないこと」が見える構造へ寄せた

### 3. OT / ICS セキュリティ最小トラック追加

- `E-SEC` を追加
- 次の issue を追加
  - `ISS-043`
  - `ISS-044`
  - `ISS-045`
  - `ISS-046`
- `area:security` を追加
- `Area` field に `Security` を追加
- `WC-007`, `WC-010`, `WC-015` に security 観点を織り込んだ

### 4. 補助ドキュメント整備

追加または更新した主要文書は次のとおり。

- `docs/claude-code-redesign-brief.md`
- `docs/claude-code-redesign-prompt.md`
- `docs/codex-implementation-prompt.md`
- `docs/project1-reference-notes.md`
- `docs/security-engineer-study-research.md`
- `docs/current-focus-guide.md`
- `docs/overall-roadmap.md`
- `docs/license-question-report-plan.md`

## 現時点の検証結果

確認済みの主な結果:

- `python scripts/github_project_sync.py --validate` : `FAIL 0 / WARN 0`
- `pytest -q` : `17 passed`
- `python scripts/github_project_sync.py --audit --today 2026-03-15` : `FAIL 0 / WARN 0`
- 本同期後の再 dry-run は収束済み

参照レポート:

- `data/sync-reports/latest_dry-run.md`
- `data/sync-reports/latest_apply.md`

## ユーザーの希望とこだわり

この会話から読み取れる、ユーザーの強い希望は次のとおり。

### 1. 正本重視

- `project-seed.yaml` を唯一の正本にしたい
- docs は補助参照でよい
- 実装は正本優先で壊れてほしくない

### 2. 品質重視

- ふんわりした計画ではなく、何をするかが具体的であってほしい
- 完了条件と完了チェックが明確であってほしい
- 再実行しても壊れないこと
- dry-run を先にやること
- 既存ファイルや既存運用を壊さないこと

### 3. 運用で迷わないこと

- 全体を見たときに「何をすればいいか」が一目で分かる形にしたい
- board を開いたら迷わず動けるようにしたい
- 今やることと後回しを分けたい

### 4. 試験主軸を崩さないこと

- `2026-04-27` までは第一種電気工事士 学科最優先
- `2026-04-28` 〜 `2026-07-04` は第一種電気工事士 実技最優先
- 電験三種は backlog / deferred
- AI は武器だが主役ではない時期を守りたい

### 5. 将来価値に統合したい

- 電気
- 制御
- 実務証拠
- AI
- 転職

これらをバラバラではなく、転職価値として 1 本につなげたい。

## ユーザーが不満を持った点

この会話の中で、ユーザーが明確に不満を示した点:

- 「具体的に何をするかまとめられてない」
- 「完了のチェックなど細部にこだわりが無く品質が低い」
- 「全体的に何やれば良いかわからない」

つまり、単に issue があるだけでは足りず、

- 何のための計画か
- phase ごとに何を作るのか
- 今どこにいるのか
- 何を終えたら次へ行けるのか

が分かる必要がある。

## その不満に対して追加した補助文書

### 全体像を把握する用

- `docs/overall-roadmap.md`

内容:

- この計画は何をするものか
- phase ごとに何を作るのか
- 最終的にどんな状態を作りたいのか

### 今何を見るか用

- `docs/current-focus-guide.md`

内容:

- 今の主役
- 今やらなくてよいもの
- 迷ったときの判断基準

### 資格勉強の問題数と報告運用

- `docs/license-question-report-plan.md`

内容:

- `2026-03-15` 〜 `2026-04-27` の問題数計画
- 週ごとの目標
- 日次報告テンプレート
- 週次報告テンプレート

## 資格勉強の現在の運用方針

現時点では、資格勉強については次の方針を置いている。

- 主役: 第一種電気工事士 学科
- 問題数目標: 合計 `960問`
- 日次報告: `ISS-001` と `ISS-005`
- 週次まとめ: `ISS-R01`

この期間は「全部やる」ではなく、次の 4 つだけを回す設計。

1. 問題を解く
2. 点数を記録する
3. 間違い理由を書く
4. 次に解き直す範囲を決める

## 通知 / automation の現状

### 朝通知 GitHub Actions ワークフロー

`2026-03-15` に次のワークフローを実装・プッシュ・動作確認済み。

- ファイル: `.github/workflows/morning-focus.yml`
- リポジトリ: `foru1215/shared-auto-sync`
- スケジュール: 毎日 22:00 UTC（= 07:00 JST）
- 動作: `[朝通知] YYYY-MM-DD（曜日）` という Issue を自動作成する

ワークフローの動作内容:

- REST API でオープン Issue を全件取得
- `[PHASE]` タイトル Issue から現 Phase Card を抽出
- `phase:written-exam` ラベルを持つ `[WIN]` Issue から Win Condition を抽出（最大 3 件）
- `priority:p0` + `phase:written-exam` の Issue を抽出（最大 5 件）
- 上記をまとめた朝確認 Issue を作成し、今日の記録テンプレートを付属させる

テスト結果:

- `2026-03-15` に手動トリガーで実行 → Issue #97 作成確認済み
- Phase Card `#65`、Win Condition `#72 #73 #74`、P0 Issues `#19 #20 #23 #24` が正しく抽出された

次回自動実行: `2026-03-16 07:00 JST`（22:00 UTC）

注意:

- GitHub Actions の default `GITHUB_TOKEN` は user-level Projects v2 GraphQL に非対応
- そのため Projects v2 クエリではなく REST Issues API で代替している
- 将来的に Projects v2 から Status を取得したい場合は `PROJECT_TOKEN` secret（`project` スコープ付き PAT）を追加すれば対応可能

## 会話の流れの要約

この会話は大きく次の流れで進んだ。

1. `project-seed.yaml` を正本とした GitHub Projects 同期基盤の実装
2. dry-run / apply / idempotent / audit / validate の整備
3. 実装品質への不満から、Claude Code 向けの再設計用文書を追加
4. Project 1 を参考に、phase card / win condition / outcome / next action を細粒度化
5. OT / ICS セキュリティ最小トラックの調査と計画追加
6. 「全体的に何をやればいいか分からない」という不満に対する全体ロードマップ整理
7. 資格勉強の問題数と報告方法の具体化
8. 旧 `life` 通知から `shared` 通知への切り替えとテスト

## 現時点で残っている課題

### 1. 体感としてまだ迷う可能性

構造と文書はかなり整備されたが、ユーザー本人の感覚として

- 本当に迷わず動けるか
- board の見え方が十分か

はまだ確認し切れていない。

### 2. さらなる簡略化の余地

必要なら次のような追加改善余地がある。

- 「今週の 3 件だけ」を表示する専用ドキュメント
- board の field をさらに簡略化
- phase ごとの運用ルールをもっと短文化

### 3. Projects v2 Status を朝通知に反映したい場合

現在の朝通知は Labels ベース（REST API）。
Projects v2 の `Status` フィールド（Todo / In Progress / Backlog 等）を朝通知に反映したい場合は:

1. `project` + `repo` スコープの PAT を発行する
2. `foru1215/shared-auto-sync` の Settings → Secrets → Actions に `PROJECT_TOKEN` として登録する
3. `.github/workflows/morning-focus.yml` の `github-token: ${{ secrets.GITHUB_TOKEN }}` を `${{ secrets.PROJECT_TOKEN }}` に変更してプッシュする

## いま他モデルや将来の自分に伝えるべきこと

最重要ポイントはこれ。

- この計画は `project-seed.yaml` が正本
- ユーザーは「実装したこと」より「何をすればいいかが明確か」を強く重視する
- 品質要求は高く、曖昧な完了条件を嫌う
- 今の主役は第一種電気工事士 学科
- セキュリティは OT / ICS の最小トラックとして追加済み
- 朝通知は `.github/workflows/morning-focus.yml` が本番（毎日 07:00 JST に `[朝通知]` Issue を作成）
- `validate: FAIL 0 / WARN 0`、`pytest: 17 passed`、`audit: FAIL 0 / WARN 0`、sync 収束済み（2026-03-15 確認）
- 全 project ファイルは `foru1215/shared-auto-sync` に commit・push 済み（2026-03-15）

## 直近のおすすめ確認順

次に見るなら、この順がよい。

1. `docs/overall-roadmap.md`
2. `docs/current-focus-guide.md`
3. `docs/license-question-report-plan.md`
4. `data/project-seed.yaml`
5. `data/sync-reports/latest_dry-run.md`
6. `data/sync-reports/latest_apply.md`
