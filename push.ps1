# push.ps1 - 変更をGitHubに保存する
cd "C:\Users\0190\shared"
git add -A
$msg = Read-Host "メモを入力（Enterでスキップ）"
if ($msg -eq "") { $msg = "作業保存 $(Get-Date -Format 'yyyy/MM/dd HH:mm')" }
git commit -m $msg
git push
Write-Host "GitHubに保存しました！" -ForegroundColor Green
