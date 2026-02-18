
# Define repositories to sync
$repos = @(
    "C:\Users\0190\shared"
)

foreach ($repo in $repos) {
    if (Test-Path $repo) {
        Write-Host "Syncing repository: $repo"
        Set-Location $repo
        
        # 1. Pull latest changes
        Write-Host "  Pulling..."
        git pull origin main
        
        # 2. Push local changes
        Write-Host "  Pushing..."
        git push origin main
    }
    else {
        Write-Host "Repository not found: $repo"
    }
}

# 3. Start the file watcher for shared
Set-Location "C:\Users\0190\shared"
Write-Host "Starting file watcher for shared..."
.\auto-push.ps1
