import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const FacultySection = ({ facultyList, handleCreateFaculty, editFaculty, deleteFaculty }) => {
  // A simple alert for viewing faculty details.
  const viewFaculty = (faculty) => {
    alert(JSON.stringify(faculty, null, 2));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="span" sx={{ mr: 1 }}>👨‍🏫</Box>
        Faculty Management
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Faculty Creation Form */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Create New Faculty Account
        </Typography>
        <form onSubmit={handleCreateFaculty} className="form-grid" style={{ width: '100%', marginBottom: '2rem' }}>
          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B2.1</span>
              Personal Information
            </h4>
            <div className="form-group" data-section="1">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" placeholder="Enter full name" required />
            </div>
            <div className="form-group" data-section="2">
              <label htmlFor="facultyId">Faculty ID (FID)</label>
              <input id="facultyId" name="facultyId" placeholder="Enter faculty ID" required />
            </div>
            <div className="form-group" data-section="3">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="Enter email address" />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B2.2</span>
              Department Details
            </h4>
            <div className="form-group" data-section="4">
              <label htmlFor="department">Department</label>
              <select id="department" name="department">
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div className="form-group" data-section="5">
              <label htmlFor="designation">Designation</label>
              <select id="designation" name="designation">
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B2.3</span>
              Account Security
            </h4>
            <div className="form-group" data-section="6">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter password" required />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="submit-btn">Create Faculty Account</button>
            </div>
          </div>
        </form>

        {/* Current Faculty Table */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Current Faculty
        </Typography>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Faculty ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map((faculty) => {
                const allowedActions = faculty.actions || ['view', 'edit', 'delete'];
                return (
                  <tr key={faculty.facultyId || faculty.email}>
                    <td>{faculty.name}</td>
                    <td>{faculty.facultyId}</td>
                    <td>{faculty.department || 'N/A'}</td>
                    <td>{faculty.designation || 'N/A'}</td>
                    <td>
                      {allowedActions.includes('view') && (
                        <button className="btn-action" onClick={() => viewFaculty(faculty)}>View</button>
                      )}
                      {allowedActions.includes('edit') && (
                        <button className="btn-action" onClick={() => editFaculty(faculty.facultyId)}>Edit</button>
                      )}
                      {allowedActions.includes('delete') && (
                        <button className="btn-danger" onClick={() => deleteFaculty(faculty.facultyId)}>Delete</button>
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

FacultySection.propTypes = {
  facultyList: PropTypes.array.isRequired,
  handleCreateFaculty: PropTypes.func.isRequired,
  editFaculty: PropTypes.func.isRequired,
  deleteFaculty: PropTypes.func.isRequired
};

export default FacultySection;