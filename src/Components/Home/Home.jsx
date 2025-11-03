import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ studentData }) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

const getBranchFullName = (branch) => {
    const branches = {
      'CSE': 'Computer Science Engineering',
      'ECE': 'Electronics & Communication Engineering',
      'EEE': 'Electrical & Electronics Engineering',
      'MECH': 'Mechanical Engineering',
      'CIVIL': 'Civil Engineering'
    };
    return branches[branch] || branch;
  };

  const getOrdinalSuffix = (num) => {
    const suffixes = { '1': 'st', '2': 'nd', '3': 'rd' };
    return suffixes[num] || 'th';
  };

  if (!studentData) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
        <div className="home-content">
          <div className="student-profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {studentData.studentName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h2>{studentData.studentName}</h2>
                <p className="student-id">Student ID: {studentData.sid}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <span className="label">Academic Year:</span>
                <span className="value">{studentData.year}{getOrdinalSuffix(studentData.year)} Year</span>
              </div>
              <div className="detail-row">
                <span className="label">Branch:</span>
                <span className="value">{getBranchFullName(studentData.branch)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Section:</span>
                <span className="value">Section {studentData.section}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{studentData.email}</span>
              </div>
            </div>

            <div className="dashboard-access">
              <h3>🎓 Academic Dashboard</h3>
              <p>
                Access your personalized study materials, video lectures, and syllabus.
              </p>
              <button onClick={handleGoToDashboard} className="dashboard-btn">
                Go to Your Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Home;

Home.propTypes = {
  studentData: PropTypes.shape({
    studentName: PropTypes.string,
    sid: PropTypes.string,
    branch: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    section: PropTypes.string,
    email: PropTypes.string,
  }),
};