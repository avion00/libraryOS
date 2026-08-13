# Starts the LibraryOS backend (Django, :8000) and frontend (Vite, :5173)
# together, each in its own PowerShell window so you can see live logs and
# stop them independently with Ctrl+C.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
# or just double-click start-dev.bat

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

function Test-PortInUse($port) {
    return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

$opened = 0

# --- Backend (Django) ---
if (Test-PortInUse 8000) {
    Write-Host "Backend already running on :8000 - skipping" -ForegroundColor Yellow
} else {
    Write-Host "Starting backend on :8000 ..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        "-NoExit", "-Command",
        "cd '$root\backend'; .\venv\Scripts\python.exe manage.py runserver"
    )
    $opened++
}

# --- Frontend (Vite) ---
if (Test-PortInUse 5173) {
    Write-Host "Frontend already running on :5173 - skipping" -ForegroundColor Yellow
} else {
    Write-Host "Starting frontend on :5173 ..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        "-NoExit", "-Command",
        "cd '$root\frontend'; npm run dev"
    )
    $opened++
}

Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
if ($opened -gt 0) {
    Write-Host "$opened new window(s) opened - close them (or Ctrl+C inside) to stop those servers."
} else {
    Write-Host "Both servers were already running - nothing new to start."
}
