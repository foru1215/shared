# PC起動時に実行: 最新状態をGitHubから取得する
$repo = "C:\Users\0190\shared"

if (Test-Path $repo) {
    Set-Location $repo
    git pull origin main
}
