import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard';
import SemesterNotes from './Components/StudentDashboard/SemesterNotes';
import AdvancedNotes from './Components/StudentDashboard/AdvancedNotes';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import FacultyDashboard from './Components/FacultyDashboard/FacultyDashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFaculty, setIsFaculty] = useState(false);
  const [facultyData, setFacultyData] = useState(null);

  console.log('App State:', { isAuthenticated, studentData }); // Debug log
  const rootElement = (() => {
    if (!isAuthenticated) return (
      <LoginRegister 
        setIsAuthenticated={setIsAuthenticated} 
        setStudentData={setStudentData}
        setIsAdmin={setIsAdmin}
        setIsFaculty={setIsFaculty}
        setFacultyData={setFacultyData}
      />
    );
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isFaculty) return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  })();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={rootElement} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated && studentData && !isAdmin ? 
              <StudentDashboard 
                studentData={studentData} 
              /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/semester-notes" 
            element={
              isAuthenticated && studentData && !isAdmin ? 
              <SemesterNotes /> :
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/advanced-notes" 
            element={
              isAuthenticated && studentData && !isAdmin ? 
              <AdvancedNotes /> :
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated && isAdmin ? 
              <AdminDashboard 
                setIsAuthenticated={setIsAuthenticated}
                setIsAdmin={setIsAdmin}
                setStudentData={setStudentData}
              /> : 
              <Navigate to="/" replace />
            } 
          />
          {/* Catch all route */}
          <Route 
            path="/faculty" 
            element={
              isAuthenticated && isFaculty ? 
              <FacultyDashboard 
                facultyData={facultyData}
                setIsAuthenticated={setIsAuthenticated}
                setIsFaculty={setIsFaculty}
              /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
