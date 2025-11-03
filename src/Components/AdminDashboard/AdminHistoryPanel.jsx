import React from 'react'
import './AdminDashboard.css'

const AdminHistoryPanel = ({ history, onClear }) => (
  <div className="admin-section">
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <h2 className="admin-section-title">History</h2>
      <button className="admin-upload-btn" onClick={onClear}>
        Clear History
      </button>
    </div>
    {history.length === 0 ? (
      <div className="empty-msg" style={{color:'#b39ddb'}}>No history available.</div>
    ) : (
      <ul className="admin-files-list">
        {history.map((item, idx) => (
          <li key={idx} className="admin-file-item">
            <span>{item.action}</span>
            <span style={{color:'#b39ddb', fontSize:'0.96rem'}}>{item.time}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default AdminHistoryPanel