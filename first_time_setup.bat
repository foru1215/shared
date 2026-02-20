@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ============================================
REM  初回セットアップ（新しいPCで最初に実行）
REM
REM  このファイルをUSBやダウンロードで持ち込んで
REM  ダブルクリックするだけでOK
REM ============================================

echo.
echo ========================================
echo   shared リポジトリ 初回セットアップ
echo ========================================
echo.

REM --- 管理者権限チェック ---
net session >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 管理者権限で再起動します...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

set REPO_URL=https://github.com/foru1215/shared.git
set REPO_DIR=C:\Users\%USERNAME%\shared

echo [確認] ユーザー名: %USERNAME%
echo [確認] インストール先: %REPO_DIR%
echo [確認] リポジトリ: %REPO_URL%
echo.

REM ============================================
REM  STEP 1: Git インストール
REM ============================================
echo === STEP 1/5: Git ===

where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo    Git は既にインストール済みです
    for /f "tokens=*" %%i in ('git --version') do echo    %%i
) else (
    echo    Git が見つかりません。インストールします...
    echo.
    echo    ブラウザでGitのダウンロードページを開きます。
    echo    インストーラーをダウンロードして実行してください。
    echo    設定は全てデフォルトのままでOKです。
    echo.
    start https://git-scm.com/download/win
    echo    Gitのインストールが完了したらEnterを押してください...
    pause >nul

    REM PATHを再読み込み
    set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"

    where git >nul 2>&1
    if !ERRORLEVEL! neq 0 (
        echo    [エラー] Gitが見つかりません。インストール後にこのスクリプトを再実行してください。
        pause
        exit /b 1
    )
    echo    Git インストール完了
)
echo.

REM ============================================
REM  STEP 2: Git ユーザー設定
REM ============================================
echo === STEP 2/5: Git ユーザー設定 ===

for /f "tokens=*" %%i in ('git config --global user.name 2^>nul') do set GIT_USER=%%i
if defined GIT_USER (
    echo    ユーザー名: %GIT_USER%（設定済み）
) else (
    set /p GIT_USER="    Git ユーザー名を入力: "
    git config --global user.name "!GIT_USER!"
)

for /f "tokens=*" %%i in ('git config --global user.email 2^>nul') do set GIT_EMAIL=%%i
if defined GIT_EMAIL (
    echo    メール: %GIT_EMAIL%（設定済み）
) else (
    set /p GIT_EMAIL="    Git メールアドレスを入力: "
    git config --global user.email "!GIT_EMAIL!"
)
echo.

REM ============================================
REM  STEP 3: リポジトリを clone
REM ============================================
echo === STEP 3/5: リポジトリ取得 ===

if exist "%REPO_DIR%\.git" (
    echo    リポジトリは既に存在します: %REPO_DIR%
    cd /d "%REPO_DIR%"
    git pull origin main
) else (
    echo    クローン中: %REPO_URL%
    echo.
    echo    ※ ブラウザが開いてGitHubのログインを求められたら
    echo      サインインしてください（初回のみ）
    echo.
    git clone %REPO_URL% "%REPO_DIR%"
    if !ERRORLEVEL! neq 0 (
        echo    [エラー] clone に失敗しました。
        echo    GitHubの認証を確認してください。
        pause
        exit /b 1
    )
)
echo    OK
echo.

REM ============================================
REM  STEP 4: 自動同期タスクを登録
REM ============================================
echo === STEP 4/5: 自動同期タスク登録 ===

echo    [4a] 起動時 + 1時間ごとの同期...
powershell -ExecutionPolicy Bypass -Command ^
  "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"%REPO_DIR%\auto_save.ps1\"'; ^
   $trigger = New-ScheduledTaskTrigger -AtLogOn; ^
   $trigger.Repetition = (New-ScheduledTaskTrigger -Once -At '00:00' -RepetitionInterval (New-TimeSpan -Hours 1)).Repetition; ^
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5) -StartWhenAvailable; ^
   Register-ScheduledTask -TaskName 'SharedRepo_StartupPull' -Action $action -Trigger $trigger -Settings $settings -Description 'Startup and hourly sync for shared repo' -Force | Out-Null; ^
   Write-Host '   OK'"

echo    [4b] シャットダウン時の同期...
powershell -ExecutionPolicy Bypass -Command ^
  "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"%REPO_DIR%\auto_save.ps1\"'; ^
   $class = Get-CimClass -ClassName MSFT_TaskEventTrigger -Namespace Root/Microsoft/Windows/TaskScheduler; ^
   $trigger = New-CimInstance -CimClass $class -ClientOnly; ^
   $trigger.Subscription = '<QueryList><Query Id=\"0\" Path=\"System\"><Select Path=\"System\">*[System[Provider[@Name=\"User32\"] and EventID=1074]]</Select></Query></QueryList>'; ^
   $trigger.Enabled = $true; ^
   $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5); ^
   Register-ScheduledTask -TaskName 'SharedRepo_ShutdownPush' -Action $action -Trigger $trigger -Settings $settings -Description 'Shutdown sync for shared repo' -Force | Out-Null; ^
   Write-Host '   OK'"
echo.

REM ============================================
REM  STEP 5: デスクトップにショートカット作成
REM ============================================
echo === STEP 5/5: ショートカット作成 ===

powershell -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $s = $ws.CreateShortcut(\"$env:USERPROFILE\Desktop\push.lnk\"); ^
   $s.TargetPath = 'powershell.exe'; ^
   $s.Arguments = '-ExecutionPolicy Bypass -File \"%REPO_DIR%\push.ps1\"'; ^
   $s.WorkingDirectory = '%REPO_DIR%'; ^
   $s.IconLocation = 'powershell.exe,0'; ^
   $s.Description = 'GitHubに保存'; ^
   $s.Save(); ^
   Write-Host '   push ショートカット: OK'"
echo.

REM ============================================
REM  完了
REM ============================================
echo ========================================
echo   セットアップ完了！
echo ========================================
echo.
echo   リポジトリ: %REPO_DIR%
echo.
echo   自動同期:
powershell -Command "Get-ScheduledTask -TaskName 'SharedRepo_*' 2>$null | Format-Table TaskName, State -AutoSize"
echo.
echo   使い方:
echo     - デスクトップの「push」で作業メモ付き保存
echo     - 自動同期は起動時/1時間ごと/シャットダウン時に実行
echo.
pause
