import React from 'react'
import './AdminDashboard.css'

const AdminRecentLoginActivity = ({ loginHistory, onClear }) => (
  <div className="admin-section">
    <div className="admin-section-header">
      <h2 className="admin-section-title">Recent Login Activity</h2>
      <button className="admin-clear-btn" onClick={onClear}>
        Clear History
      </button>
    </div>
    {loginHistory.length === 0 ? (
      <div className="empty-msg">No login activity.</div>
    ) : (
      <ul className="admin-files-list">
        {loginHistory.map((item, idx) => (
          <li key={idx} className="admin-file-item">
            <span>{item.studentName}</span>
            <span className="admin-login-time">{item.time}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default AdminRecentLoginActivity