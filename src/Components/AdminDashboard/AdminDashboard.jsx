import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material-UI components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StudentsSection from './Sections/StudentsSection';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import FacultySection from './Sections/FacultySection';
import CourseSection from './Sections/CourseSection';
import ContentManager from './ContentManager';
import Messaging from './Messaging';
import './AdminDashboard.css';
import { readFaculty, addFaculty, readStudents, writeStudents, writeFaculty, addMessage } from '../../utils/localdb';
import api from '../../utils/apiClient';

const USE_API = Boolean(process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.length);

export default function AdminDashboard({ setIsAuthenticated, setIsAdmin, setStudentData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // State management
  const [studentsList, setStudentsList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [newCourseData, setNewCourseData] = useState({ 
    name: '', 
    code: '', 
    year: '', 
    semester: '', 
    branch: 'CSE', 
    sections: '', 
    description: '' 
  });
  // Handle user logout
  const handleLogout = () => {
    if (USE_API) {
      api.adminLogout().catch(() => {});
      try { 
        window.localStorage.removeItem('adminToken'); 
      } catch (e) {
        console.error('Error removing token:', e);
      }
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
    setStudentData(null);
  };

  const saveStudents = async (arr) => { await writeStudents(arr); setStudentsList(arr); };

  useEffect(() => {
    const load = async () => {
      try {
        if (USE_API) {
          const s = await api.apiGet('/api/students');
          const f = await api.apiGet('/api/faculty');
          const c = await api.apiGet('/api/courses');
          const m = await api.apiGet('/api/materials');
          const msgs = await api.apiGet('/api/messages');
          setStudentsList(s || []);
          setFacultyList(f || []);
          setCoursesList(c || []);
          setMaterialsList(m || []);
          const announcements = (msgs || []).filter(msg => msg.type === 'announcements');
          setMaterialsList(prev => [...prev, ...announcements]);
        } else {
          const s = await readStudents();
          const f = await readFaculty();
          setStudentsList(s || []);
          setFacultyList(f || []);
          setCoursesList([]);
          setMaterialsList([]);

          if ((!s || s.length === 0) && !USE_API) {
            const seedStudents = [
              { studentName: 'deepu', sid: '231fa4573', branch: 'CSE', year: '3', section: '5', actions: ['view','edit','delete'] },
              { studentName: 'purna', sid: '231fa4b58', branch: 'CSE', year: '3', section: 'D', actions: ['view','edit','delete'] },
              { studentName: 'vivek', sid: '231fa04948', branch: 'CSE', year: '1', section: 'A', actions: ['view','edit','delete'] },
              { studentName: 'mary.satvika', sid: '231fa04434', branch: 'CSE', year: '3', section: '10', actions: ['view','edit','delete'] },
              { studentName: 'John Doe', sid: 'student001', branch: 'CSE', year: '1', section: 'A', actions: ['view','edit','delete'] },
              { studentName: 'Jane Smith', sid: 'student002', branch: 'CSE', year: '2', section: 'B', actions: ['view'] }
            ];
            try { await writeStudents(seedStudents); } catch(e) { /* ignore write errors */ }
            setStudentsList(seedStudents);
          }

          if ((!f || f.length === 0) && !USE_API) {
            const seedFaculty = [
              { name: 'Badisa Srikanth', facultyId: '2314470', email: 'rajubhi@gmail.com', assignments: [], actions: ['view','edit','delete'] },
              { name: 'Faculty Reddy', facultyId: 'ReddyFBN@1228', email: 'reddy@friendlycollege.edu', assignments: [{ year: '2', subject: 'Computer Science', sections: ['A','B'] }, { year: '3', subject: 'Data Structures', sections: ['A'] }], actions: ['view','edit','delete'] },
              { name: 'Prof. Smith', facultyId: 'faculty001', email: 'smith@friendlycollege.edu', assignments: [], actions: ['view','edit','delete'] }
            ];
            try { await writeFaculty(seedFaculty); } catch(e) { /* ignore write errors */ }
            setFacultyList(seedFaculty);
          }

          try {
            const existingRaw = localStorage.getItem('courseMaterials') || localStorage.getItem('materials') || null;
            if (!existingRaw) {
              const seedMaterials = [
                { id: 'note-1', title: 'notes cs Notes', subject: 'Advance Courses', type: 'notes', year: 'All', section: 'All', uploadedAt: '2025-10-23', uploadedBy: 'admin' },
                { id: 'note-2', title: 'DSA Notes', subject: 'Advance Courses', type: 'notes', year: 'All', section: 'All', uploadedAt: '2025-10-23', uploadedBy: 'admin' },
                { id: 'note-3', title: 'Java Programming Basics', subject: 'Advance Courses', type: 'notes', year: 'All', section: 'All', uploadedAt: '2025-10-23', uploadedBy: 'admin' },
                { id: 'note-4', title: 'C Programming Fundamentals', subject: 'Advance Courses', type: 'notes', year: 'All', section: 'All', uploadedAt: '2025-10-23', uploadedBy: 'admin' }
              ];
              setMaterialsList(seedMaterials);
            }
          } catch (e) {
            // ignore storage read errors
          }
        }
      } catch (err) {
        console.error('Failed to load lists', err);
      }
    };
    load();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Basic validation
    if (!form.name.value || !form.code.value || !form.year.value || !form.semester.value) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate course code format (e.g., CSE101)
    const codeRegex = /^[A-Za-z]{2,4}\d{3}$/;
    if (!codeRegex.test(form.code.value)) {
      alert('Course code must be 2-4 letters followed by 3 numbers (e.g., CSE101)');
      return;
    }

    const courseData = {
      name: form.name.value.trim(),
      code: form.code.value.toUpperCase(),
      year: form.year.value,
      semester: form.semester.value,
      branch: form.branch.value,
      sections: form.sections.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean),
      description: form.description.value.trim(),
      credits: parseInt(form.credits.value) || 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // For backward compatibility
      courseCode: form.code.value.toUpperCase(),
      courseName: form.name.value.trim()
    };

    try {
      if (USE_API) {
        // Check if course with same code already exists
        const existingCourse = coursesList.find(c => 
          c.code === courseData.code || c.courseCode === courseData.code
        );
        
        if (existingCourse) {
          if (!window.confirm('A course with this code already exists. Update it?')) {
            return;
          }
          // Update existing course
          const updated = await api.apiPut(
            `/api/courses/${existingCourse.id || existingCourse._id}`, 
            courseData
          );
          setCoursesList(prev => 
            prev.map(c => (c.id === existingCourse.id || c._id === existingCourse._id) ? updated : c)
          );
          alert('Course updated successfully');
        } else {
          // Create new course
          const created = await api.apiPost('/api/courses', courseData);
          setCoursesList(prev => [...prev, created]);
          alert('Course created successfully');
        }
      } else {
        // Local storage implementation
        const newCourse = {
          ...courseData,
          id: `course-${Date.now()}`,
          courseCode: courseData.code,
          courseName: courseData.name
        };
        setCoursesList(prev => [...prev, newCourse]);
        alert('Course created successfully');
      }

      // Reset form
      form.reset();
      setNewCourseData({ 
        name: '', 
        code: '', 
        year: '', 
        semester: '', 
        branch: 'CSE',
        credits: 3,
        sections: '', 
        description: '' 
      });

      // Refresh courses list if using API
      if (USE_API) {
        const updatedCourses = await api.apiGet('/api/courses');
        setCoursesList(updatedCourses || []);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save course. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      console.error('Invalid course ID for deletion');
      return;
    }

    // Find course to get its name for confirmation
    const courseToDelete = coursesList.find(c => c.id === courseId || c.courseCode === courseId);
    if (!courseToDelete) {
      alert('Course not found');
      return;
    }

    const courseName = courseToDelete.name || courseToDelete.courseName || 'this course';
    const confirmation = window.confirm(`Are you sure you want to delete "${courseName}"? This will also remove all associated materials and cannot be undone.`);
    
    if (!confirmation) {
      return;
    }

    try {
      if (USE_API) {
        await api.apiDelete(`/api/courses/${courseId}`);
      }
      
      // Update local state
      setCoursesList(prev => 
        prev.filter(course => course.id !== courseId && course.courseCode !== courseId)
      );
      
      // Also clean up any related materials
      if (materialsList.length > 0) {
        const updatedMaterials = materialsList.filter(
          material => material.courseId !== courseId && material.courseCode !== courseId
        );
        setMaterialsList(updatedMaterials);
      }
      
      // Show success message with course name
      alert(`Course "${courseName}" has been deleted successfully.`);
      
    } catch (error) {
      console.error('Error deleting course:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete course. Please try again.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditCourse = async (courseId) => {
    try {
      const courseToEdit = coursesList.find(c => c.id === courseId);
      if (!courseToEdit) {
        alert('Course not found');
        return;
      }

      // Store the original course ID for update
      const originalCourseId = courseToEdit.id;
      
      // Set form data with existing course details
      setNewCourseData({
        name: courseToEdit.name || courseToEdit.courseName || '',
        code: courseToEdit.code || courseToEdit.courseCode || '',
        year: courseToEdit.year || '',
        semester: courseToEdit.semester || '',
        branch: courseToEdit.branch || 'CSE',
        sections: courseToEdit.sections || '',
        description: courseToEdit.description || '',
        credits: courseToEdit.credits || 3,
        _originalId: originalCourseId // Store original ID for update
      });

      // Scroll to form
      const formElement = document.querySelector('.form-grid');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error preparing course for edit:', error);
      alert('Failed to load course details. Please try again.');
    }
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      if (USE_API) {
        const materials = await api.apiGet('/api/materials');
        const messages = await api.apiGet('/api/messages');
        const item = materials.find(m => m.id === id) || messages.find(m => m.id === id);

        if (item && item.type === 'announcements') {
          await api.apiDelete(`/api/messages/${id}`);
        } else {
          await api.apiDelete(`/api/materials/${id}`);
        }
        setMaterialsList(prev => prev.filter(m => m.id !== id));
      } else {
        const materials = JSON.parse(localStorage.getItem('courseMaterials') || '{}');

        Object.keys(materials).forEach(year => {
          Object.keys(materials[year]).forEach(section => {
            Object.keys(materials[year][section]).forEach(subject => {
              Object.keys(materials[year][section][subject]).forEach(type => {
                materials[year][section][subject][type] = materials[year][section][subject][type].filter(m => m.id !== id);
                
                // Remove empty type arrays
                if (materials[year][section][subject][type].length === 0) {
                  delete materials[year][section][subject][type];
                }
              });
              
              // Remove empty subject objects
              if (Object.keys(materials[year][section][subject]).length === 0) {
                delete materials[year][section][subject];
              }
            });
            
            // Remove empty section objects
            if (Object.keys(materials[year][section]).length === 0) {
              delete materials[year][section];
            }
          });
          
          // Remove empty year objects
          if (Object.keys(materials[year]).length === 0) {
            delete materials[year];
          }
        });

        // Handle messages in localStorage
        if (localStorage.getItem('messages')) {
          const messages = JSON.parse(localStorage.getItem('messages') || '[]');
          const filtered = messages.filter(m => m.id !== id);
          localStorage.setItem('messages', JSON.stringify(filtered));
        }

        localStorage.setItem('courseMaterials', JSON.stringify(materials));
        setMaterialsList(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
    }
  };

  const handleUploadMaterial = async (e, defaultType = null) => {
    e.preventDefault();
    const f = e.target;
    const year = f.year.value;
    const section = f.section.value;
    const subject = f.subject.value;
    const type = defaultType || f.type.value;
    const title = f.title.value || '';
    const file = f.file?.files[0];
    const url = f.url?.value || '';
    const duration = f.duration?.value || '';
    const examYear = f.examYear?.value || '';
    const examType = f.examType?.value || '';
    const message = f.message?.value || '';

    try {
      if (USE_API) {
        const formData = new FormData();
        formData.append('year', year);
        formData.append('section', section);
        formData.append('subject', subject);
        formData.append('type', type);
        formData.append('title', title);

        if (type === 'videos') {
          if (url) formData.append('link', url);
          if (duration) formData.append('message', duration); 
        } else if (type === 'modelPapers' || type === 'previousQuestions') {
          if (examYear) formData.append('dueDate', examYear); 
          if (examType) formData.append('message', examType); 
        } else if (type === 'announcements') {
          formData.append('message', message);
        }

        if (file) formData.append('file', file);

        await api.apiUpload('/api/materials', formData);
        alert('Uploaded successfully');
        setTimeout(() => window.location.reload(), 400);
      } else {
        const item = {
          id: Date.now(),
          title: title || (file ? file.name : ''),
          year,
          section,
          subject,
          type,
          uploadedAt: new Date().toISOString()
        };

        if (type === 'videos') {
          item.url = url;
          item.duration = duration;
        } else if (type === 'modelPapers' || type === 'previousQuestions') {
          item.examYear = examYear;
          item.examType = examType;
        } else if (type === 'announcements') {
          item.message = message;
        }

        if (file) {
          item.url = URL.createObjectURL(file);
        }

        const materials = JSON.parse(localStorage.getItem('courseMaterials') || '{}');
        if (!materials[year]) materials[year] = {};
        if (!materials[year][section]) materials[year][section] = {};
        if (!materials[year][section][subject]) materials[year][section][subject] = {};
        if (!materials[year][section][subject][type]) materials[year][section][subject][type] = [];
        materials[year][section][subject][type].push(item);
        localStorage.setItem('courseMaterials', JSON.stringify(materials));

        setMaterialsList(prev => [...prev, item]);
        f.reset();
        alert('Uploaded successfully');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const m = e.target.message.value.trim();
    const target = e.target.target?.value || 'all';
    const year = e.target.year?.value || null;
    const section = e.target.section?.value || null;
    const subject = e.target.subject?.value || null;

    if (!m) return alert('Message empty');

    if (USE_API) {
      api.apiPost('/api/announcements', { message: m, target, year, section, subject }).then(() => {
        e.target.reset();
        alert('Announcement sent');
        setTimeout(() => window.location.reload(), 400);
      }).catch((err) => { console.error(err); alert('Failed to send announcement'); });
    } else {
      addMessage({ message: m, createdAt: new Date().toISOString(), target, type: 'announcements' });
      e.target.reset();
      alert('Announcement sent');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const studentData = {
      studentName: form.studentName.value,
      sid: form.sid.value,
      email: form.email.value,
      branch: form.branch.value,
      year: form.year.value,
      section: form.section.value,
      password: form.password.value,
    };

    try {
      if (USE_API) {
        const newStudent = await api.apiPost('/api/students', studentData);
        setStudentsList(prev => [...prev, newStudent]);
      } else {
        const students = await readStudents();
        students.push({ ...studentData, id: Date.now().toString() });
        await saveStudents(students);
      }
      form.reset();
      alert('Student created successfully!');
    } catch (err) {
      console.error('Failed to create student:', err);
      alert('Failed to create student: ' + (err.message || 'Unknown error'));
    }
  };

  const editStudent = async (sid) => {
    const student = studentsList.find(s => s.sid === sid);
    if (!student) return alert('Student not found');

    const studentName = window.prompt('Enter new name:', student.studentName);
    if (studentName) {
      const updatedStudent = { ...student, studentName };
      const updatedList = studentsList.map(s => s.sid === sid ? updatedStudent : s);
      await saveStudents(updatedList);
      alert('Student updated!');
    }
  };


  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const facultyId = form.facultyId.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!name || !facultyId || !password) {
      alert('Please fill in all required fields: Name, Faculty ID, and Password');
      return;
    }

    let assignments = [];
    try {
      const assignmentsJson = form.assignmentsJson?.value?.trim();
      if (assignmentsJson) {
        const parsedAssignments = JSON.parse(assignmentsJson);
        if (Array.isArray(parsedAssignments) && parsedAssignments.length > 0) {
          assignments = parsedAssignments;
        }
      }
    } catch (err) {
      console.warn('Invalid assignments JSON provided for faculty', err);
    }

    const newFaculty = { name, facultyId, email, password, assignments };

    try {
      if (USE_API) {
        console.log('Creating faculty with data:', newFaculty);
        const created = await api.apiPost('/api/faculty', newFaculty);
        console.log('Faculty created successfully:', created);
        setFacultyList(prev => prev.concat(created));
        form.reset();
        alert(`Faculty account created successfully! Faculty can now login with ID: ${facultyId}`);
      } else {
        try {
          await addFaculty(newFaculty);
          const f = await readFaculty();
          setFacultyList(f);
          form.reset();
          alert('Faculty account created successfully.');
        } catch (err) {
          console.error('Local faculty creation error:', err);
          alert('Failed to create faculty locally');
        }
      }
    } catch (err) {
      console.error('Faculty creation error:', err);
      alert(`Failed to create faculty: ${err.message || 'Unknown error'}`);
    }
  };

  const editFaculty = async (fid) => {
    try {
      let oldFaculty;
      let name, email, password;
      
      if (USE_API) {
        const faculty = await api.apiGet('/api/faculty');
        oldFaculty = faculty.find(f => f.facultyId === fid);
      } else {
        const faculty = await readFaculty();
        oldFaculty = faculty.find(f => f.facultyId === fid);
      }
      
      if (!oldFaculty) return alert('Faculty not found');

      name = window.prompt('Full name', oldFaculty.name) || oldFaculty.name;
      email = window.prompt('Email', oldFaculty.email || '') || oldFaculty.email;
      password = window.prompt('Password (leave blank to keep)', '') || oldFaculty.password;

      const updated = { ...oldFaculty, name, email, password };

      if (USE_API) {
        await api.apiPut(`/api/faculty/${fid}`, updated);
        setFacultyList(prev => prev.map(p => (p.facultyId === fid ? updated : p)));
      } else {
        const faculty = await readFaculty();
        const updatedArr = faculty.map(f => (f.facultyId === fid ? updated : f));
        await writeFaculty(updatedArr);

        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const updatedMessages = messages.map(m => {
          if (m.facultyId === fid) {
            return { ...m, facultyName: name };
          }
          return m;
        });
        localStorage.setItem('messages', JSON.stringify(updatedMessages));

        const materials = JSON.parse(localStorage.getItem('courseMaterials') || '{}');
        Object.keys(materials).forEach(year => {
          Object.keys(materials[year]).forEach(section => {
            Object.keys(materials[year][section]).forEach(subject => {
              Object.keys(materials[year][section][subject]).forEach(type => {
                materials[year][section][subject][type] = materials[year][section][subject][type]
                  .map(m => {
                    if (m.uploadedBy === fid) {
                      return { ...m, uploaderName: name };
                    }
                    return m;
                  });
              });
            });
          });
        });
        localStorage.setItem('courseMaterials', JSON.stringify(materials));

        const fresh = await readFaculty();
        setFacultyList(fresh);
      }
      alert('Faculty updated successfully');
    } catch (err) {
      console.error('Failed to update faculty:', err);
      alert('Update failed: ' + (err.message || 'Unknown error'));
    }
  };

  const deleteStudent = async (sid) => {
    if (!window.confirm('Delete student?')) return;
    try {
      if (USE_API) {
        await api.apiDelete(`/api/students/${sid}`);
      } else {
        const arr = await readStudents();
        const student = arr.find(s => s.sid === sid);
        if (!student) {
          throw new Error('Student not found');
        }
        const next = arr.filter(s => s.sid !== sid);
        await writeStudents(next);

        const materials = JSON.parse(localStorage.getItem('courseMaterials') || '{}');
        localStorage.setItem('courseMaterials', JSON.stringify(materials));
        
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const filteredMessages = messages.filter(m => m.studentId !== sid);
        localStorage.setItem('messages', JSON.stringify(filteredMessages));
      }
      setStudentsList(prev => prev.filter(s => s.sid !== sid));
      alert('Student deleted successfully');
    } catch (err) {
      console.error('Failed to delete student:', err);
      alert('Failed to delete student: ' + (err.message || 'Unknown error'));
    }
  };

  const deleteFaculty = async (fid) => {
    if (!window.confirm('Delete faculty?')) return;
    try {
      if (USE_API) {
        await api.apiDelete(`/api/faculty/${fid}`);
      } else {
        const arr = await readFaculty();
        const faculty = arr.find(f => f.facultyId === fid);
        if (!faculty) {
          throw new Error('Faculty not found');
        }
        const next = arr.filter(f => f.facultyId !== fid);
        await writeFaculty(next);

        const materials = JSON.parse(localStorage.getItem('courseMaterials') || '{}');
        Object.keys(materials).forEach(year => {
          Object.keys(materials[year]).forEach(section => {
            Object.keys(materials[year][section]).forEach(subject => {
              Object.keys(materials[year][section][subject]).forEach(type => {
                materials[year][section][subject][type] = materials[year][section][subject][type]
                  .filter(m => m.uploadedBy !== fid);
              });
            });
          });
        });
        localStorage.setItem('courseMaterials', JSON.stringify(materials));

        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        const filteredMessages = messages.filter(m => m.facultyId !== fid);
        localStorage.setItem('messages', JSON.stringify(filteredMessages));
      }
      setFacultyList(prev => prev.filter(f => f.facultyId !== fid));
      alert('Faculty deleted successfully');
    } catch (err) {
      console.error('Failed to delete faculty:', err);
      alert('Failed to delete faculty: ' + (err.message || 'Unknown error'));
    }
  };

  // Helper function to render the overview tab content
  const renderOverview = () => {
    const materialTypes = [
      { type: 'notes', label: 'Notes', icon: <DescriptionIcon color="primary" />, color: 'primary' },
      { type: 'assignments', label: 'Assignments', icon: <AssignmentIcon color="secondary" />, color: 'secondary' },
      { type: 'papers', label: 'Question Papers', icon: <FindInPageIcon color="warning" />, color: 'warning' },
    ];
    const yearTypes = [
      { year: '1', label: 'Year 1', icon: <LooksOneIcon color="primary" />, color: 'primary' },
      { year: '2', label: 'Year 2', icon: <LooksTwoIcon color="secondary" />, color: 'secondary' },
      { year: '3', label: 'Year 3', icon: <Looks3Icon color="success" />, color: 'success' },
      { year: '4', label: 'Year 4', icon: <Looks4Icon color="warning" />, color: 'warning' },
    ];

    return (
      <Box sx={{ p: 3 }}>
        {/* Stats Cards Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="h6">Total Students</Typography>
                    <Typography variant="h4">{studentsList.length}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      +12% from last month
                    </Typography>
                  </Box>
                  <SchoolIcon color="primary" sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="h6">Faculty Members</Typography>
                    <Typography variant="h4">{facultyList.length}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      +2 this month
                    </Typography>
                  </Box>
                  <PeopleIcon color="secondary" sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="h6">Courses</Typography>
                    <Typography variant="h4">{coursesList.length}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {coursesList.filter(c => c.year === '3').length} in 3rd Year
                    </Typography>
                  </Box>
                  <BookIcon color="success" sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="h6">Study Materials</Typography>
                    <Typography variant="h4">{materialsList.length}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {materialsList.filter(m => m.type === 'notes').length} Notes
                    </Typography>
                  </Box>
                  <InsertDriveFileIcon color="warning" sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  
        {/* Material Breakdown Section */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Material Breakdown</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* By Type */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>By Type</Typography>
                <Grid container spacing={2}>
                  {materialTypes.map(item => {
                    const count = materialsList.filter(m => m.type === item.type).length;
                    return (
                      <Grid item xs={12} sm={4} key={item.type}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                          <Box sx={{ color: `${item.color}.main` }}>{React.cloneElement(item.icon, { sx: { fontSize: 32 } })}</Box>
                          <Typography variant="h6">{count}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
  
              {/* By Year */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>By Year</Typography>
                <Grid container spacing={2}>
                  {yearTypes.map(item => {
                    const count = materialsList.filter(m => m.year === item.year || m.year === 'All').length;
                    return (
                      <Grid item xs={6} sm={3} key={item.year}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                          <Box sx={{ color: `${item.color}.main` }}>{React.cloneElement(item.icon, { sx: { fontSize: 32 } })}</Box>
                          <Typography variant="h6">{count}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
  
        {/* Recent Uploads */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Uploads</Typography>
            <Divider sx={{ mb: 2 }} />
            {materialsList.slice(0, 5).map((material, index) => (
              <Box key={index} sx={{ 
                p: 2, 
                mb: 1, 
                borderRadius: 1, 
                bgcolor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  <Typography variant="subtitle1">{material.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {material.subject} • {material.uploadedAt} • {material.uploadedBy}
                  </Typography>
                </Box>
                <Chip 
                  label={material.type} 
                  size="small" 
                  color={
                    material.type === 'notes' ? 'primary' : 
                    material.type === 'assignments' ? 'secondary' : 'default'
                  }
                />
              </Box>
            ))}
            {materialsList.length === 0 && (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 3 }}>
                No materials uploaded yet
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="admin-dashboard" sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ mb: 3, borderRadius: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Typography variant="h5" component="h1">Admin Dashboard</Typography>
          <Box>
            <Chip 
              icon={<AssessmentIcon />} 
              label="Analytics" 
              onClick={() => setActiveTab('overview')}
              sx={{ 
                mr: 1, 
                bgcolor: activeTab === 'overview' ? 'primary.dark' : 'primary.light',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            />
            <Chip 
              label="Logout" 
              onClick={handleLogout} 
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Box sx={{ display: 'flex', overflowX: 'auto', py: 1 }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'students', label: 'Students' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'courses', label: 'Courses' },
              { id: 'content', label: 'Content Manager' },
              { id: 'messaging', label: 'Messaging' }
            ].map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  px: 3,
                  py: 1.5,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? `3px solid ${theme.palette.primary.main}` : 'none',
                  color: activeTab === tab.id ? 'primary.main' : 'text.secondary',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }
                }}
              >
                {tab.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ px: isMobile ? 1 : 3, pb: 4 }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              <StudentsSection 
                studentsList={studentsList} 
                setStudentsList={setStudentsList} 
                saveStudents={saveStudents}
                handleCreateStudent={handleCreateStudent}
                editStudent={editStudent}
                deleteStudent={deleteStudent}
              />
            </Paper>
          </Box>
        )}
        {activeTab === 'faculty' && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <FacultySection 
              facultyList={facultyList} 
              setFacultyList={setFacultyList}
              handleCreateFaculty={handleCreateFaculty}
              editFaculty={editFaculty}
              deleteFaculty={deleteFaculty}
            />
          </Paper>
        )}
        {activeTab === 'courses' && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <CourseSection
              coursesList={coursesList}
              newCourseData={newCourseData}
              setNewCourseData={setNewCourseData}
              handleCreateCourse={handleCreateCourse}
              editCourse={handleEditCourse}
              deleteCourse={handleDeleteCourse}
              isAdmin={true}
            />
          </Paper>
        )}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'messaging' && <Messaging />}
        {activeTab === 'videos' && (
          <div className="section-card">
            <h3 className="section-title">🎥 Video Management</h3>
            <form onSubmit={(e) => handleUploadMaterial(e, 'videos')} className="form-grid">
              <div className="form-group">
                <label htmlFor="year">Academic Year</label>
                <select id="year" name="year" required>
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <input id="section" name="section" placeholder="Enter section (e.g. A)" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select Subject</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="module">Module</label>
                <select id="module" name="module" required>
                  <option value="">Select Module</option>
                  <option value="1">Module 1</option>
                  <option value="2">Module 2</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select id="unit" name="unit" required>
                  <option value="">Select Unit</option>
                  <option value="1">Unit 1</option>
                  <option value="2">Unit 2</option>
                  <option value="3">Unit 3</option>
                  <option value="4">Unit 4</option>
                </select>
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  Module 1: Units 1-2 | Module 2: Units 3-4
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="title">Video Title</label>
                <input id="title" name="title" placeholder="Enter video title" />
              </div>
              <div className="form-group">
                <label htmlFor="url">Video URL</label>
                <input id="url" name="url" placeholder="YouTube, Vimeo, or direct video link" />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input id="duration" name="duration" placeholder="e.g., 30 min, 1 hour 15 min" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="submit-btn">Add Video</button>
              </div>
            </form>

            <div className="filters-container">
              <div className="filter-group">
                <label>Filter by Year</label>
                <select id="videos-filter-year">
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by Subject</label>
                <select id="videos-filter-subject">
                  <option value="">All Subjects</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Video Title</th>
                    <th>Subject</th>
                    <th>Module</th>
                    <th>Unit</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.filter(m => m.type === 'videos').map((video) => (
                    <tr key={video.id}>
                      <td><strong>{video.title}</strong></td>
                      <td>{video.subject}</td>
                      <td>{video.module ? `Module ${video.module}` : '-'}</td>
                      <td>{video.unit ? `Unit ${video.unit}` : '-'}</td>
                      <td>{video.year}</td>
                      <td>{video.section}</td>
                      <td>{video.duration}</td>
                      <td>
                        {video.url && (
                          <a className="btn-action" href={video.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>Watch</a>
                        )}
                        <button className="btn-danger" onClick={() => deleteMaterial(video.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'papers' && (
          <div className="section-card">
            <h3 className="section-title">📄 Model Papers & Previous Questions</h3>
            <form onSubmit={(e) => handleUploadMaterial(e, 'modelPapers')} className="form-grid">
              <div className="form-group">
                <label htmlFor="year">Academic Year</label>
                <select id="year" name="year" required>
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <input id="section" name="section" placeholder="Enter section (e.g. A)" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select Subject</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="module">Module</label>
                <select id="module" name="module" required>
                  <option value="">Select Module</option>
                  <option value="1">Module 1</option>
                  <option value="2">Module 2</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select id="unit" name="unit" required>
                  <option value="">Select Unit</option>
                  <option value="1">Unit 1</option>
                  <option value="2">Unit 2</option>
                  <option value="3">Unit 3</option>
                  <option value="4">Unit 4</option>
                </select>
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  Module 1: Units 1-2 | Module 2: Units 3-4
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="title">Paper Title</label>
                <input id="title" name="title" placeholder="Enter paper title" />
              </div>
              <div className="form-group">
                <label htmlFor="examYear">Exam Year</label>
                <input id="examYear" name="examYear" placeholder="e.g., 2023, 2022" />
              </div>
              <div className="form-group">
                <label htmlFor="examType">Exam Type</label>
                <select id="examType" name="examType">
                  <option value="">Select Exam Type</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Internal">Internal Assessment</option>
                  <option value="Model Paper">Model Paper</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="file">Upload Question Paper</label>
                <input id="file" name="file" type="file" accept=".pdf,.doc,.docx" required />
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Supported formats: PDF, DOC, DOCX</small>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="solutionFile">Upload Solution (Optional)</label>
                <input id="solutionFile" name="solutionFile" type="file" accept=".pdf,.doc,.docx" />
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Upload solutions or answer keys</small>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="submit-btn">Upload Model Paper</button>
              </div>
            </form>

            <div className="filters-container">
              <div className="filter-group">
                <label>Filter by Year</label>
                <select id="papers-filter-year">
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by Subject</label>
                <select id="papers-filter-subject">
                  <option value="">All Subjects</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Paper Title</th>
                    <th>Subject</th>
                    <th>Module</th>
                    <th>Unit</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Exam Year</th>
                    <th>Exam Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.filter(m => m.type === 'modelPapers' || m.type === 'previousQuestions').map((paper) => (
                    <tr key={paper.id}>
                      <td><strong>{paper.title}</strong></td>
                      <td>{paper.subject}</td>
                      <td>{paper.module ? `Module ${paper.module}` : '-'}</td>
                      <td>{paper.unit ? `Unit ${paper.unit}` : '-'}</td>
                      <td>{paper.year}</td>
                      <td>{paper.section}</td>
                      <td>{paper.examYear}</td>
                      <td>{paper.examType}</td>
                      <td>
                        {paper.url && (
                          <a className="btn-action" href={paper.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>View</a>
                        )}
                        <button className="btn-danger" onClick={() => deleteMaterial(paper.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="section-card">
            <h3 className="section-title">📋 Syllabus Management</h3>
            <form onSubmit={(e) => handleUploadMaterial(e, 'syllabus')} className="form-grid">
              <div className="form-group">
                <label htmlFor="year">Academic Year</label>
                <select id="year" name="year" required>
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <input id="section" name="section" placeholder="Enter section (e.g. A)" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select Subject</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="module">Module</label>
                <select id="module" name="module" required>
                  <option value="">Select Module</option>
                  <option value="1">Module 1</option>
                  <option value="2">Module 2</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select id="unit" name="unit" required>
                  <option value="">Select Unit</option>
                  <option value="1">Unit 1</option>
                  <option value="2">Unit 2</option>
                  <option value="3">Unit 3</option>
                  <option value="4">Unit 4</option>
                </select>
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  Module 1: Units 1-2 | Module 2: Units 3-4
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="title">Syllabus Title</label>
                <input id="title" name="title" placeholder="Enter syllabus title" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="file">Upload Syllabus File</label>
                <input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.txt" required />
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Supported formats: PDF, DOC, DOCX, TXT</small>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="submit-btn">Upload Syllabus</button>
              </div>
            </form>

            <div className="filters-container">
              <div className="filter-group">
                <label>Filter by Year</label>
                <select id="syllabus-filter-year">
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by Subject</label>
                <select id="syllabus-filter-subject">
                  <option value="">All Subjects</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Syllabus Title</th>
                    <th>Subject</th>
                    <th>Module</th>
                    <th>Unit</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.filter(m => m.type === 'syllabus').map((syllabus) => (
                    <tr key={syllabus.id}>
                      <td><strong>{syllabus.title}</strong></td>
                      <td>{syllabus.subject}</td>
                      <td>{syllabus.module ? `Module ${syllabus.module}` : '-'}</td>
                      <td>{syllabus.unit ? `Unit ${syllabus.unit}` : '-'}</td>
                      <td>{syllabus.year}</td>
                      <td>{syllabus.section}</td>
                      <td>{new Date(syllabus.uploadedAt).toLocaleDateString()}</td>
                      <td>
                        {syllabus.url && (
                          <a className="btn-action" href={syllabus.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>View</a>
                        )}
                        <button className="btn-danger" onClick={() => deleteMaterial(syllabus.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="section-card">
            <h3 className="section-title">📢 Announcement Management</h3>
            <form onSubmit={handleSendMessage} className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="message">Announcement Message</label>
                <textarea id="message" name="message" placeholder="Enter your announcement message" rows="4" required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="target">Target Audience</label>
                <select id="target" name="target">
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="year">Academic Year (Optional)</label>
                <select id="year" name="year">
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="section">Section (Optional)</label>
                <input id="section" name="section" placeholder="Enter section (e.g. A)" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject (Optional)</label>
                <select id="subject" name="subject">
                  <option value="">All Subjects</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.name}>{course.name} ({course.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="submit-btn">Send Announcement</button>
              </div>
            </form>

            <div className="filters-container">
              <div className="filter-group">
                <label>Filter by Target</label>
                <select id="announcement-filter-target">
                  <option value="">All Targets</option>
                  <option value="all">All Users</option>
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by Year</label>
                <select id="announcement-filter-year">
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Target</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Subject</th>
                    <th>Sent Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.filter(m => m.type === 'announcements').map((announcement) => (
                    <tr key={announcement.id}>
                      <td><strong>{announcement.message}</strong></td>
                      <td>{announcement.target}</td>
                      <td>{announcement.year || 'All'}</td>
                      <td>{announcement.section || 'All'}</td>
                      <td>{announcement.subject || 'All'}</td>
                      <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-danger" onClick={() => deleteMaterial(announcement.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="section-card">
            <h3 className="section-title">📄 Legacy Content Manager</h3>
            <div className="empty-state">
              <p>This section has been deprecated.</p>
              <p>Please use the dedicated sections above for managing specific content types.</p>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}

AdminDashboard.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setIsAdmin: PropTypes.func.isRequired,
  setStudentData: PropTypes.func.isRequired
};
