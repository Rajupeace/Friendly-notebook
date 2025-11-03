import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const StudentsSection = ({ studentsList, handleCreateStudent, editStudent, deleteStudent }) => {
  // A simple alert for viewing student details.
  // In a real app, this would likely open a modal or a details page.
  const viewStudent = (student) => {
    alert(JSON.stringify(student, null, 2));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="span" sx={{ mr: 1 }}>👥</Box>
        Student Management
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Student Creation Form */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Create New Student
        </Typography>
        <form onSubmit={handleCreateStudent} className="form-grid" style={{ width: '100%', marginBottom: '2rem' }}>
          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B1.1</span>
              Personal Information
            </h4>
            <div className="form-group" data-section="1">
              <label htmlFor="studentName">Full Name</label>
              <input id="studentName" name="studentName" placeholder="Enter full name" required />
            </div>
            <div className="form-group" data-section="2">
              <label htmlFor="sid">Student ID (SID)</label>
              <input id="sid" name="sid" placeholder="Enter student ID" required />
            </div>
            <div className="form-group" data-section="3">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="Enter email address" />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B1.2</span>
              Academic Details
            </h4>
            <div className="form-group" data-section="4">
              <label htmlFor="branch">Branch</label>
              <select id="branch" name="branch">
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div className="form-group" data-section="5">
              <label htmlFor="year">Year</label>
              <select id="year" name="year">
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
            <div className="form-group" data-section="6">
              <label htmlFor="section">Section</label>
              <select id="section" name="section">
                {Array.from({ length: 20 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)).map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B1.3</span>
              Account Security
            </h4>
            <div className="form-group" data-section="7">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter password (optional)" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="submit-btn">Create Student Account</button>
            </div>
          </div>
        </form>

        {/* Student List Table */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Current Students
        </Typography>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student) => {
                const allowedActions = student.actions || ['view', 'edit', 'delete'];
                return (
                  <tr key={student.sid || student.email}>
                    <td>{student.studentName}</td>
                    <td>{student.sid}</td>
                    <td>{student.branch}</td>
                    <td>{student.year}</td>
                    <td>{student.section}</td>
                    <td>
                      {allowedActions.includes('view') && (
                        <button className="btn-action" onClick={() => viewStudent(student)}>View</button>
                      )}
                      {allowedActions.includes('edit') && (
                        <button className="btn-action" onClick={() => editStudent(student.sid)}>Edit</button>
                      )}
                      {allowedActions.includes('delete') && (
                        <button className="btn-danger" onClick={() => deleteStudent(student.sid)}>Delete</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Paper>
    </Box>
  );
};

StudentsSection.propTypes = {
  studentsList: PropTypes.array.isRequired,
  handleCreateStudent: PropTypes.func.isRequired,
  editStudent: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired
};

export default StudentsSection;