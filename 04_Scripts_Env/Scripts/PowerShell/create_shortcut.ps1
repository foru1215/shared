
$WshShell = New-Object -comObject WScript.Shell
$StartupPath = [Environment]::GetFolderPath('Startup')
$ShortcutPath = Join-Path $StartupPath "SyncSharedRepo.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File c:\Users\0190\shared\04_Scripts_Env\Scripts\PowerShell\sync-on-startup.ps1"
$Shortcut.Save()
Write-Host "Shortcut created at: $ShortcutPath"
