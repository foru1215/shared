# -*- coding: utf-8 -*-
"""
Update daily_execution for all issues.
v2: Use each issue's own focus / work_steps / next_action / evidence_to_keep
    to generate SPECIFIC content rather than generic templates.

Rules:
  - Weekday issues  → 朝 (60min) / 昼 (30min) / 夕 (2h) 3-block
  - Weekend issues  → 土日 セッション 形式 (when time_block contains 週末 or 休日)
  - Exam day issues → special 受験当日 format (ISS-006, ISS-009, ISS-031)
"""
import sys
import re
import yaml

SEED_PATH = 'data/project-seed.yaml'

EXAM_DAY_IDS = {'ISS-006', 'ISS-009', 'ISS-031'}

def is_weekend_task(issue: dict) -> bool:
    """Return True only if the task has NO 平日 block (pure weekend/holiday sessions)."""
    tb = issue.get('time_block', '')
    # 平日 が含まれていれば平日3ブロックタスク（休日・週末が混在していても）
    if '\u5e73\u65e5' in tb:  # 平日
        return False
    # 純粋に週末・休日のみ → セッション形式
    return '\u9031\u672b' in tb or '\u4f11\u65e5' in tb  # 週末 or 休日

def trim(s: str, max_len: int = 60) -> str:
    """Trim a string to max_len characters."""
    s = s.strip().rstrip('。').rstrip('.')
    return s[:max_len] if len(s) > max_len else s

def first_work_step(issue: dict) -> str:
    steps = issue.get('work_steps', [])
    if steps:
        return trim(str(steps[0]), 55)
    return trim(issue.get('next_action', ''), 55)

def last_work_step(issue: dict) -> str:
    steps = issue.get('work_steps', [])
    if len(steps) >= 2:
        return trim(str(steps[-1]), 55)
    return trim(str(steps[0]), 55) if steps else ''

def middle_work_step(issue: dict) -> str:
    steps = issue.get('work_steps', [])
    if len(steps) >= 3:
        mid = len(steps) // 2
        return trim(str(steps[mid]), 55)
    if len(steps) == 2:
        return trim(str(steps[1]), 55)
    return ''

def first_evidence(issue: dict) -> str:
    ev = issue.get('evidence_to_keep', [])
    if ev:
        return trim(str(ev[0]), 55)
    return 'Issue コメントに成果を記録する'

def focus_text(issue: dict) -> str:
    f = issue.get('focus', '')
    return trim(str(f), 40) if f else '今日のゴールを1行決める'

def next_action_short(issue: dict) -> str:
    na = issue.get('next_action', '')
    return trim(str(na), 55) if na else 'Issue コメントに進捗を残す'

# ---------------------------------------------------------------------------
def build_daily_execution(issue: dict) -> list:
    issue_id = issue['id']
    task_type = issue.get('task_type', 'study')
    energy    = issue.get('energy', 'Medium')
    focus     = focus_text(issue)
    ws_first  = first_work_step(issue)
    ws_mid    = middle_work_step(issue)
    ws_last   = last_work_step(issue)
    evd       = first_evidence(issue)
    na        = next_action_short(issue)

    # ── 試験当日 ──────────────────────────────────────────────
    if issue_id in EXAM_DAY_IDS:
        return [
            u'朝 (6-7時 60分): 前日の誤問を確認 → 重点ポイント3つを最終チェックする',
            u'昼 (30分): 試験前ポイント確認（スマホメモ可）・会場移動・持ち物最終確認',
            u'夕 (試験後): 受験 → 終了後すぐに手応えと振り返りを Issue に記録する',
        ]

    # ── 週末・休日専用タスク ──────────────────────────────────
    if is_weekend_task(issue):
        steps = issue.get('work_steps', [])
        if len(steps) >= 3:
            s1 = trim(str(steps[0]), 60)
            s2 = trim(str(steps[len(steps)//2]), 60)
            s3 = trim(str(steps[-1]), 60)
        elif len(steps) == 2:
            s1 = trim(str(steps[0]), 60)
            s2 = trim(str(steps[1]), 60)
            s3 = f'{evd} を Issue に記録する'
        elif len(steps) == 1:
            s1 = trim(str(steps[0]), 60)
            s2 = f'{focus} を深掘りする'
            s3 = f'{evd} を Issue に記録する'
        else:
            s1 = ws_first or f'{focus} を開始する'
            s2 = f'{focus} を深掘りする'
            s3 = f'{evd} を Issue に記録する'
        return [
            f'土日 セッション1 (3h): {s1}',
            f'土日 セッション2 (3h): {s2}',
            f'土日 セッション3 (3h): {s3} → {evd}',
        ]

    # ── 平日3ブロック ─────────────────────────────────────────
    if task_type == 'exam':
        return [
            f'朝 (6-7時 60分): 【{focus}】前日の誤問3つを確認 → 問題10問を解いてスコアを記録する',
            u'昼 (30分): 間違えた問題だけ再確認・Issue に正答率と誤答トップ3を更新する',
            f'夕 (帰宅後 2h): 誤答理由を分析 → 翌朝テスト対象を絞る → {evd}',
        ]

    if task_type == 'study' and energy == 'Low':
        return [
            f'朝 (6-7時 60分): {ws_first}',
            f'昼 (30分): 完了したモジュールの要点を1行メモ → Issue コメントに進捗を更新する',
            f'夕 (帰宅後 2h): 模擬試験 1回分 or 次のモジュール2つを進める → {evd}',
        ]

    if task_type == 'study':
        return [
            f'朝 (6-7時 60分): 【{focus}】{ws_first}',
            f'昼 (30分): 重要ポイント1つをメモ・{na}',
            f'夕 (帰宅後 2h): 図と実例を使ってノートにまとめる → {evd}',
        ]

    if task_type == 'setup':
        return [
            f'朝 (6-7時 60分): 手順を読んで {ws_first}',
            f'昼 (30分): 設定メモ・途中経過を Issue コメントに残す',
            f'夕 (帰宅後 2h): {ws_last} → 動作確認 → {evd}',
        ]

    if task_type == 'evidence':
        if energy == 'High':
            return [
                f'朝 (6-7時 60分): 評価スコープを確認し {ws_first}',
                f'昼 (30分): スクリーンショット整理・作業ログを Issue コメントに残す',
                f'夕 (帰宅後 2h): {ws_last} → {evd}',
            ]
        return [
            f'朝 (6-7時 60分): 対象資料を読み込み 【{focus}】の観点を整理する',
            f'昼 (30分): 面接で使える技術ポイント1つをメモ・Issue コメントに残す',
            f'夕 (帰宅後 2h): {ws_last} → {evd}',
        ]

    if task_type == 'ai':
        return [
            f'朝 (6-7時 60分): 前回の成果物と 【{focus}】 の観点を確認し今日のゴールを決める',
            f'昼 (30分): {na}',
            f'夕 (帰宅後 2h): Claude Code でセッション実施 → {evd}',
        ]

    if task_type == 'plc':
        return [
            f'朝 (6-7時 60分): 仕様と入出力を読み込み 【{focus}】 のラダー設計を確認する',
            f'昼 (30分): 作業ログを Issue コメントに残す',
            f'夕 (帰宅後 2h): GX Works3 で {ws_last} → 動作確認 → {evd}',
        ]

    if task_type == 'deliverable':
        return [
            f'朝 (6-7時 60分): 成果物の材料を整理し 【{focus}】 の今日のゴールを1点決める',
            f'昼 (30分): 進捗確認・Issue コメントに中間記録を残す',
            f'夕 (帰宅後 2h): {ws_last} → {evd}',
        ]

    if task_type == 'career':
        return [
            f'朝 (6-7時 60分): 材料を揃えて3点に絞り 【{focus}】 今日書く内容を1行決める',
            f'昼 (30分): 面接想定質問のスケッチメモを更新する',
            f'夕 (帰宅後 2h): 具体的な1点を深掘りして書き上げる → {evd}',
        ]

    # fallback
    return [
        f'朝 (6-7時 60分): 【{focus}】{ws_first}',
        f'昼 (30分): {na}',
        f'夕 (帰宅後 2h): {ws_last or ws_first} → {evd}',
    ]

# ---------------------------------------------------------------------------
def format_de_lines(items: list) -> list:
    result = []
    for item in items:
        result.append(f"  - '{item}'\n")
    return result

def replace_daily_execution(lines: list, start_idx: int, new_items: list) -> list:
    i = start_idx + 1
    while i < len(lines) and lines[i].startswith('  - '):
        i += 1
    new_de_lines = format_de_lines(new_items)
    return lines[:start_idx + 1] + new_de_lines + lines[i:]

# ---------------------------------------------------------------------------
with open(SEED_PATH, encoding='utf-8') as f:
    lines = f.readlines()

seed = yaml.safe_load(open(SEED_PATH, encoding='utf-8'))

issue_map = {i['id']: i for i in seed['issues'] if not i['id'].startswith('ISS-R')}
print(f"Issues to update: {len(issue_map)}")

updated = list(lines)
total = 0

for issue_id, issue in issue_map.items():
    new_de = build_daily_execution(issue)

    in_issue = False
    de_idx = None
    for i, line in enumerate(updated):
        if line.strip() == f'- id: {issue_id}':
            in_issue = True
        elif line.strip().startswith('- id: ISS') and issue_id not in line and in_issue:
            in_issue = False
            break
        if in_issue and line.strip() == 'daily_execution:':
            de_idx = i
            break

    if de_idx is None:
        print(f"  WARN: no daily_execution found for {issue_id}")
        continue

    updated = replace_daily_execution(updated, de_idx, new_de)
    total += 1

print(f"Updated: {total} issues")

with open(SEED_PATH, 'w', encoding='utf-8') as f:
    f.writelines(updated)

print("Saved.")

# ── spot check ──
seed2 = yaml.safe_load(open(SEED_PATH, encoding='utf-8'))
check_ids = ['ISS-001', 'ISS-020', 'ISS-034', 'ISS-047', 'ISS-048']
for iss in seed2['issues']:
    if iss['id'] in check_ids:
        print(f"\n=== {iss['id']} ({iss.get('task_type')} / {iss.get('energy')}) ===")
        for line in iss.get('daily_execution', []):
            print(f"  {line}")
