import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const CourseSection = ({ coursesList, newCourseData, setNewCourseData, handleCreateCourse, editCourse, deleteCourse, isAdmin = true }) => {
  // A simple alert for viewing course details.
  const viewCourse = (course) => {
    alert(JSON.stringify(course, null, 2));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="span" sx={{ mr: 1 }}>📚</Box>
        Course Management
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Course Creation Form */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Create New Course
        </Typography>
        <form onSubmit={handleCreateCourse} className="form-grid" style={{ width: '100%', marginBottom: '2rem' }}>
          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B3.1</span>
              Course Information
            </h4>
            <div className="form-group" data-section="1">
              <label htmlFor="courseName">Course Name</label>
              <input id="courseName" name="name" value={newCourseData.name} onChange={e => setNewCourseData({...newCourseData, name: e.target.value})} placeholder="Enter course name" required />
            </div>
            <div className="form-group" data-section="2">
              <label htmlFor="courseCode">Course Code</label>
              <input id="courseCode" name="code" value={newCourseData.code} onChange={e => setNewCourseData({...newCourseData, code: e.target.value})} placeholder="Enter course code" required />
            </div>
            <div className="form-group" data-section="3">
              <label htmlFor="branch">Branch</label>
              <select id="branch" name="branch" value={newCourseData.branch} onChange={e => setNewCourseData({...newCourseData, branch: e.target.value})}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B3.2</span>
              Academic Details
            </h4>
            <div className="form-group" data-section="4">
              <label htmlFor="year">Year</label>
              <select id="year" name="year" value={newCourseData.year} onChange={e => setNewCourseData({...newCourseData, year: e.target.value})}>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
            <div className="form-group" data-section="5">
              <label htmlFor="semester">Semester</label>
              <select id="semester" name="semester" value={newCourseData.semester} onChange={e => setNewCourseData({...newCourseData, semester: e.target.value})}>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <div className="form-group" data-section="6">
              <label htmlFor="credits">Credits</label>
              <input id="credits" name="credits" type="number" value={newCourseData.credits} onChange={e => setNewCourseData({...newCourseData, credits: e.target.value})} placeholder="Enter credits" required />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-title">
              <span className="section-number">B3.3</span>
              Additional Details
            </h4>
            <div className="form-group" data-section="7">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={newCourseData.description} onChange={e => setNewCourseData({...newCourseData, description: e.target.value})} placeholder="Enter course description"></textarea>
            </div>
            <div className="form-group" data-section="8">
              <label htmlFor="sections">Sections</label>
              <input id="sections" name="sections" value={newCourseData.sections} onChange={e => setNewCourseData({...newCourseData, sections: e.target.value})} placeholder="e.g., A, B, C or 1, 2, 3" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="submit-btn">Create Course</button>
            </div>
          </div>
        </form>

        {/* Current Courses Table */}
        <Typography variant="h6" component="h3" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
          Current Courses
        </Typography>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coursesList.map((course) => (
                <tr key={course.id}>
                  <td>{course.name || course.courseName}</td>
                  <td>{course.code || course.courseCode}</td>
                  <td>{course.branch}</td>
                  <td>Year {course.year}</td>
                  <td>Semester {course.semester}</td>
                  <td>{course.credits || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn-action" 
                      onClick={() => viewCourse(course)}
                      style={{ marginRight: '5px' }}
                    >
                      View
                    </button>
                    {isAdmin && (
                      <>
                        <button 
                          className="btn-action" 
                          onClick={() => editCourse(course.id)}
                          style={{ marginRight: '5px' }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-danger" 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${course.name || course.courseName}?`)) {
                              deleteCourse(course.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </Box>
  );
};

CourseSection.propTypes = {
  coursesList: PropTypes.array.isRequired,
  newCourseData: PropTypes.object.isRequired,
  setNewCourseData: PropTypes.func.isRequired,
  handleCreateCourse: PropTypes.func.isRequired,
  editCourse: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool
};

export default CourseSection;