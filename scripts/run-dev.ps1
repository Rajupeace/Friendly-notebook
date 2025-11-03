<#
Run-dev.ps1

Kills processes using frontend/backend ports, starts backend (node server/index.js) in background,
then starts the React dev server with REACT_APP_API_URL pointed to the backend.

Usage (PowerShell):
  ./scripts/run-dev.ps1

#>
param(
    [int]$FrontendPort = 3000,
    [int]$BackendPort = 5000
)

function Free-Port($port) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($c in $conns) {
            if ($c.OwningProcess) {
                try {
                    Write-Host "Stopping process $($c.OwningProcess) listening on port $port"
                    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
                } catch {
                    Write-Warning "Failed to stop process $($c.OwningProcess): $($_.Exception.Message)"
                }
            }
        }
        # best-effort using npx kill-port if available
        try {
            npx kill-port $port | Out-Null
        } catch {
            # ignore
        }
    } catch {
        Write-Warning "Free-Port: $($_.Exception.Message)"
    }
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition | Split-Path -Parent
Write-Host "Project root: $projectRoot"

Write-Host "Freeing frontend port $FrontendPort and backend port $BackendPort..."
Free-Port $FrontendPort
Free-Port $BackendPort
Start-Sleep -Milliseconds 300

# Start backend in background
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) {
    Write-Error "node.exe not found in PATH. Install Node.js or ensure node is on PATH."
    exit 1
}
$serverPath = Join-Path $projectRoot 'server\index.js'
Write-Host "Starting backend: node $serverPath"
$backendProc = Start-Process -FilePath $node -ArgumentList "`"$serverPath`"" -NoNewWindow -PassThru
Start-Sleep -Milliseconds 600

# Confirm backend listening
try {
    $listening = Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue
    if ($listening) {
        Write-Host "Backend appears to be listening on port $BackendPort"
    } else {
        Write-Warning "Backend is not yet listening on port $BackendPort. Check server logs." 
    }
} catch {
    Write-Warning "Could not verify backend port: $($_.Exception.Message)"
}

# Start frontend (foreground)
Push-Location $projectRoot
try {
    Write-Host "Starting frontend with REACT_APP_API_URL=http://localhost:$BackendPort"
    $env:REACT_APP_API_URL = "http://localhost:$BackendPort"
    npm start
} finally {
    Pop-Location
}
