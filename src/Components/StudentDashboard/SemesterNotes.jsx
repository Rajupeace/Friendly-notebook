
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getYearData } from './branchData';

const SemesterNotes = ({ studentData }) => {
    const navigate = useNavigate();
    const [activeYear, setActiveYear] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);
    const [activeSubject, setActiveSubject] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [activeUnit, setActiveUnit] = useState(null);

    const years = [1, 2, 3, 4];

    const handleYearClick = (year) => {
        setActiveYear(year);
        setActiveSemester(null);
        setActiveSubject(null);
        setActiveModule(null);
        setActiveUnit(null);
    };

    const handleSemesterClick = (semester) => {
        setActiveSemester(semester);
        setActiveSubject(null);
        setActiveModule(null);
        setActiveUnit(null);
    };

    const handleSubjectClick = (subject) => {
        setActiveSubject(subject);
        setActiveModule(null);
        setActiveUnit(null);
    };

    const handleModuleClick = (module) => {
        setActiveModule(module);
        setActiveUnit(null);
    };

    const handleUnitClick = (unit) => {
        setActiveUnit(unit);
    };

    const renderYears = () => (
        <div className="year-selection">
            <h2>Select Year</h2>
            <div className="year-buttons">
                {years.map(year => (
                    <button key={year} onClick={() => handleYearClick(year)}>{`Year ${year}`}</button>
                ))}
            </div>
        </div>
    );

    const renderSemesters = () => {
        const yearData = getYearData(studentData.branch, activeYear);
        return (
            <div className="semester-selection">
                <h2>Select Semester</h2>
                <div className="semester-buttons">
                    {yearData.semesters.map(semester => (
                        <button key={semester.sem} onClick={() => handleSemesterClick(semester)}>{`Semester ${semester.sem}`}</button>
                    ))}
                </div>
            </div>
        );
    };

    const renderSubjects = () => (
        <div className="subject-selection">
            <h2>Select Subject</h2>
            <div className="subject-list">
                {activeSemester.subjects.map(subject => (
                    <div key={subject.id} className="subject-item" onClick={() => handleSubjectClick(subject)}>
                        {subject.name}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderModules = () => (
        <div className="module-selection">
            <h2>Select Module</h2>
            <div className="module-list">
                {activeSubject.modules.map(module => (
                    <div key={module.id} className="module-item" onClick={() => handleModuleClick(module)}>
                        {module.name}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderUnits = () => (
        <div className="unit-selection">
            <h2>Select Unit</h2>
            <div className="unit-list">
                {activeModule.units.map(unit => (
                    <div key={unit.id} className="unit-item" onClick={() => handleUnitClick(unit)}>
                        {unit.name}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTopics = () => (
        <div className="topic-selection">
            <h2>Topics</h2>
            <div className="topic-list">
                {activeUnit.topics.map(topic => (
                    <div key={topic.id} className="topic-item">
                        <p>{topic.name}</p>
                        <div className="topic-resources">
                            <button>Notes</button>
                            <button>Video</button>
                            <button>Model Papers</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="semester-notes-container">
            <button onClick={() => navigate('/dashboard')} className="back-button">Go Back</button>
            <h1>Semester Notes</h1>
            {!activeYear && renderYears()}
            {activeYear && !activeSemester && renderSemesters()}
            {activeSemester && !activeSubject && renderSubjects()}
            {activeSubject && !activeModule && renderModules()}
            {activeModule && !activeUnit && renderUnits()}
            {activeUnit && renderTopics()}
        </div>
    );
};

export default SemesterNotes;
