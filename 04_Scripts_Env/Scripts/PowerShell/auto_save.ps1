$RepoPath = "C:\Users\0190\shared"
$LogFile  = "$RepoPath\auto_save_log.txt"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] $Message"
}

try {
    if (-not (Test-Path $RepoPath)) { exit 1 }
    Set-Location $RepoPath
    
    # 変更があるかチェック
    $status = git status --porcelain 2>&1
    if (-not $status) {
        Write-Log "変更なし - スキップ"
        exit 0
    }
    
    Write-Log "===== 自動保存開始 ====="
    
    # まずpull（コンフリクト防止）
    git pull --rebase origin main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: git pull 失敗"
        exit 1
    }
    
    # add/commit/push
    git add -A 2>&1 | Out-Null
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    git commit -m "auto-save from $env:COMPUTERNAME at $timestamp" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        git push origin main 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "自動保存成功"
        } else {
            Write-Log "ERROR: git push 失敗"
        }
    }
    
} catch {
    Write-Log "EXCEPTION: $($_.Exception.Message)"
}
