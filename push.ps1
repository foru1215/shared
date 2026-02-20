cd "C:\Users\0190\shared"
git add -A -- . ":(exclude)nul"
$msg = Read-Host "memo"
if ($msg -eq "") { $msg = "save $(Get-Date -Format 'yyyy/MM/dd HH:mm')" }
git commit -m $msg
git push