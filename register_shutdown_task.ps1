# シャットダウン時の自動同期タスクを登録するスクリプト
# 管理者権限不要（ユーザータスクとして登録）

$taskName = "SharedRepo_ShutdownPush"
$scriptPath = "C:\Users\0190\shared\auto_save.ps1"

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

# イベントトリガー: シャットダウン/再起動時（EventID 1074）
$class = Get-CimClass -ClassName MSFT_TaskEventTrigger -Namespace Root/Microsoft/Windows/TaskScheduler
$trigger = New-CimInstance -CimClass $class -ClientOnly
$trigger.Subscription = '<QueryList><Query Id="0" Path="System"><Select Path="System">*[System[Provider[@Name="User32"] and EventID=1074]]</Select></Query></QueryList>'
$trigger.Enabled = $true

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

Register-ScheduledTask -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Shutdown sync for shared repo" `
    -Force

Write-Host "タスク '$taskName' を登録しました！" -ForegroundColor Green
