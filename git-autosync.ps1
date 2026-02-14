# --- 2台目PC用設定 ---
$targetPath = "C:\Users\forui\my-app\shared"
cd $targetPath

Write-Host "Monitoring started: $targetPath"
Write-Host "Press Ctrl+C to stop."

while($true) {
    # 変更（新規、更新、削除）を確認
    $status = git status --short
    
    if ($status) {
        Write-Host "Changes detected. Syncing..."
        git add .
        git commit -m "Auto-sync from Laptop ($(Get-Date -Format 'yyyy/MM/dd HH:mm:ss'))"
        git push origin main
        Write-Host "Sync complete! ($(Get-Date -Format 'HH:mm:ss'))"
    }
    
    # 30秒ごとにチェック
    Start-Sleep -Seconds 30
}
