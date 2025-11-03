import React from 'react'
import './StudentHistory.css'

const StudentHistory = ({ registeredStudents, loginHistory }) => {
  return (
    <div className="student-history-container">
      <div className="history-section">
        <h2>Registered Students</h2>
        <ul className="student-list">
          {registeredStudents.length === 0 ? (
            <li className="empty-msg">No students registered yet.</li>
          ) : (
            registeredStudents.map((student, idx) => (
              <li key={idx} className="student-item">
                <span className="student-name">{student.studentName}</span>
                <span className="student-id">ID: {student.sid}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="history-section">
        <h2>Login History</h2>
        <ul className="login-list">
          {loginHistory.length === 0 ? (
            <li className="empty-msg">No login activity yet.</li>
          ) : (
            loginHistory.map((entry, idx) => (
              <li key={idx} className="login-item">
                <span className="login-name">{entry.studentName}</span>
                <span className="login-time">{entry.time}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default StudentHistory