# PowerShell script to start full-stack application
# Frontend, Backend, and Database servers

Write-Host "🚀 Starting Full-Stack Application..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Yellow

# Kill any existing Node.js processes
Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Function to start a process in background and wait for it to initialize
function Start-BackgroundProcess {
    param([string]$Name, [string]$Command, [string]$Directory = ".")

    Write-Host "📡 Starting $Name..." -ForegroundColor Cyan

    # Start the process in the background
    $process = Start-Process -FilePath "cmd" -ArgumentList "/c", "cd $Directory && $Command" -NoNewWindow -PassThru

    # Wait a bit for the process to start
    Start-Sleep -Seconds 3

    if ($process.HasExited) {
        Write-Host "❌ Failed to start $Name" -ForegroundColor Red
        return $false
    } else {
        Write-Host "✅ $Name started successfully!" -ForegroundColor Green
        return $true
    }
}

# Start Backend Server (Port 5000)
$backendStarted = Start-BackgroundProcess -Name "Backend Server" -Command "npm start" -Directory "backend"

# Start Frontend Server (Port 3000)
$frontendStarted = Start-BackgroundProcess -Name "Frontend Server" -Command "npm start"

# Database info
Write-Host "💾 Database: Using file-based JSON storage" -ForegroundColor Cyan

if ($backendStarted -and $frontendStarted) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Yellow
    Write-Host "🎉 Full-Stack Application Started Successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access Points:" -ForegroundColor Cyan
    Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   🔗 Backend API: http://localhost:5000" -ForegroundColor White
    Write-Host "   📊 Admin Dashboard: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Admin Login:" -ForegroundColor Cyan
    Write-Host "   Username: ReddyFBN@1228" -ForegroundColor White
    Write-Host "   Password: ReddyFBN" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Services Running:" -ForegroundColor Cyan
    Write-Host "   ✅ React Frontend (Port 3000)" -ForegroundColor Green
    Write-Host "   ✅ Node.js Backend (Port 5000)" -ForegroundColor Green
    Write-Host "   ✅ JSON Database (File-based)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🛑 To stop all servers: Press Ctrl+C or close this window" -ForegroundColor Yellow
    Write-Host "================================================" -ForegroundColor Yellow

    # Keep the script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Host ""
        Write-Host "🛑 Shutting down servers..." -ForegroundColor Yellow
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "✅ All servers stopped!" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "❌ Some services failed to start!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
}
