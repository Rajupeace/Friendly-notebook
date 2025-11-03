# Simple PowerShell script to start both servers
Write-Host "🚀 Starting Friendly College Management System..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Yellow

# Kill existing processes
Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start backend first
Write-Host "📡 Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && npm start" -NoNewWindow

# Wait for backend to initialize
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c", "npm start" -NoNewWindow

Write-Host ""
Write-Host "💾 Database: Using file-based JSON storage" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Yellow
Write-Host "🎉 Full-Stack Application Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   🔗 Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Admin Login:" -ForegroundColor Cyan
Write-Host "   Username: ReddyFBN@1228" -ForegroundColor White
Write-Host "   Password: ReddyFBN" -ForegroundColor White
Write-Host ""
Write-Host "📋 Services Running:" -ForegroundColor Cyan
Write-Host "   ✅ React Frontend (Port 3000)" -ForegroundColor Green
Write-Host "   ✅ Node.js Backend (Port 5000)" -ForegroundColor Green
Write-Host ""
Write-Host "🛑 To stop: Close this window or press Ctrl+C" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "🛑 Shutting down servers..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ All servers stopped!" -ForegroundColor Green
}
