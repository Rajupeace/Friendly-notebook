const express = require('express');
const router = express.Router();
const dbFile = require('../dbHelper');

// Get courses for a specific student
router.get('/:studentId/courses', (req, res) => {
  try {
    const { studentId } = req.params;
    const students = dbFile('students').read();
    const student = students.find(s => s.sid === studentId || s.id === studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const courses = dbFile('courses').read() || [];
    
    // Filter courses based on student's year, branch, and section
    const studentCourses = courses.filter(course => {
      return course.year === student.year && 
             course.branch === student.branch &&
             (!course.sections || 
              course.sections.length === 0 || 
              (Array.isArray(course.sections) && course.sections.includes(student.section)) ||
              course.sections === student.section);
    });

    res.json(studentCourses);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course details with materials for a student
router.get('/:studentId/courses/:courseId', (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    // Verify student exists
    const students = dbFile('students').read();
    const student = students.find(s => s.sid === studentId || s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get course
    const courses = dbFile('courses').read() || [];
    const course = courses.find(c => 
      (c.id === courseId || c.courseCode === courseId) &&
      c.year === student.year &&
      c.branch === student.branch
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found or access denied' });
    }

    // Get course materials
    const materials = dbFile('materials').read() || [];
    const courseMaterials = materials.filter(m => {
      const matchesCourse = m.courseId === courseId || m.courseCode === courseId;
      const matchesYear = !m.year || m.year === student.year;
      const matchesBranch = !m.branch || m.branch === student.branch;
      const matchesSection = !m.section || 
                           m.section === student.section || 
                           (Array.isArray(m.section) && m.section.includes(student.section));
      
      return matchesCourse && matchesYear && matchesBranch && matchesSection;
    });

    res.json({
      ...course,
      materials: courseMaterials
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
});

module.exports = router;
