import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignOutAlt, FaDownload, FaCog, FaUserEdit, FaBook } from 'react-icons/fa';
import PasswordSettings from '../Settings/PasswordSettings';
import { getYearData } from './branchData';
import './StudentDashboard.css';

// Minimal fallback when no studentData is provided
const FALLBACK = {
    studentName: 'John Doe',
    sid: 'student001',
    branch: 'CSE',
    year: 1,
    section: 'A',
    role: 'student',
    email: 'john.doe@example.edu'
};

export default function StudentDashboard({ studentData = FALLBACK }) {
    const navigate = useNavigate();
    const data = { ...FALLBACK, ...studentData };
    const branch = String(data.branch || 'CSE').toUpperCase();
    const role = String(data.role || 'student').toLowerCase();
    const isFaculty = role === 'faculty' || role === 'admin';

    // UI state
    const [view, setView] = useState('overview'); // overview | semester | advanced | subject | settings
    const [selectedYear] = useState(Number(data.year) || 1);
    const [serverMaterials, setServerMaterials] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);
    const [userData, setUserData] = useState(data);

    const yearData = useMemo(() => getYearData(branch, selectedYear), [branch, selectedYear]);
    const selectedSemester = Number(userData.semester) || null;

    // Fetch server-provided materials
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const qs = new URLSearchParams({ year: String(selectedYear), branch });
                const res = await fetch(`/api/materials?${qs.toString()}`);
                if (!mounted || !res.ok) return;
                const json = await res.json();
                if (mounted && Array.isArray(json)) setServerMaterials(json);
            } catch (e) {
                console.error('Error fetching materials:', e);
            }
        })();
        return () => { mounted = false; };
    }, [selectedYear, branch]);

    // Merge server materials with local data
    const mergedMaterials = useMemo(() => {
        // Implementation of material merging logic
        return {};
    }, [serverMaterials]);

    const handleLogout = () => {
        // Clear any stored tokens or user data
        localStorage.removeItem('studentToken');
        navigate('/login');
    };

    // Render loading state
    if (!yearData) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Render the main dashboard
    return (
        <div className="student-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <h1>Student Dashboard</h1>
                <div className="user-menu">
                    <span>Welcome, {userData.studentName}</span>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-content">
                {/* Navigation */}
                <nav className="dashboard-nav">
                    <button 
                        className={view === 'overview' ? 'active' : ''}
                        onClick={() => setView('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={view === 'courses' ? 'active' : ''}
                        onClick={() => setView('courses')}
                    >
                        My Courses
                    </button>
                    <button 
                        className={view === 'settings' ? 'active' : ''}
                        onClick={() => setView('settings')}
                    >
                        <FaCog /> Settings
                    </button>
                </nav>

                {/* View Content */}
                <div className="view-content">
                    {view === 'overview' && (
                        <div className="overview-view">
                            <h2>Welcome back, {userData.studentName}!</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Current Semester</h3>
                                    <p>Year {selectedYear} • {selectedSemester ? `Semester ${selectedSemester}` : 'All Semesters'}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Branch</h3>
                                    <p>{branch}</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Section</h3>
                                    <p>{userData.section || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-buttons">
                                    <Link 
                                        to={`/student/${userData.sid || userData.id}/courses`}
                                        className="action-button"
                                    >
                                        <FaBook /> View All Courses
                                    </Link>
                                    <button className="action-button">
                                        <FaDownload /> Download Materials
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'courses' && (
                        <div className="courses-view">
                            <h2>My Courses</h2>
                            <p>View and manage your enrolled courses.</p>
                            {/* This will be replaced with the actual courses list */}
                            <div className="courses-list">
                                <p>Loading courses...</p>
                            </div>
                        </div>
                    )}

                    {view === 'settings' && (
                        <div className="settings-view">
                            <h2>Account Settings</h2>
                            <PasswordSettings userData={userData} />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>© {new Date().getFullYear()} Student Portal - {branch} Department</p>
                <p>Need help? Contact your department administrator.</p>
            </footer>
        </div>
    );
}
