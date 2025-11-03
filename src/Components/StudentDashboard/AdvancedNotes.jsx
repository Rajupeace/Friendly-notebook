
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdvancedCourses } from './branchData';

const AdvancedNotes = ({ studentData }) => {
    const navigate = useNavigate();
    const advancedCourses = getAdvancedCourses(studentData.branch);

    const programmingLanguages = advancedCourses.filter(course => [
        'Data Structures & Algorithms', 
        'Python Programming', 
        'Java Full Stack',
        'C',
        'C++'
    ].includes(course.name));

    const fullStackLanguages = advancedCourses.filter(course => [
        'Full Stack Web Dev (MERN)',
        'PHP & MySQL',
        'HTML/CSS',
        'JavaScript',
        'React',
        'Angular',
        'Django',
        'MongoDB',
        'Flask'
    ].includes(course.name));

    const renderCourseCard = (course) => (
        <div key={course.id} className="course-card">
            <div className="course-icon">{course.icon}</div>
            <div className="course-details">
                <h3>{course.name}</h3>
                <p>{course.description}</p>
            </div>
            <div className="course-actions">
                <button>Notes</button>
                <button>Video</button>
                <button>Links</button>
                <button>Interview</button>
                <button>Model Paper</button>
            </div>
        </div>
    );

    return (
        <div className="advanced-notes-container">
            <button onClick={() => navigate('/dashboard')} className="back-button">Go Back</button>
            <h1>Advanced Notes</h1>

            <div className="notes-section">
                <h2>Programming Languages</h2>
                <div className="course-grid">
                    {programmingLanguages.map(renderCourseCard)}
                </div>
            </div>

            <div className="notes-section">
                <h2>Full Stack Development</h2>
                <div className="course-grid">
                    {fullStackLanguages.map(renderCourseCard)}
                </div>
            </div>
        </div>
    );
};

export default AdvancedNotes;
