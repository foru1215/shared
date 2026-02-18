@echo off
REM PC終了時に自動実行されるスクリプト
cd /d C:\Users\0190\shared
git status --porcelain | findstr /r /c:"." >nul
if %ERRORLEVEL% equ 0 (
    git pull --rebase origin main >nul 2>&1
    git add -A >nul 2>&1
    git commit -m "auto-save on shutdown %COMPUTERNAME%" >nul 2>&1
    git push origin main >nul 2>&1
)
