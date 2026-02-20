@echo off
REM ============================================
REM  GitHub自動同期 セットアップ（ダブルクリックで実行）
REM  - 起動時 + 1時間ごと同期
REM  - シャットダウン時同期
REM  - デスクトップにpushショートカット作成
REM ============================================

echo.
echo === GitHub自動同期セットアップ ===
echo.

REM 管理者権限チェック
net session >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 管理者権限で再起動します...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

REM リポジトリのパスを自動検出（このbatファイルがある場所）
set REPO_DIR=%~dp0
set REPO_DIR=%REPO_DIR:~0,-1%

echo リポジトリ: %REPO_DIR%
echo.

REM --- 1. 起動時 + 1時間ごとの同期タスク ---
echo [1/3] 起動時 + 1時間ごとの同期タスクを登録中...
powershell -ExecutionPolicy Bypass -Command ^
  "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"%REPO_DIR%\auto_save.ps1\"'; ^
   $trigger = New-ScheduledTaskTrigger -AtLogOn; ^
   $trigger.Repetition = (New-ScheduledTaskTrigger -Once -At '00:00' -RepetitionInterval (New-TimeSpan -Hours 1)).Repetition; ^
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5) -StartWhenAvailable; ^
   Register-ScheduledTask -TaskName 'SharedRepo_StartupPull' -Action $action -Trigger $trigger -Settings $settings -Description 'Startup and hourly sync for shared repo' -Force"
if %ERRORLEVEL% equ 0 (echo    OK) else (echo    失敗 - 手動で設定してください)

REM --- 2. シャットダウン時の同期タスク ---
echo [2/3] シャットダウン時の同期タスクを登録中...
powershell -ExecutionPolicy Bypass -Command ^
  "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"%REPO_DIR%\auto_save.ps1\"'; ^
   $class = Get-CimClass -ClassName MSFT_TaskEventTrigger -Namespace Root/Microsoft/Windows/TaskScheduler; ^
   $trigger = New-CimInstance -CimClass $class -ClientOnly; ^
   $trigger.Subscription = '<QueryList><Query Id=\"0\" Path=\"System\"><Select Path=\"System\">*[System[Provider[@Name=\"User32\"] and EventID=1074]]</Select></Query></QueryList>'; ^
   $trigger.Enabled = $true; ^
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5); ^
   Register-ScheduledTask -TaskName 'SharedRepo_ShutdownPush' -Action $action -Trigger $trigger -Settings $settings -Description 'Shutdown sync for shared repo' -Force"
if %ERRORLEVEL% equ 0 (echo    OK) else (echo    失敗 - 手動で設定してください)

REM --- 3. デスクトップにpushショートカット作成 ---
echo [3/3] デスクトップにpushショートカットを作成中...
powershell -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $s = $ws.CreateShortcut(\"$env:USERPROFILE\Desktop\push.lnk\"); ^
   $s.TargetPath = 'powershell.exe'; ^
   $s.Arguments = '-ExecutionPolicy Bypass -File \"%REPO_DIR%\push.ps1\"'; ^
   $s.WorkingDirectory = '%REPO_DIR%'; ^
   $s.IconLocation = 'powershell.exe,0'; ^
   $s.Description = 'GitHubに保存'; ^
   $s.Save()"
if %ERRORLEVEL% equ 0 (echo    OK) else (echo    失敗)

echo.
echo === セットアップ完了 ===
echo.
echo 確認:
powershell -Command "Get-ScheduledTask -TaskName 'SharedRepo_*' | Format-Table TaskName, State -AutoSize"
echo.
pause
