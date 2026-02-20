# GitHub自動同期セットアップ手順

## 新しいPCでの初回セットアップ

PowerShellを開いて以下を貼り付けるだけ：

```powershell
irm https://raw.githubusercontent.com/foru1215/shared/main/first_time_setup.bat -OutFile "$env:TEMP\first_time_setup.bat"; Start-Process "$env:TEMP\first_time_setup.bat"
```

これだけで以下が全自動で実行されます：
1. Gitが未インストールならダウンロードページを案内
2. Gitのユーザー名・メール設定
3. リポジトリをclone
4. 起動時 + 1時間ごと + シャットダウン時の自動同期タスク登録
5. デスクトップにpushショートカット作成

---

## 既にclone済みのPCで同期設定だけ追加する場合

`setup_sync.bat` をダブルクリック

---

## 同期タイミング

| タイミング | タスク名 | 動作 |
|---|---|---|
| PC起動（ログオン） | SharedRepo_StartupPull | pull + push |
| 1時間ごと | 同上（繰り返し） | pull + push |
| シャットダウン/再起動 | SharedRepo_ShutdownPush | pull + push |
| 手動（デスクトップのpush） | - | メモ付き commit + push |

---

## 確認方法

```powershell
# 登録済みタスクの確認
Get-ScheduledTask -TaskName "SharedRepo_*" | Format-Table TaskName, State

# 最終実行結果の確認（0=成功）
Get-ScheduledTaskInfo -TaskName "SharedRepo_StartupPull" | Format-List LastRunTime, LastTaskResult
Get-ScheduledTaskInfo -TaskName "SharedRepo_ShutdownPush" | Format-List LastRunTime, LastTaskResult

# 同期ログの確認
Get-Content C:\Users\0190\shared\auto_save_log.txt -Tail 20
```
