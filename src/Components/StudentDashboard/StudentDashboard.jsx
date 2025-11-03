import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaDownload, FaCog, FaUserEdit } from 'react-icons/fa';
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
    // Lock selected year to the student's registered year. Do not allow switching across years from dashboard.
    const [selectedYear] = useState(Number(data.year) || 1);
    const [serverMaterials, setServerMaterials] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);
    const [userData, setUserData] = useState(data);

    const yearData = useMemo(() => getYearData(branch, selectedYear), [branch, selectedYear]);

    // If student has an explicit semester, show only that semester; otherwise allow both semesters of the year
    const selectedSemester = Number(userData.semester) || null;

    // Fetch server-provided materials (optional) for selected year/branch
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
                // ignore network errors
            }
        })();
        return () => { mounted = false; };
    }, [branch, selectedYear]);

    // Merge generated subject materials with server-provided ones
    const mergeForSubject = (subject) => {
        const subjName = String(subject.name || '').toLowerCase();
        const fromServer = serverMaterials.filter(m => String(m.subject || '').toLowerCase() === subjName);
        const gens = subject.materials || {};
        return {
            notes: [...fromServer.filter(m => m.type === 'notes'), ...(gens.notes || [])],
            videos: [...fromServer.filter(m => m.type === 'videos'), ...(gens.videos || [])],
            syllabus: [...fromServer.filter(m => m.type === 'syllabus'), ...(gens.syllabus || [])],
            modelPapers: [...fromServer.filter(m => (m.type === 'modelPapers' || m.type === 'previousQuestions')), ...(gens.modelPapers || []), ...(gens.previousQuestions || [])],
            external: [...fromServer.filter(m => m.type === 'external' || m.type === 'links'), ...(gens.external || [])]
        };
    };

    // (Uploads are handled by faculty UI elsewhere; this component offers navigation to upload.)

    const canViewAdvanced = ['CSE', 'IT', 'AIML'].includes(branch);

    // Advanced lists
    const programming = ['C', 'C++', 'Python', 'Java'];
    const fullstack = ['HTML/CSS', 'JavaScript', 'React', 'Angular', 'PHP', 'Django', 'MongoDB', 'Flask'];

    const handleSettingsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setView('settings');
        // Scroll to top to ensure settings are visible
        window.scrollTo(0, 0);
    };

    const handleBackFromSettings = (e) => {
        e && e.preventDefault();
        e && e.stopPropagation();
        setView('overview');
    };

    const handleLogout = () => {
        // Clear user session data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/login');
    };

    // Update user data when profile is updated
    const handleProfileUpdate = (updatedData) => {
        setUserData(prev => ({
            ...prev,
            ...updatedData,
            studentName: updatedData.name || prev.studentName,
            sid: updatedData.studentId || prev.sid,
            year: updatedData.year || prev.year,
            branch: updatedData.branch || prev.branch,
            section: updatedData.section || prev.section,
            email: updatedData.email || prev.email
        }));
    };

    return (
        <div className="student-dashboard">
            <header className="sd-header">
                <div className="sd-title">Student Dashboard</div>
                <div className="sd-actions">
                    <button 
                      onClick={handleSettingsClick} 
                      className="btn-icon" 
                      title="Settings"
                      style={{ marginRight: '10px' }}
                    >
                      <FaCog />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to logout?')) {
                          handleLogout();
                        }
                      }} 
                      className="btn-logout"
                      style={{
                        padding: '8px 16px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#d32f2f'}
                      onMouseOut={(e) => e.target.style.background = '#f44336'}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            {/* Centered Profile Card */}
            <div className="profile-container">
                <div className="student-details-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <div className="avatar">
                                {(data.studentName || '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                            <div className="profile-status">
                                <span className="status-indicator"></span>
                                <span className="status-text">Active</span>
                            </div>
                        </div>
                        <button
                            className="profile-edit-btn"
                            onClick={() => setView('settings')}
                            title="Edit Profile"
                        >
                            <FaUserEdit />
                        </button>
                    </div>
                    <div className="profile-info">
                        <div className="profile-header">
                            <h2 className="profile-name">{data.studentName}</h2>
                            <span className="profile-id">ID: {data.sid}</span>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Branch</span>
                                <span className="detail-value">{branch}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Year</span>
                                <span className="detail-value">Year {selectedYear}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Section</span>
                                <span className="detail-value">Section {data.section || 'A'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <span className="detail-label">Email</span>
                                <a href={`mailto:${data.email}`} className="detail-value email">
                                    {data.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="profile-actions">
                        {isFaculty ? (
                            <button onClick={() => navigate('/faculty/upload')} className="btn btn-primary">
                                Upload
                            </button>
                        ) : (
                            <button onClick={() => navigate('/profile')} className="btn btn-primary">
                                View Full Profile
                            </button>
                        )}
                        <button className="btn btn-secondary" onClick={() => navigate('/settings')}>
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Two Main Sections Below */}
            <div className="main-sections">
                {/* Left Section */}
                <div className="section-left">
                    <div className="section-card" onClick={() => setView('semester')}>
                        <div className="section-icon">📚</div>
                        <h3>Semester Notes</h3>
                        <p>Access all your course materials, notes, and resources organized by semester and subject.</p>
                        <button className="section-button" onClick={(e) => { e.stopPropagation(); setView('semester'); }}>
                            View Materials
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="section-right">
                    <div className={`section-card ${!canViewAdvanced ? 'disabled' : ''}`} onClick={() => canViewAdvanced && setView('advanced')}>
                        <div className="section-icon">🚀</div>
                        <h3>Advanced Learning</h3>
                        <p>Explore programming languages, frameworks, and advanced topics in computer science.</p>
                        {canViewAdvanced ? (
                            <button className="section-button" onClick={(e) => { e.stopPropagation(); setView('advanced'); }}>
                                Start Learning
                            </button>
                        ) : (
                            <div className="access-note">
                                Available for CSE, IT, and AIML students
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {view === 'semester' && (
                <div className="semester-view fade-in">
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700 }}>Year {selectedYear}</div>
                        {selectedSemester ? (
                            <div style={{ fontSize: '0.95rem', color: '#6b7280' }}>Showing Semester {selectedSemester} materials only</div>
                        ) : (
                            <div style={{ fontSize: '0.95rem', color: '#6b7280' }}>Showing all semesters for your year</div>
                        )}
                    </div>

                    <div className="semesters-list">
                        {(yearData.semesters || []).filter(sem => {
                            return !selectedSemester || Number(sem.sem) === Number(selectedSemester);
                        }).map(sem => (
                            <div key={sem.sem} className="semester-block">
                                <div className="sem-header">
                                    Semester {sem.sem} 
                                    <span className="count">{(sem.subjects || []).length} subjects</span>
                                </div>
                                <ul className="subjects-list">
                                    {(sem.subjects || []).map(sub => (
                                        <li key={sub.id} className="subject-item">
                                            <div 
                                                className="subject-name" 
                                                onClick={() => { 
                                                    setActiveSubject(sub); 
                                                    setView('subject'); 
                                                }}
                                            >
                                                {sub.name} 
                                                <span className="code">{sub.code}</span>
                                            </div>
                                            <div className="subject-meta">
                                                {(mergeForSubject(sub).notes || []).length} notes • 
                                                {(mergeForSubject(sub).videos || []).length} videos • 
                                                {(mergeForSubject(sub).modelPapers || []).length} papers
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'subject' && activeSubject && (
                <div className="subject-detail">
                    <div className="subject-top">
                        <h2>{activeSubject.name} <span className="code">{activeSubject.code}</span></h2>
                        <button onClick={() => { setView('semester'); setActiveSubject(null); }}>Back</button>
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
                        <div>
                            <h4>Syllabus</h4>
                            {mergeForSubject(activeSubject).syllabus && mergeForSubject(activeSubject).syllabus.length ? (
                                mergeForSubject(activeSubject).syllabus.map((m, i) => (
                                    <div key={`syllabus-${i}`} className="mat-item">
                                        <div className="mat-title">{m.title || 'Syllabus Document'}</div>
                                        <div className="mat-actions">
                                            {m.url && <a href={m.url} target="_blank" rel="noreferrer">View</a>}
                                            {!isFaculty && m.url && (
                                                <a href={m.url} download className="download"><FaDownload /></a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <div className="no-materials">No syllabus</div>}
                        </div>

                        <div>
                            <h4>Notes</h4>
                            {mergeForSubject(activeSubject).notes && mergeForSubject(activeSubject).notes.length ? (
                                mergeForSubject(activeSubject).notes.map((m, i) => (
                                    <div key={`note-${i}`} className="mat-item">
                                        <div className="mat-title">{m.title || m.name}</div>
                                        <div className="mat-actions">
                                            {m.url && <a href={m.url} target="_blank" rel="noreferrer">Open</a>}
                                            {!isFaculty && m.url && (
                                                <a href={m.url} download className="download"><FaDownload /></a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <div className="no-materials">No notes</div>}
                        </div>

                        <div>
                            <h4>Videos</h4>
                            {mergeForSubject(activeSubject).videos && mergeForSubject(activeSubject).videos.length ? (
                                mergeForSubject(activeSubject).videos.map((m, i) => (
                                    <div key={`video-${i}`} className="mat-item">
                                        <div className="mat-title">{m.title || m.name}</div>
                                        <div className="mat-actions">
                                            {m.url && <a href={m.url} target="_blank" rel="noreferrer">Watch</a>}
                                            {!isFaculty && m.url && (
                                                <a href={m.url} download className="download"><FaDownload /></a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <div className="no-materials">No videos</div>}
                        </div>

                        <div>
                            <h4>Model Papers</h4>
                            {mergeForSubject(activeSubject).modelPapers && mergeForSubject(activeSubject).modelPapers.length ? (
                                mergeForSubject(activeSubject).modelPapers.map((m, i) => (
                                    <div key={`mp-${i}`} className="mat-item">
                                        <div className="mat-title">{m.title || m.name}</div>
                                        <div className="mat-actions">
                                            {m.url && <a href={m.url} target="_blank" rel="noreferrer">Open</a>}
                                            {!isFaculty && m.url && (
                                                <a href={m.url} download className="download"><FaDownload /></a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <div className="no-materials">No model papers</div>}
                        </div>
                    </div>
                </div>
            )}

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

                    <h2>Full Stack / Frameworks</h2>
                    <div className="lang-grid">
                        {fullstack.map(lang => (
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
                    <PasswordSettings
                        onBack={handleBackFromSettings}
                        userData={userData}
                        onProfileUpdate={handleProfileUpdate}
                    />
                </div>
            )}

        </div>
    );
}