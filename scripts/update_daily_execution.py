# -*- coding: utf-8 -*-
"""Update daily_execution for all issues to 3-block weekday format.

Time blocks:
  朝 (6-7時 60分) / 昼 (30分) / 夕 (帰宅後 2h)
"""
import sys
import yaml

SEED_PATH = 'data/project-seed.yaml'

# ---------------------------------------------------------------------------
# Templates per task_type + energy
# ---------------------------------------------------------------------------
TEMPLATES = {
    # Regular exam study (problem-solving sessions)
    'exam_study': [
        u'朝 (6-7時 60分): 前日の誤問3つを確認 → 問題10問を解いてスコアを記録する',
        u'昼 (30分): 間違えた問題だけ再確認・Issue に正答率を更新する',
        u'夕 (帰宅後 2h): 誤答理由を分析 → 翌朝テスト対象を絞る → 追加1セット演習',
    ],
    # Exam day (actual exam)
    'exam_day': [
        u'朝 (6-7時 60分): 前日の誤問を確認 → 重点ポイント3つを最終チェックする',
        u'昼 (30分): 試験前ポイント確認（スマホメモ可）・会場移動・持ち物最終確認',
        u'夕 (試験後): 受験 → 終了後すぐに手応えと振り返りを Issue に記録する',
    ],
    # study / Medium: textbook or reference reading
    'study_medium': [
        u'朝 (6-7時 60分): 範囲確認・テキスト or 資料を読み込み、要点を手元にまとめる',
        u'昼 (30分): 重要ポイント1つをメモ・Issue コメントに中間記録を残す',
        u'夕 (帰宅後 2h): 図と実例を使ってノートに落とし込む → 面接に繋がる視点を3点書く',
    ],
    # study / Low: self-paced online module
    'study_low': [
        u'朝 (6-7時 60分): モジュールを1つ進める → 完了したらチェックボックスを記録する',
        u'昼 (30分): 要点1行メモ・Issue コメントに進捗を更新する',
        u'夕 (帰宅後 2h): 模擬試験 or 次のモジュールを2つ進め、スコアを記録する',
    ],
    # setup / Medium: tool / env setup
    'setup_medium': [
        u'朝 (6-7時 60分): 手順を読んで設定と動作確認を開始する',
        u'昼 (30分): 設定メモ・Issue コメントに途中経過を残す',
        u'夕 (帰宅後 2h): 設定を完了し動作確認 → 運用ログを Issue に記録する',
    ],
    # evidence / Medium: note / document creation
    'evidence_medium': [
        u'朝 (6-7時 60分): 対象資料と技術観点を整理して読み込む',
        u'昼 (30分): 面接で使える技術ポイント1つをメモ・Issue コメントに残す',
        u'夕 (帰宅後 2h): 技術説明ノートをまとめる → 職歴との接続点を Issue に記録する',
    ],
    # evidence / High: tool evaluation / assessment
    'evidence_high': [
        u'朝 (6-7時 60分): 評価範囲・観点・スコープを確認し今日のゴールを1行決める',
        u'昼 (30分): 作業ログ・スクリーンショットを整理・Issue コメントに中間記録',
        u'夕 (帰宅後 2h): セットアップ or 評価実施 or レポート作成 → 成果を Issue に記録',
    ],
    # ai / High: Claude Code deep sessions
    'ai_high': [
        u'朝 (6-7時 60分): 前回の成果物と評価観点を1箇所に整理し今日のゴールを決める',
        u'昼 (30分): Issue コメントに進捗メモを残す',
        u'夕 (帰宅後 2h): Claude Code でセッション実施 → 成果物と職歴接続点を Issue に残す',
    ],
    # ai / Medium: cloud + IoT implementation
    'ai_medium': [
        u'朝 (6-7時 60分): ドキュメントを確認し前日の続きを把握・今日のゴールを決める',
        u'昼 (30分): 進捗メモ・Issue コメントを更新する',
        u'夕 (帰宅後 2h): 実装・動作確認 → スクリプトを GitHub に保存し Issue に記録',
    ],
    # plc / High: GX Works3 hands-on
    'plc_high': [
        u'朝 (6-7時 60分): 仕様と入出力を読み込み・ラダー設計の要点を確認する',
        u'昼 (30分): 作業ログを Issue コメントに残す',
        u'夕 (帰宅後 2h): GX Works3 で実機操作 → 動作確認 → 学びと技術感想を Issue に記録',
    ],
    # deliverable / High: portfolio / demo creation
    'deliverable_high': [
        u'朝 (6-7時 60分): 成果物に必要な材料を整理し今日のゴールを1点決める',
        u'昼 (30分): 進捗確認・Issue コメントに中間記録を残す',
        u'夕 (帰宅後 2h): 実装 or 執筆を進める → 公開用の証跡・説明を Issue に記録する',
    ],
    # career / Medium: job hunting writing / prep
    'career_medium': [
        u'朝 (6-7時 60分): 材料を揃えて3点に絞り、今日書く内容を1行決める',
        u'昼 (30分): 面接想定質問に対するスケッチメモを更新する',
        u'夕 (帰宅後 2h): 具体的な1点を深掘りして書き上げ・再利用可能な形で Issue に残す',
    ],
}

# Exam day Issue IDs (actual exam taking day, not study)
EXAM_DAY_IDS = {'ISS-006', 'ISS-009', 'ISS-031'}

def get_template(issue_id: str, task_type: str, energy: str) -> list:
    if issue_id in EXAM_DAY_IDS:
        return TEMPLATES['exam_day']
    if task_type == 'exam':
        return TEMPLATES['exam_study']
    if task_type == 'study':
        if energy == 'Low':
            return TEMPLATES['study_low']
        return TEMPLATES['study_medium']
    if task_type == 'setup':
        return TEMPLATES['setup_medium']
    if task_type == 'evidence':
        if energy == 'High':
            return TEMPLATES['evidence_high']
        return TEMPLATES['evidence_medium']
    if task_type == 'ai':
        if energy == 'High':
            return TEMPLATES['ai_high']
        return TEMPLATES['ai_medium']
    if task_type == 'plc':
        return TEMPLATES['plc_high']
    if task_type == 'deliverable':
        return TEMPLATES['deliverable_high']
    if task_type == 'career':
        return TEMPLATES['career_medium']
    # fallback
    return TEMPLATES['study_medium']

def format_de_lines(items: list) -> list:
    """Convert a list of strings to YAML list lines with 2-space indent."""
    result = []
    for item in items:
        # Quote if item contains special characters that need quoting
        # Always use single-quoted style for consistency
        result.append(f"  - '{item}'\n")
    return result

def replace_daily_execution(lines: list, start_idx: int, new_items: list) -> list:
    """Replace the daily_execution block starting at start_idx.
    start_idx points to the '  daily_execution:' line.
    Returns updated lines list."""
    # Find the end of the daily_execution block (first non-'  - ' line after it)
    i = start_idx + 1
    while i < len(lines) and lines[i].startswith('  - '):
        i += 1
    # Replace lines[start_idx+1 : i] with new items
    new_de_lines = format_de_lines(new_items)
    return lines[:start_idx + 1] + new_de_lines + lines[i:]

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
with open(SEED_PATH, encoding='utf-8') as f:
    lines = f.readlines()

# Load YAML to get task_type and energy for each issue
seed = yaml.safe_load(open(SEED_PATH, encoding='utf-8'))
issue_meta = {}
for iss in seed['issues']:
    if not iss['id'].startswith('ISS-R'):
        issue_meta[iss['id']] = {
            'task_type': iss.get('task_type', 'study'),
            'energy': iss.get('energy', 'Medium'),
        }

print(f"Total non-recurring issues to update: {len(issue_meta)}")

# Process issues — iterate and do replacements one by one
# We must re-scan after each replacement because line indices shift
updated = list(lines)
total_replaced = 0

for issue_id, meta in issue_meta.items():
    task_type = meta['task_type']
    energy = meta['energy']
    new_items = get_template(issue_id, task_type, energy)

    # Find issue block and its daily_execution line
    in_issue = False
    de_line_idx = None
    for i, line in enumerate(updated):
        if line.strip() == f'- id: {issue_id}':
            in_issue = True
        elif line.strip().startswith('- id: ISS') and issue_id not in line and in_issue:
            in_issue = False
            break
        if in_issue and line.strip() == 'daily_execution:':
            de_line_idx = i
            break

    if de_line_idx is None:
        print(f"  WARNING: daily_execution not found for {issue_id}")
        continue

    updated = replace_daily_execution(updated, de_line_idx, new_items)
    total_replaced += 1

print(f"Replaced daily_execution for {total_replaced} issues")

with open(SEED_PATH, 'w', encoding='utf-8') as f:
    f.writelines(updated)

print("File written successfully.")

# Quick verify
with open(SEED_PATH, encoding='utf-8') as f:
    content = f.read()
block_count = content.count('朝 (6-7時')
print(f"'朝 (6-7時' occurrences: {block_count} (expected: {len(issue_meta)})")
