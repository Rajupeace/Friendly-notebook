
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './FacultyDashboard.css';
import MaterialManager from './MaterialManager';

const FacultyDashboard = ({ facultyData, setIsAuthenticated, setIsFaculty }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);

  const groupedCourses = useMemo(() => {
    const groups = {};
    (facultyData.assignments || []).forEach(course => {
      const key = `${course.subject} - Year ${course.year}`;
      if (!groups[key]) groups[key] = [];
      (course.sections || []).forEach(sec => {
        if (!groups[key].includes(sec)) groups[key].push(sec);
      });
    });
    return groups;
  }, [facultyData.assignments]);

  const handleSubjectSelection = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setSelectedSections([]);
  };

  const handleSectionToggle = (section) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    setIsAuthenticated(false);
    setIsFaculty(false);
  };

  const facultyToken = localStorage.getItem('facultyToken');

  return (
    <div className="faculty-dashboard-container">
      <div className="header">
        <h1 className="dashboard-title">Welcome, {facultyData.name}</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="main-content">
        <div className="courses-panel">
          <h2>Your Subjects</h2>
          <div className="courses-list">
            {Object.keys(groupedCourses).map((key) => (
              <button
                key={key}
                type="button"
                className={`course-card ${selectedSubject === key ? 'active' : ''}`}
                onClick={() => handleSubjectSelection(key)}
              >
                <div className="course-subject">{key}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedSubject && (
          <div className="details-panel">
            <div className="sections-container">
              <h2>Sections for {selectedSubject}</h2>
              <div className="checkbox-group">
                {groupedCourses[selectedSubject].map(section => (
                  <label key={section} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section)}
                      onChange={() => handleSectionToggle(section)}
                    />
                    Section {section}
                  </label>
                ))}
              </div>
            </div>

            <MaterialManager 
              selectedSubject={selectedSubject} 
              selectedSections={selectedSections} 
              facultyToken={facultyToken} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;

FacultyDashboard.propTypes = {
  facultyData: PropTypes.object.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  setIsFaculty: PropTypes.func.isRequired,
};
