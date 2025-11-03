#!/bin/bash

echo "🚀 Starting Full-Stack Application..."
echo "================================================"

echo "🛑 Stopping existing Node.js processes..."
pkill -f "node.*index.js" || true
pkill -f "react-scripts" || true

echo "📡 Starting Backend Server..."
cd backend && npm start &
BACKEND_PID=$!

echo "🌐 Starting Frontend Server..."
npm start &
FRONTEND_PID=$!

echo "💾 Database: Using file-based JSON storage"
echo ""
echo "================================================"
echo "🎉 Full-Stack Application Started Successfully!"
echo ""
echo "📍 Access Points:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔗 Backend API: http://localhost:5000"
echo "   📊 Admin Dashboard: http://localhost:3000"
echo ""
echo "🔑 Admin Login:"
echo "   Username: ReddyFBN@1228"
echo "   Password: ReddyFBN"
echo ""
echo "📋 Services Running:"
echo "   ✅ React Frontend (Port 3000)"
echo "   ✅ Node.js Backend (Port 5000)"
echo "   ✅ JSON Database (File-based)"
echo ""
echo "🛑 To stop all servers: Press Ctrl+C"
echo "================================================"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

echo ""
echo "🛑 Shutting down servers..."
pkill -f "node.*index.js" || true
pkill -f "react-scripts" || true
echo "✅ All servers stopped!"
