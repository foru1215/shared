$folder = "C:\Users\0190\shared"
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $folder
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

Write-Host "監視中... ファイルが変更されると自動でGitHubに保存されます"

while ($true) {
    $change = $watcher.WaitForChanged("All", 5000)
    if (-not $change.TimedOut) {
        Start-Sleep -Seconds 2
        Set-Location $folder
        git add .
        $msg = "自動保存: " + (Get-Date -Format "yyyy/MM/dd HH:mm:ss")
        git commit -m $msg
        git push
        Write-Host "GitHubに保存しました: $msg"
    }
}
