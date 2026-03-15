# Codex タスク: Azure 関連 Issue 追加

## 概要

`data/project-seed.yaml` に Azure 関連の学習 Issue を4件追加し、
関連する既存 Issue の `inputs` と `dependencies` を更新する。
追加後は validate → pytest → audit → dry-run → apply まで一気通貫で実行する。

**目的**: 24か月計画（〜2028-03）に Azure 学習を組み込み、
転職市場で「制御 × AI × クラウド」の三角形を完成させる。

---

## 追加する Issue（4件）

既存 Issue は ISS-R04 まで（50件）。新規は **ISS-047〜ISS-050** とする。
seed 内の `issues:` リストにある ISS-R04 の**直前**に4件を挿入すること。

---

### ISS-047: AZ-900 Azure 基礎認定取得

```yaml
- id: ISS-047
  title: '[E-AI] 2026-05: AZ-900 Azure 基礎認定取得'
  body: Microsoft Learn の AZ-900 学習パスを完了し、Azure 基礎認定を取得する。
  epic: E-AI
  phase: phase-1
  labels:
  - area:ai
  - phase:practical-exam
  - priority:p1
  priority: p1
  milestone: M-2026-Q2
  due_date: '2026-07-04'
  recurring: false
  dependencies: []
  blocked_by: []
  evidence_type: Certification
  monthly_bucket: 2026-05
  quarter: 2026-Q2
  career_link: Azure 知識で DX 推進・制御×クラウド系ポジションへの応募資格が上がる
  ai_link: Azure AI / IoT Hub を後続 Issue で活用するための語彙基盤
  task_type: study
  work_steps:
  - Microsoft Learn の AZ-900 学習パスを全モジュール完了する（無料・約10時間）
  - 模擬試験を2周して合格点（700点以上）を確認する
  - ピアソン VUE で試験を予約して受験する
  deliverables:
  - AZ-900 認定証（Microsoft Credential ページ）
  evidence_to_keep:
  - 認定証の URL を Issue コメントに記録
  - 模擬試験スコア推移を Issue に記録
  dod:
  - AZ-900 試験に合格した
  - 認定証 URL が Issue に記録されている
  active_from: '2026-04-28'
  deferred_until: null
  exam_priority_guard: false
  review_note: レビュー時に完了モジュール数と模擬試験スコアを更新する。
  outcome: AZ-900 を取得し、Azure の基本語彙（VM / Storage / IoT Hub / IAM 等）が分かる状態。
  next_action: Microsoft Learn の AZ-900 学習パストップを開いて最初のモジュールを始める。
  why_this_matters: Azure 実務経験の土台 / 後続の IoT Hub・Defender for IoT 体験のベース
  device: PC
  inputs:
  - Microsoft Learn AZ-900 学習パス https://learn.microsoft.com/ja-jp/certifications/azure-fundamentals/
  - 「合格対策 Microsoft 認定 AZ-900 試験対策テキスト」（翔泳社）
  - Azure 無料アカウント https://azure.microsoft.com/ja-jp/free/
  things_to_make:
  - AZ-900 認定証
  completion_check:
  - Microsoft Learn の学習パスを全モジュール完了した
  - 模擬試験で合格点（700点以上）を2回確認した
  - AZ-900 試験に合格した
  daily_execution:
  - '朝30分: Microsoft Learn のモジュールを1つ進める'
  - '週末: 模擬試験1回分を解いてスコアを記録する'
  time_block: 平日 30分 + 週末 2時間（実技試験準備の隙間で進める）
  estimate: 5-8 sessions
  energy: Low
  focus: 認定取得 → クラウド基礎の語彙を身につける
```

---

### ISS-048: Azure IoT Hub 入門 + PLC シミュレータ接続デモ

```yaml
- id: ISS-048
  title: '[E-AI] 2026-09: Azure IoT Hub 入門 + PLC シミュレータ接続デモ'
  body: Azure IoT Hub 無料枠で仮想 PLC からデータを送受信するデモを作成する。
  epic: E-AI
  phase: phase-2
  labels:
  - area:ai
  - area:plc
  - phase:control-foundation
  - priority:p1
  priority: p1
  milestone: M-2026-Q3
  due_date: '2026-10-31'
  recurring: false
  dependencies:
  - ISS-020
  - ISS-047
  blocked_by: []
  evidence_type: Deliverable
  monthly_bucket: 2026-09
  quarter: 2026-Q3
  career_link: PLC × クラウド連携の実装経験として職務経歴書に書ける
  ai_link: Claude Code で IoT Hub データの可視化スクリプトを試作する
  task_type: ai
  work_steps:
  - Azure 無料アカウントで IoT Hub を作成する（F1 無料枠）
  - GX Simulator3 の仮想 PLC から MQTT でデータを送信する Python スクリプトを作る
  - IoT Hub でデータ受信を確認しスクリーンショットを記録する
  - Claude Code でデータを集計・可視化する簡単なスクリプトを試作する
  - 手順と成果物を GitHub に保存して Issue にリンクを記録する
  deliverables:
  - PLC → IoT Hub 接続スクリプト（Python）
  - 動作確認スクリーンショット
  evidence_to_keep:
  - GitHub リポジトリリンク
  - IoT Hub データ受信のスクリーンショット
  dod:
  - PLC シミュレータから IoT Hub へのデータ送信が動作確認済み
  - スクリプトが GitHub に保存されている
  - 手順が Issue に記録されている
  active_from: '2026-07-05'
  deferred_until: null
  exam_priority_guard: false
  review_note: レビュー時に接続状況・成果物の完成度・次の改善アイデアを更新する。
  outcome: GX Simulator3 から Azure IoT Hub へのデータ送信が動作し、制御×クラウド連携の実例1件が成果物として残る状態。
  next_action: Azure 無料アカウントを作成し、IoT Hub の作成チュートリアルの最初のステップを始める。
  why_this_matters: PLC + クラウドの実装経験は制御×DX 転職で直接アピールできる
  device: PC
  inputs:
  - Azure IoT Hub ドキュメント https://docs.microsoft.com/ja-jp/azure/iot-hub/
  - ISS-020〜024 の PLC シミュレータ環境（GX Works3 + GX Simulator3）
  - MQTT プロトコル入門（デバイス→クラウド通信の基礎）
  things_to_make:
  - PLC → IoT Hub 接続スクリプト（Python）
  - 動作確認ドキュメント
  completion_check:
  - Azure IoT Hub を作成しデバイス登録が完了している
  - PLC シミュレータからクラウドへのデータ受信が確認できている
  - 成果物が GitHub に保存されている
  daily_execution:
  - 'セッション1: Azure IoT Hub 作成 + デバイス登録'
  - 'セッション2: Python スクリプトでデータ送信テスト'
  - 'セッション3: 動作確認 + 記録 + GitHub プッシュ'
  time_block: 休日 2〜3時間 × 3回
  estimate: 3-5 sessions
  energy: Medium
  focus: PLC データをクラウドへ送る → 制御×IoT の原理を体験する
```

---

### ISS-049: Microsoft Defender for IoT 体験 + OT 環境評価ラボ

```yaml
- id: ISS-049
  title: '[E-SEC] 2027-01: Microsoft Defender for IoT 体験 + OT 環境評価ラボ'
  body: Defender for IoT 30日無料評価で OT 資産スキャンと推奨事項確認を体験する。
  epic: E-SEC
  phase: phase-3
  labels:
  - area:security
  - area:plc
  - phase:plc-growth
  - priority:p1
  priority: p1
  milestone: M-2027-Q1
  due_date: '2027-01-31'
  recurring: false
  dependencies:
  - ISS-044
  - ISS-045
  - ISS-048
  blocked_by: []
  evidence_type: Deliverable
  monthly_bucket: 2027-01
  quarter: 2027-Q1
  career_link: OT セキュリティツールの実装経験で制御 DX 系企業への差別化ポイントになる
  ai_link: Defender のアラートデータを Claude Code で分析するスクリプトを試作できる
  task_type: evidence
  work_steps:
  - Microsoft Defender for IoT の 30日無料評価を Azure ポータルで有効化する
  - ISS-048 で作成した IoT Hub に Defender for IoT を接続する
  - 仮想 OT ネットワーク（または IoT Hub のデバイス）をスキャンして資産検出を体験する
  - 検出されたアラート・推奨事項を ISS-045 のセキュリティチェックリストと照合する
  - 評価レポートと実務への適用アイデアを Issue に記録する
  deliverables:
  - Defender for IoT 評価レポート
  - ISS-045 チェックリストとの照合メモ
  evidence_to_keep:
  - 評価環境のスクリーンショット
  - 推奨事項レポートの PDF または Issue への記録
  dod:
  - Defender for IoT 評価環境が稼働した
  - OT 資産スキャン結果が Issue に記録されている
  - ISS-045 チェックリストとの照合メモが残っている
  active_from: '2026-11-01'
  deferred_until: null
  exam_priority_guard: false
  review_note: レビュー時に評価進捗・発見事項・実務への転用可能性を更新する。
  outcome: Defender for IoT を実際に動かし、OT セキュリティツールの概念が「動く経験」として残る状態。面接で「Defender for IoT で検証しました」と語れる状態。
  next_action: Microsoft Defender for IoT の製品ページを開き、30日無料評価の申込みフローを確認する。
  why_this_matters: OT セキュリティの実装経験は転職市場で希少価値が高い
  device: PC
  inputs:
  - Microsoft Defender for IoT 無料評価 https://azure.microsoft.com/ja-jp/products/defender-for-iot/
  - ISS-043〜044 の OT セキュリティノート（NIST SP 800-82 / CISA ICS 101）
  - ISS-045 のセキュリティチェックリスト（照合用）
  - ISS-048 の Azure IoT Hub 環境（接続ターゲット）
  things_to_make:
  - Defender for IoT 評価レポート
  - 実務適用メモ
  completion_check:
  - Defender for IoT 評価環境を構築した
  - OT 資産スキャンの結果が記録されている
  - 実務適用アイデアが Issue に記録されている
  daily_execution:
  - 'セッション1: 評価環境セットアップ + 初回スキャン'
  - 'セッション2: アラート確認 + ISS-045 チェックリスト照合'
  - 'セッション3: レポート作成 + 実務適用アイデア記録'
  time_block: 休日 3時間 × 2〜3回
  estimate: 3-5 sessions
  energy: High
  focus: OT セキュリティツールを実際に動かして理解する
```

---

### ISS-050: Azure AI Foundry で制御 × AI デモ統合

```yaml
- id: ISS-050
  title: '[E-AI] 2027-11: Azure AI Foundry で制御 × AI デモ統合'
  body: Azure AI Foundry に Claude をデプロイし、IoT Hub データ + OT セキュリティ観点を組み込んだ制御×AI デモを完成させる。
  epic: E-AI
  phase: phase-5
  labels:
  - area:ai
  - area:security
  - phase:ai-specialist
  - priority:p1
  priority: p1
  milestone: M-2027-Q4
  due_date: '2027-11-30'
  recurring: false
  dependencies:
  - ISS-034
  - ISS-035
  - ISS-048
  - ISS-049
  blocked_by: []
  evidence_type: Deliverable
  monthly_bucket: 2027-11
  quarter: 2027-Q4
  career_link: Azure AI + 制御 + OT セキュリティの三角形がポートフォリオの核になる
  ai_link: Azure AI Foundry で Claude をデプロイして制御データの AI 分析を実装する
  task_type: deliverable
  work_steps:
  - Azure AI Foundry で Claude（Anthropic）モデルをデプロイする
  - ISS-034〜035 の Claude Code 成果物を Azure 上で動かせる形にリファクタリングする
  - ISS-048 の IoT Hub データを AI で分析する簡単なデモを作成する
  - ISS-049 の OT セキュリティ観点チェックをデモに組み込む
  - GitHub に公開してポートフォリオリンクを Issue に記録する
  deliverables:
  - Azure AI Foundry 上の制御×AI 統合デモ
  - GitHub 公開リポジトリ
  evidence_to_keep:
  - GitHub 公開リポジトリリンク
  - Azure デプロイ画面のスクリーンショット
  dod:
  - Azure AI Foundry で Claude モデルが動作している
  - 制御×AI 統合デモが GitHub に公開されている
  - ポートフォリオリンクが Issue に記録されている
  active_from: '2027-10-01'
  deferred_until: null
  exam_priority_guard: false
  review_note: レビュー時に統合進捗・デモの完成度・ポートフォリオとしての訴求力を更新する。
  outcome: Azure AI Foundry + Claude Code + IoT Hub + OT セキュリティを組み合わせた制御×AI デモがポートフォリオとして公開された状態。
  next_action: Azure AI Foundry のページで Claude モデルのデプロイ手順を確認し、最初のモデル作成を始める。
  why_this_matters: Azure + Claude Code の両方を使える制御×AI エンジニアとしての差別化
  device: PC
  inputs:
  - Azure AI Foundry https://azure.microsoft.com/ja-jp/products/ai-foundry/
  - ISS-034〜035 の Claude Code による制御×AI 成果物
  - ISS-048 の Azure IoT Hub データパイプライン
  - ISS-049 の Defender for IoT 評価レポート（セキュリティ観点）
  things_to_make:
  - Azure AI Foundry 上の制御×AI デモ
  - 公開リポジトリ + README（ポートフォリオ用）
  completion_check:
  - Azure AI Foundry デプロイが完了した
  - 統合デモが動作確認済み
  - ポートフォリオ公開リンクが記録されている
  daily_execution:
  - 'セッション1: Azure AI Foundry セットアップ + Claude モデルデプロイ'
  - 'セッション2〜3: 既存成果物の統合 + IoT データ接続'
  - 'セッション4: デモ完成 + GitHub 公開 + ポートフォリオ更新'
  time_block: 休日 3時間 × 4〜5回
  estimate: 5-8 sessions
  energy: High
  focus: 既存の制御×AI 成果物を Azure AI Foundry でスケールしてポートフォリオ最終形にする
```

---

## 既存 Issue の更新（4件）

### ISS-020 の inputs に Azure IoT Hub への接続予告を追加

`inputs:` の末尾に以下を追加する（既存3行はそのまま）:

```yaml
  - Azure IoT Hub 無料枠ドキュメント（ISS-048 で利用）https://docs.microsoft.com/ja-jp/azure/iot-hub/
```

### ISS-034 の inputs に Azure AI Foundry を追加

`inputs:` の末尾に追加:

```yaml
  - Azure AI Foundry https://azure.microsoft.com/ja-jp/products/ai-foundry/（ISS-050 の基盤）
```

### ISS-035 の inputs に Azure AI Foundry を追加

`inputs:` の末尾に追加:

```yaml
  - Azure AI Foundry（ISS-050 で統合予定）
```

### ISS-045 の inputs に Defender for IoT への接続予告を追加

`inputs:` の末尾に追加:

```yaml
  - Microsoft Defender for IoT（ISS-049 で実際に使用）https://azure.microsoft.com/ja-jp/products/defender-for-iot/
```

---

## 挿入位置

`data/project-seed.yaml` 内の `issues:` リストにおいて、
`- id: ISS-R01` の**直前**に ISS-047〜ISS-050 を順番に挿入する。

---

## 検証・適用手順

以下を順番に実行し、すべてパスすることを確認する。

```bash
# 1. YAML バリデーション
python scripts/github_project_sync.py --validate
# 期待: FAIL 0 / WARN 0

# 2. ユニットテスト
python -m pytest -q
# 期待: 全件 passed

# 3. 監査
python scripts/github_project_sync.py --audit --today 2026-03-15
# 期待: FAIL 0 / WARN 0

# 4. dry-run（差分確認）
python scripts/github_project_sync.py \
  --today 2026-03-15 \
  --owner foru1215 \
  --repo shared-auto-sync \
  --project-owner foru1215
# 期待: issue update に ISS-047〜ISS-050 が含まれる

# 5. apply（GitHub 反映）
python scripts/github_project_sync.py --apply \
  --today 2026-03-15 \
  --owner foru1215 \
  --repo shared-auto-sync \
  --project-owner foru1215

# 6. 収束確認（re-dry-run）
python scripts/github_project_sync.py \
  --today 2026-03-15 \
  --owner foru1215 \
  --repo shared-auto-sync \
  --project-owner foru1215
# 期待: issue noop=89（85+4）
```

---

## 完了条件

- [ ] ISS-047〜ISS-050 が `data/project-seed.yaml` の `issues:` に追加されている
- [ ] ISS-020 / ISS-034 / ISS-035 / ISS-045 の `inputs:` が更新されている
- [ ] `--validate` → FAIL 0
- [ ] `pytest -q` → all passed
- [ ] `--audit` → FAIL 0
- [ ] GitHub に apply 後、re-dry-run で `issue noop=89`
- [ ] 変更を git commit して push

---

## 注意事項

- YAML の文字列に `: ` が含まれる場合は必ずシングルクォートで囲む
  例: `- 'GitHub Docs: Projects https://...'`
- `dod:` の各行は観測可能な完了基準を書く（「完了している」ではなく「〇〇が記録されている」）
- 新規 Issue の `active_from` は各フェーズの開始日に合わせる
- `exam_priority_guard: false` に設定する（資格試験 Issue ではないため）
