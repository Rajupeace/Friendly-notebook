# Friendly College Management System

A full-stack college management system with Admin, Faculty, and Student dashboards.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Running Both Servers

#### Option 1: npm Command (Recommended)
```bash
npm run dev
```
This will start both backend and frontend servers simultaneously.

#### Option 2: Manual Commands
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
npm start
```

#### Option 3: Batch File (Windows)
```bash
start-fullstack.bat
```

#### Option 4: PowerShell (Windows)
```bash
powershell -ExecutionPolicy Bypass -File start-fullstack.ps1
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🔑 Login Credentials

### Admin Login
- Username: `ReddyFBN@1228`
- Password: `ReddyFBN`

### Faculty Login
- Username: `ReddyFBN@1228`
- Password: `ReddyFBN`

## 🛑 Stopping Servers

- Press `Ctrl+C` in terminal
- Close the command window
- Use Task Manager to kill Node.js processes

## 📋 Features

- ✅ Admin Dashboard (Manage students, faculty, courses)
- ✅ Faculty Dashboard (Upload materials with module/unit structure)
- ✅ Student Dashboard (View organized materials)
- ✅ Authentication & Authorization
- ✅ File uploads (PDF, Video, Documents)
- ✅ Module/Unit organization system

## 🔧 Development

### Backend API Endpoints
- `GET /api/health` - Health check
- `POST /api/admin/login` - Admin authentication
- `POST /api/faculty/login` - Faculty authentication
- `POST /api/materials` - Upload materials
- `GET /api/courses` - Get courses/subjects

### Frontend Structure
- `/src/Components/AdminDashboard/` - Admin features
- `/src/Components/FacultyDashboard/` - Faculty features
- `/src/Components/StudentDashboard/` - Student features

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing Node.js processes
taskkill /f /im node.exe
```

### Backend Syntax Error
If you see "Unexpected end of input", the backend file may be missing a closing brace. Run:
```bash
node -c backend/index.js
```

### Login Issues
1. Make sure both servers are running
2. Check API endpoints are responding
3. Verify login credentials

## 📁 Project Structure

```
friendly/
├── backend/           # Node.js API server
│   ├── index.js      # Main server file
│   └── data/         # JSON database files
├── src/              # React frontend
│   └── Components/   # React components
├── start-fullstack.bat # Windows batch script
├── start-fullstack.ps1 # PowerShell script
└── package.json      # Dependencies and scripts
```

## 💾 Database

The application uses file-based JSON storage for:
- **Admin accounts** (`admin.json`)
- **Faculty accounts** (`faculty.json`)
- **Student accounts** (`students.json`)
- **Course/Subject data** (`courses.json`)
- **Materials/Files** (`materials.json`)
- **Messages/Announcements** (`messages.json`)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
```

## 📚 API Documentation

### Authentication
- **Admin Login:** `POST /api/admin/login`
- **Faculty Login:** `POST /api/faculty/login`
- **Student Registration:** `POST /api/students`

### Materials
- **Upload:** `POST /api/materials`
- **List:** `GET /api/materials`
- **Delete:** `DELETE /api/materials/:id`

### Management
- **Courses:** `GET/POST/PUT/DELETE /api/courses`
- **Faculty:** `GET/POST/PUT/DELETE /api/faculty`
- **Students:** `GET/POST/PUT/DELETE /api/students`
