import React, { useState } from 'react';
import './Messaging.css';

const Messaging = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all'); // e.g., all, students, faculty, year1, year2, etc.
  const [sentMessages, setSentMessages] = useState(JSON.parse(localStorage.getItem('sentMessages')) || []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Cannot send an empty message.');
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: message,
      recipient,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...sentMessages, newMessage];
    setSentMessages(updatedMessages);
    localStorage.setItem('sentMessages', JSON.stringify(updatedMessages));
    setMessage('');
    alert(`Message sent to ${recipient}`);
  };

  return (
    <div className="messaging-container">
      <div className="messaging-form-card">
        <h3>Send a New Message</h3>
        <form onSubmit={handleSendMessage}>
          <div className="input-group">
            <label htmlFor="recipient">Recipient</label>
            <select id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)}>
              <option value="all">All Users</option>
              <option value="students">All Students</option>
              <option value="faculty">All Faculty</option>
              <option value="year1">1st Year Students</option>
              <option value="year2">2nd Year Students</option>
              <option value="year3">3rd Year Students</option>
              <option value="year4">4th Year Students</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn-send">Send Message</button>
        </form>
      </div>
      <div className="sent-messages-card">
        <h3>Sent Messages ({sentMessages.length})</h3>
        <div className="sent-messages-list">
          {sentMessages.length > 0 ? (
            sentMessages.slice().reverse().map(msg => (
              <div key={msg.id} className="message-item">
                <p className="message-text">{msg.text}</p>
                <div className="message-meta">
                  <span>To: {msg.recipient}</span>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No messages sent yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
