import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaDownload, FaCog } from 'react-icons/fa';
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
    const mergeForSubject = (subject) => {
        if (!subject) return {};
        return {
            ...subject,
            syllabus: [],
            notes: [],
            videos: [],
            modelPapers: []
        };
    };

    // Navigation items
    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'courses', label: 'My Courses' },
        { id: 'settings', label: 'Settings' }
    ];

    // Programming languages for advanced view
    const programming = ['Python', 'JavaScript', 'Java', 'C++', 'C#'];

    // Handle view changes
    const handleViewChange = (newView) => {
        setView(newView);
        if (newView !== 'subject') {
            setActiveSubject(null);
        }
    };

    // Handle logout
    const handleLogout = () => {
        // Clear user session
        localStorage.removeItem('studentToken');
        navigate('/login');
    };

    // Render the subject view
    const renderSubjectView = () => {
        if (!activeSubject) return null;
        
        const merged = mergeForSubject(activeSubject);
        
        return (
            <div className="subject-detail">
                <div className="subject-top">
                    <h2>{activeSubject.name} <span className="code">{activeSubject.code}</span></h2>
                    <button onClick={() => handleViewChange('semester')}>Back</button>
                </div>
                
                <div className="modules">
                    {(activeSubject.modules || []).map(mod => (
                        <div key={mod.id} className="module">
                            <div className="module-title">{mod.name}</div>
                            <div className="units">
                                {(mod.units || []).map(u => (
                                    <div key={u.id} className="unit">
                                        <div className="unit-name">{u.name}</div>
                                        <div className="topics">
                                            {(u.topics || []).map(t => (
                                                <div key={t.id} className="topic">{t.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="materials-section">
                    <MaterialSection 
                        title="Syllabus" 
                        items={merged.syllabus} 
                        isFaculty={isFaculty} 
                        defaultText="No syllabus available"
                    />
                    
                    <MaterialSection 
                        title="Notes" 
                        items={merged.notes} 
                        isFaculty={isFaculty} 
                        defaultText="No notes available"
                    />
                    
                    <MaterialSection 
                        title="Videos" 
                        items={merged.videos} 
                        isFaculty={isFaculty} 
                        defaultText="No videos available"
                        actionText="Watch"
                    />
                    
                    <MaterialSection 
                        title="Model Papers" 
                        items={merged.modelPapers} 
                        isFaculty={isFaculty} 
                        defaultText="No model papers available"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="student-dashboard">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Student Portal</h2>
                    <div className="user-info">
                        <span className="user-name">{userData.studentName}</span>
                        <span className="user-id">{userData.sid}</span>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${view === item.id ? 'active' : ''}`}
                            onClick={() => handleViewChange(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button className="nav-item logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {view === 'overview' && (
                    <div className="overview-view">
                        <h1>Welcome back, {userData.studentName}!</h1>
                        <div className="dashboard-cards">
                            <div className="card">
                                <h3>My Courses</h3>
                                <p>View and manage your enrolled courses</p>
                                <button onClick={() => handleViewChange('courses')}>View Courses</button>
                            </div>
                            <div className="card">
                                <h3>Materials</h3>
                                <p>Access your study materials</p>
                                <button onClick={() => handleViewChange('semester')}>View Materials</button>
                            </div>
                            {canViewAdvanced && (
                                <div className="card">
                                    <h3>Advanced</h3>
                                    <p>Explore advanced topics</p>
                                    <button onClick={() => handleViewChange('advanced')}>View Advanced</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'subject' && renderSubjectView()}

                {view === 'advanced' && (
                    <div className="advanced-view">
                        <h2>Programming Languages</h2>
                        <div className="lang-grid">
                            {programming.map(lang => (
                                <div key={lang} className="lang-card">
                                    <div className="lang-name">{lang}</div>
                                    <div className="lang-actions">
                                        <button onClick={() => navigate(`/advanced/${encodeURIComponent(lang)}?type=notes`)}>Notes</button>
                                        <button onClick={() => navigate(`/advanced/${encodeURIComponent(lang)}?type=videos`)}>Videos</button>
                                        <button onClick={() => navigate(`/advanced/${encodeURIComponent(lang)}?type=interview`)}>Interview</button>
                                        {isFaculty && <button onClick={() => navigate('/faculty/upload')}>Upload</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'settings' && (
                    <div className="settings-view">
                        <h2>Account Settings</h2>
                        <PasswordSettings userData={userData} onUpdate={setUserData} />
                    </div>
                )}
            </main>
        </div>
    );
}

// Helper component for material sections
function MaterialSection({ title, items = [], isFaculty, defaultText, actionText = 'Open' }) {
    if (!items || items.length === 0) {
        return (
            <div className="material-section">
                <h4>{title}</h4>
                <div className="no-materials">{defaultText}</div>
            </div>
        );
    }

    return (
        <div className="material-section">
            <h4>{title}</h4>
            <div className="material-list">
                {items.map((item, index) => (
                    <div key={`${title.toLowerCase()}-${index}`} className="mat-item">
                        <div className="mat-title">{item.title || item.name || `Item ${index + 1}`}</div>
                        <div className="mat-actions">
                            {item.url && (
                                <>
                                    <a href={item.url} target="_blank" rel="noreferrer">{actionText}</a>
                                    {!isFaculty && (
                                        <a href={item.url} download className="download">
                                            <FaDownload />
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
