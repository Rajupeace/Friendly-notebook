import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LoginRegister.css';
import { readStudents, readFaculty, readAdmin } from '../../utils/localdb';
import api from '../../utils/apiClient';
const USE_API = Boolean(process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.length);

const LoginRegister = ({ setIsAuthenticated, setStudentData, setIsAdmin, setIsFaculty, setFacultyData }) => {
  const [formToShow, setFormToShow] = useState('selection'); // 'selection', 'studentLogin', 'studentRegister', etc.

  // Faculty login only (admin will create faculty accounts)

  // Login states
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // Clear transient login fields and any selected user data to avoid stale state
    try { setLoginId(''); setLoginPassword(''); } catch (err) {}
    try { setStudentData && setStudentData(null); } catch (err) {}
    try { setFacultyData && setFacultyData(null); } catch (err) {}
    setFormToShow('selection');
  };

  // Student registration is restricted to Admin. Admin will create students from the Admin dashboard.

  // Faculty accounts should be created by Admin. Faculty registration UI removed.

  const handleLogin = async (e, userType) => {
    e.preventDefault();
    try {
      if (userType === 'admin') {
        if (USE_API) {
          try {
            const resp = await api.adminLogin(loginId, loginPassword);
            if (resp && resp.token) {
              window.localStorage.setItem('adminToken', resp.token);
              setIsAuthenticated(true);
              setIsAdmin(true);
              return;
            }
            alert('Invalid admin credentials');
          } catch (error) {
            console.error('Admin login error:', error);
            alert(`Admin login failed: ${error.message}`);
          }
        } else {
          const adminAccount = await readAdmin();
          if (adminAccount && adminAccount.adminId === loginId && adminAccount.password === loginPassword) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            return;
          }
          alert('Invalid admin credentials');
        }
        return;
      }

      if (userType === 'faculty') {
        if (USE_API) {
          try {
            const resp = await api.facultyLogin(loginId, loginPassword);
            if (resp && resp.token) {
              window.localStorage.setItem('facultyToken', resp.token);
              setIsAuthenticated(true);
              setIsFaculty(true);
              setFacultyData(resp.facultyData);
              return;
            }
            alert('Invalid faculty credentials');
          } catch (error) {
            console.error('Faculty login error:', error);
            alert(`Faculty login failed: ${error.message}`);
          }
        } else {
          const registeredFaculty = await readFaculty();
          const foundFaculty = registeredFaculty.find(f => f.facultyId === loginId && f.password === loginPassword);
          if (foundFaculty) {
            setIsAuthenticated(true);
            setIsFaculty(true);
            setFacultyData(foundFaculty);
            return;
          }
          alert('Invalid faculty credentials');
        }
        return;
      }

      if (userType === 'student') {
        const idTrim = String(loginId || '').trim();
        const passTrim = String(loginPassword || '').trim();
        if (USE_API) {
          try {
            const students = await api.apiGet('/api/students');
            const foundStudent = (students || []).find(s => ((s.sid && String(s.sid).trim() === idTrim) || (s.email && String(s.email).trim().toLowerCase() === idTrim.toLowerCase())) && String(s.password || '') === passTrim);
            if (foundStudent) {
              setIsAuthenticated(true);
              setStudentData(foundStudent);
              return;
            }
            alert('Invalid student credentials');
          } catch (error) {
            console.error('Student login error:', error);
            alert(`Student login failed: ${error.message}`);
          }
        } else {
          const registeredStudents = await readStudents() || [];
          const foundStudent = registeredStudents.find(s => ((s.sid && String(s.sid).trim() === idTrim) || (s.email && String(s.email).trim().toLowerCase() === idTrim.toLowerCase())) && String(s.password || '') === passTrim);
          if (foundStudent) {
            setIsAuthenticated(true);
            setStudentData(foundStudent);
            return;
          }
          alert('Invalid student credentials');
        }
        return;
      }
    } catch (err) {
      console.error('Login failed', err);
      alert('Login error occurred');
    }
  };

  const renderForm = () => {
    switch (formToShow) {
      case 'studentLogin':
        return (
            <form onSubmit={(e) => handleLogin(e, 'student')} aria-label="Student Login Form">
            <h2>Student Login</h2>
            <input aria-label="Student ID" type="text" placeholder="Student ID (SID)" value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
            <input aria-label="Password" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <button type="button" className="back-link" onClick={handleBack}>Back to selection</button>
          </form>
        );
      case 'studentRegister':
        if (USE_API) {
          return (
            <form onSubmit={async (ev) => {
              ev.preventDefault();
              const form = ev.target;
              const studentName = form.studentName.value.trim();
              const sid = form.sid.value.trim();
              const email = form.email.value.trim();
              const year = form.year.value.trim();
              const section = form.section.value.trim();
              const branch = form.branch.value.trim();
              const password = form.password.value.trim() || 'changeme';
              const payload = { studentName, sid, email, year, section, branch, password };

              try {
                const response = await api.apiPost('/api/students', payload);
                alert('Student account created successfully!');
                setIsAuthenticated(true);
                setStudentData(response);
                form.reset();
                setFormToShow('selection');
              } catch (error) {
                console.error('Registration error:', error);
                alert(`Registration failed: ${error.message}`);
              }
            }} style={{ padding: 8 }}>
              <h2>Create Student Account</h2>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9em', marginBottom: 16 }}>
                Create your student account to access course materials and assignments.
              </p>
              <input name="studentName" placeholder="Full Name" required />
              <input name="sid" placeholder="Student ID (SID)" required />
              <input name="email" placeholder="Email" type="email" />
              <input name="branch" placeholder="Branch (CSE)" />
              <input name="year" placeholder="Year (1)" />
              <input name="section" placeholder="Section (A)" />
              <input name="password" placeholder="Password" type="password" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit">Register</button>
                <button type="button" className="back-link" onClick={handleBack}>Back to selection</button>
              </div>
            </form>
          );
        }

        return (
          <form onSubmit={async (ev) => {
            ev.preventDefault();
            const form = ev.target;
            const studentName = form.studentName.value.trim();
            const sid = form.sid.value.trim();
            const email = form.email.value.trim();
            const year = form.year.value.trim();
            const section = form.section.value.trim();
            const branch = form.branch.value.trim();
            const password = form.password.value.trim() || 'changeme';
            const payload = { studentName, sid, email, year, section, branch, password };
            try {
              // fallback to local helper
              const { addStudent } = await import('../../utils/localdb');
              await addStudent(payload);
              setIsAuthenticated(true);
              setStudentData(payload);
              form.reset();
            } catch (err) {
              console.error(err);
              alert('Registration failed');
            }
          }} style={{ padding: 8 }}>
            <h2>Create Student Account</h2>
            <input name="studentName" placeholder="Full Name" required />
            <input name="sid" placeholder="Student ID (SID)" required />
            <input name="email" placeholder="Email" />
            <input name="branch" placeholder="Branch (CSE)" />
            <input name="year" placeholder="Year (1)" />
            <input name="section" placeholder="Section (A)" />
            <input name="password" placeholder="Password" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit">Register</button>
              <button type="button" className="back-link" onClick={handleBack}>Back to selection</button>
            </div>
          </form>
        );
      case 'facultyLogin':
        return (
          <form onSubmit={(e) => handleLogin(e, 'faculty')} aria-label="Faculty Login Form">
            <h2>Faculty Login</h2>
            <input aria-label="Faculty ID" type="text" placeholder="Faculty ID" value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
            <input aria-label="Password" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <button type="button" className="back-link" onClick={handleBack}>Back to selection</button>
          </form>
        );
      /* facultyRegister removed - Admin creates faculty accounts */
        case 'adminLogin':
          return (
            <form onSubmit={(e) => handleLogin(e, 'admin')} aria-label="Admin Login Form">
              <h2>Admin Login</h2>
              <input aria-label="Admin ID" type="text" placeholder="Admin ID" value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
              <input aria-label="Password" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit">Login</button>
              <button type="button" className="back-link" onClick={handleBack}>Back to selection</button>
            </form>
          );
      default: // selection
        return (
          <div className="selection-container">
            <h2>Welcome</h2>
            <p>Please select your role to continue</p>
            <div className="selection-buttons">
                <div className="button-row">
                  <button type="button" onClick={() => setFormToShow('studentLogin')}>Student Login</button>
                </div>
                <div className="button-row">
                  <button type="button" onClick={() => setFormToShow('studentRegister')}>Student Register</button>
                </div>
                <div className="button-row">
                  <button type="button" onClick={() => setFormToShow('facultyLogin')}>Faculty Login</button>
                </div>
                {/* Faculty Register removed - Admin creates faculty accounts */}
                <button type="button" onClick={() => setFormToShow('adminLogin')} className="admin-btn">Admin Login</button>
              </div>
          </div>
        );
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-container">
        {renderForm()}
      </div>
    </div>
  );
};

LoginRegister.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setStudentData: PropTypes.func.isRequired,
  setIsAdmin: PropTypes.func.isRequired,
  setIsFaculty: PropTypes.func.isRequired,
  setFacultyData: PropTypes.func.isRequired,
};

export default LoginRegister;