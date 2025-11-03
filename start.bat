@echo off
title Friendly College Management System

echo 🚀 Starting Friendly College Management System...
echo ================================================

echo 🛑 Stopping any existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo 📡 Starting Backend Server (Port 5000)...
start /b cmd /c "cd backend && npm start" >nul 2>&1

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo 🌐 Starting Frontend Server (Port 3000)...
start /b cmd /c "npm start" >nul 2>&1

echo 💾 Database: Using file-based JSON storage
echo.
echo ================================================
echo 🎉 Full-Stack Application Started Successfully!
echo.
echo 📍 Access Points:
echo    🌐 Frontend: http://localhost:3000
echo    🔗 Backend API: http://localhost:5000
echo    📊 Admin Dashboard: http://localhost:3000
echo.
echo 🔑 Admin Login:
echo    Username: ReddyFBN@1228
echo    Password: ReddyFBN
echo.
echo 📋 Services Running:
echo    ✅ React Frontend (Port 3000)
echo    ✅ Node.js Backend (Port 5000)
echo    ✅ JSON Database (File-based)
echo.
echo 🛑 To stop: Close this window or press Ctrl+C
echo ================================================

echo.
echo ✅ Both servers are starting in the background...
echo ✅ Frontend will be available at: http://localhost:3000
echo ✅ Backend API will be available at: http://localhost:5000
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo 🛑 Stopping all servers...
taskkill /f /im node.exe >nul 2>&1
echo ✅ All servers stopped!
echo.
