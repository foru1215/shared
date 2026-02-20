# 起動時 + 1時間ごとの定期同期タスクを登録
$taskName = "SharedRepo_StartupPull"
$scriptPath = "C:\Users\0190\shared\auto_save.ps1"

# 既存タスクを削除
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

# ログオン時トリガー + 1時間ごとに繰り返し
$trigger = New-ScheduledTaskTrigger -AtLogOn
$trigger.Repetition = (New-ScheduledTaskTrigger -Once -At "00:00" -RepetitionInterval (New-TimeSpan -Hours 1)).Repetition

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Startup and hourly sync for shared repo" `
    -Force

Write-Host "Done: '$taskName' registered (startup + every 1 hour)" -ForegroundColor Green
