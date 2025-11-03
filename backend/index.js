require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const PORT = process.env.PORT || 5000;

// simple file-based db helper
const dbFile = (name, initial) => {
  const p = path.join(dataDir, name + '.json');
  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(initial, null, 2));
  return {
    read: () => {
      try { return JSON.parse(fs.readFileSync(p, 'utf8') || 'null') || initial; } catch (e) { return initial; }
    },
    write: (v) => { fs.writeFileSync(p, JSON.stringify(v, null, 2)); }
  };
};

const studentsDB = dbFile('students', []);
const facultyDB = dbFile('faculty', []);
const materialsDB = dbFile('materials', []);
const messagesDB = dbFile('messages', []);
const adminDB = dbFile('admin', { adminId: 'ReddyFBN@1228', password: 'ReddyFBN' });
const coursesDB = dbFile('courses', []);
const studentFacultyDB = dbFile('studentFaculty', []); // Store student-faculty relationships

// Import routes
const studentRoutes = require('./routes/studentRoutes');

// simple admin-check middleware
function requireAdmin(req, res, next) {
  const admin = adminDB.read() || {};
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'admin token required' });
  // only allow valid token, not password
  if (admin.adminToken && token === admin.adminToken) return next();
  return res.status(401).json({ error: 'invalid admin token' });
}
function requireFaculty(req, res, next) {
  const faculty = facultyDB.read() || [];
  const token = req.headers['x-faculty-token'];
  if (!token) return res.status(401).json({ error: 'faculty token required' });

  // Find faculty with matching token
  const facultyMember = faculty.find(f => f.facultyToken === token);
  if (!facultyMember) return res.status(401).json({ error: 'invalid faculty token' });

  req.facultyData = facultyMember; // Attach faculty data to request
  next();
}

// admin auth endpoints
app.post('/api/admin/login', (req, res) => {
  const { adminId, password } = req.body || {};
  const admin = adminDB.read() || {};
  if (!adminId || !password) return res.status(400).json({ error: 'missing credentials' });

  if (admin.adminId === adminId && admin.password === password) {
    const token = uuidv4();
    // Update admin with token
    const updatedAdmin = { ...admin, adminToken: token, tokenIssuedAt: new Date().toISOString() };
    adminDB.write(updatedAdmin);

    return res.json({
      ok: true,
      token,
      adminData: { adminId: admin.adminId }
    });
  }
  return res.status(401).json({ error: 'invalid admin credentials' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const admin = adminDB.read() || {};
  const updatedAdmin = { ...admin, adminToken: null, tokenIssuedAt: null };
  adminDB.write(updatedAdmin);
  return res.json({ ok: true });
});

// routes: students
// Student routes
app.use('/api/students', studentRoutes);

// Keep the existing /api/students endpoint for admin access
app.get('/api/students', (req, res) => {
  res.json(studentsDB.read());
});
app.post('/api/students', (req, res) => {
  const { studentName, sid, email, year, section, branch, password } = req.body;
  if (!sid || !studentName) return res.status(400).json({ error: 'missing required fields' });
  const arr = studentsDB.read();
  if (arr.find(s => s.sid === sid)) return res.status(409).json({ error: 'sid exists' });
  const item = { studentName, sid, email, year, section, branch, password };
  arr.push(item);
  studentsDB.write(arr);
  res.status(201).json(item);
});
app.put('/api/students/:sid', requireAdmin, (req, res) => {
  const sid = req.params.sid;
  const arr = studentsDB.read();
  const idx = arr.findIndex(s => s.sid === sid);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  arr[idx] = { ...arr[idx], ...req.body };
  studentsDB.write(arr);
  res.json(arr[idx]);
});
app.delete('/api/students/:sid', requireAdmin, (req, res) => {
  const sid = req.params.sid;
  const arr = studentsDB.read();
  const next = arr.filter(s => s.sid !== sid);
  studentsDB.write(next);
  
  // Clean up student-faculty relationships
  const relationships = studentFacultyDB.read().filter(r => r.studentId !== sid);
  studentFacultyDB.write(relationships);
  
  res.json({ ok: true });
});

// Student-Faculty Relationship Management
app.post('/api/relationships', requireAdmin, (req, res) => {
  const { studentId, facultyId } = req.body;
  if (!studentId || !facultyId) {
    return res.status(400).json({ error: 'studentId and facultyId are required' });
  }

  const students = studentsDB.read();
  const faculties = facultyDB.read();
  
  // Verify student and faculty exist
  const student = students.find(s => s.sid === studentId);
  const faculty = faculties.find(f => f.facultyId === facultyId);
  
  if (!student) return res.status(404).json({ error: 'Student not found' });
  if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
  
  const relationships = studentFacultyDB.read();
  const existing = relationships.find(r => 
    r.studentId === studentId && r.facultyId === facultyId
  );
  
  if (existing) {
    return res.status(409).json({ error: 'Relationship already exists' });
  }
  
  const relationship = {
    id: uuidv4(),
    studentId,
    facultyId,
    createdAt: new Date().toISOString(),
    createdBy: 'admin' // Could be adminId if available
  };
  
  relationships.push(relationship);
  studentFacultyDB.write(relationships);
  
  res.status(201).json(relationship);
});

app.get('/api/students/:studentId/faculties', (req, res) => {
  const { studentId } = req.params;
  const relationships = studentFacultyDB.read();
  const faculties = facultyDB.read();
  
  const studentFaculties = relationships
    .filter(r => r.studentId === studentId)
    .map(r => {
      const faculty = faculties.find(f => f.facultyId === r.facultyId);
      return faculty ? { ...faculty, relationshipId: r.id } : null;
    })
    .filter(Boolean);
    
  res.json(studentFaculties);
});

app.get('/api/faculty/:facultyId/students', (req, res) => {
  const { facultyId } = req.params;
  const relationships = studentFacultyDB.read();
  const students = studentsDB.read();
  
  const facultyStudents = relationships
    .filter(r => r.facultyId === facultyId)
    .map(r => {
      const student = students.find(s => s.sid === r.studentId);
      return student ? { ...student, relationshipId: r.id } : null;
    })
    .filter(Boolean);
    
  res.json(facultyStudents);
});

app.delete('/api/relationships/:relationshipId', requireAdmin, (req, res) => {
  const { relationshipId } = req.params;
  const relationships = studentFacultyDB.read();
  const updated = relationships.filter(r => r.id !== relationshipId);
  
  if (updated.length === relationships.length) {
    return res.status(404).json({ error: 'Relationship not found' });
  }
  
  studentFacultyDB.write(updated);
  res.json({ ok: true });
});

// faculty routes
app.get('/api/faculty', (req, res) => res.json(facultyDB.read()));
app.post('/api/faculty', requireAdmin, (req, res) => {
  const { name, facultyId, email, password, assignments } = req.body;
  if (!facultyId || !name || !password) return res.status(400).json({ error: 'missing required fields: facultyId, name, password' });

  const arr = facultyDB.read();
  if (arr.find(f => f.facultyId === facultyId)) return res.status(409).json({ error: 'facultyId already exists' });

  // Ensure assignments is an array, default to empty array if not provided
  const assignmentsArray = Array.isArray(assignments) ? assignments : [];

  const item = {
    name,
    facultyId,
    email: email || '',
    password,
    assignments: assignmentsArray,
    createdAt: new Date().toISOString()
  };

  arr.push(item);
  facultyDB.write(arr);
  res.status(201).json(item);
});
app.put('/api/faculty/:fid', requireAdmin, (req, res) => {
  const fid = req.params.fid;
  const arr = facultyDB.read();
  const idx = arr.findIndex(f => f.facultyId === fid);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  arr[idx] = { ...arr[idx], ...req.body };
  facultyDB.write(arr);
  res.json(arr[idx]);
});

app.delete('/api/faculty/:fid', requireAdmin, (req, res) => {
  const fid = req.params.fid;
  const arr = facultyDB.read();
  const faculty = arr.find(f => f.facultyId === fid);
  if (!faculty) return res.status(404).json({ error: 'faculty not found' });
  
  // Remove faculty from data
  facultyDB.write(arr.filter(f => f.facultyId !== fid));
  
  // Clean up related data:
  // 1. Remove faculty's materials
  const materials = materialsDB.read();
  materialsDB.write(materials.filter(m => m.uploaderId !== fid));
  
  // 2. Remove faculty's messages
  const messages = messagesDB.read();
  messagesDB.write(messages.filter(m => m.facultyId !== fid));
  
  res.json({ ok: true });
});

// faculty auth endpoints
app.post('/api/faculty/login', (req, res) => {
  const { facultyId, password } = req.body || {};
  const faculty = facultyDB.read() || [];
  if (!facultyId || !password) return res.status(400).json({ error: 'missing credentials' });

  const facultyMember = faculty.find(f => f.facultyId === facultyId && f.password === password);
  if (facultyMember) {
    const token = uuidv4();
    // Update faculty with token
    const updatedFaculty = faculty.map(f =>
      f.facultyId === facultyId ? { ...f, facultyToken: token, tokenIssuedAt: new Date().toISOString() } : f
    );
    facultyDB.write(updatedFaculty);

    return res.json({
      ok: true,
      token,
      facultyData: { name: facultyMember.name, facultyId: facultyMember.facultyId, assignments: facultyMember.assignments }
    });
  }
  return res.status(401).json({ error: 'invalid credentials' });
});

app.post('/api/faculty/logout', requireFaculty, (req, res) => {
  const faculty = facultyDB.read() || [];
  const updatedFaculty = faculty.map(f =>
    f.facultyId === req.facultyData.facultyId ? { ...f, facultyToken: null, tokenIssuedAt: null } : f
  );
  facultyDB.write(updatedFaculty);
  return res.json({ ok: true });
});

// materials routes (multipart upload)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Build safe folder path based on provided metadata: subject/module/unit/topic
      const subject = (req.body.subject || 'misc').toString().replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '_');
      const module = (req.body.module || '').toString().replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '_');
      const unit = (req.body.unit || '').toString().replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '_');
      const topic = (req.body.topic || '').toString().replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '_');

      // Compose relative path under uploadsDir
      let relPath = subject || 'misc';
      if (module) relPath = path.join(relPath, module);
      if (unit) relPath = path.join(relPath, unit);
      if (topic) relPath = path.join(relPath, topic);

      const dest = path.join(uploadsDir, relPath);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (e) {
      cb(e, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

app.get('/api/materials', (req, res) => {
  const { year, section, subject, type, course, branch } = req.query;
  const all = materialsDB.read();
  let filtered = all;
  if (year && year !== 'All') filtered = filtered.filter(m => String(m.year) === String(year));
  if (section && section !== 'All') filtered = filtered.filter(m => String(m.section) === String(section));
  if (branch && branch !== 'All') filtered = filtered.filter(m => m.branch === branch || !m.branch);
  if (subject) filtered = filtered.filter(m => String(m.subject) === String(subject));
  if (type) filtered = filtered.filter(m => String(m.type) === String(type));
  if (course) filtered = filtered.filter(m => String(m.course) === String(course));
  res.json(filtered);
});

app.post('/api/materials', upload.single('file'), (req, res) => {
  const { year, section, subject, type, title, link, dueDate, message, module, unit, course, branch } = req.body;
  if (!subject || !type) return res.status(400).json({ error: 'missing required fields: subject, type' });
  if (subject !== 'Advance Courses' && (!year || !section)) return res.status(400).json({ error: 'missing year or section for non-advance courses' });

  // Check if request is from admin or faculty
  const admin = adminDB.read() || {};
  const faculty = facultyDB.read() || [];
  const adminToken = req.headers['x-admin-token'];
  const facultyToken = req.headers['x-faculty-token'];

  let authorized = false;
  let uploaderType = null;
  let uploaderData = null;

  if (adminToken && admin.adminToken === adminToken) {
    authorized = true;
    uploaderType = 'admin';
  } else if (facultyToken) {
    const facultyMember = faculty.find(f => f.facultyToken === facultyToken);
    if (facultyMember) {
      // Check if faculty is assigned to this subject
      const isAssigned = facultyMember.assignments?.some(assignment =>
        assignment.subject === subject &&
        String(assignment.year) === String(year) &&
        (assignment.sections || []).includes(section)
      );

      if (isAssigned) {
        authorized = true;
        uploaderType = 'faculty';
        uploaderData = facultyMember;
      } else {
        // Log assignment check for debugging
        console.log('Faculty authorization check:', {
          facultyId: facultyMember.facultyId,
          requested: { subject, year, section },
          assignments: facultyMember.assignments
        });
        return res.status(403).json({
          error: 'Faculty not authorized for this subject/section combination',
          details: {
            facultyId: facultyMember.facultyId,
            requestedSubject: subject,
            requestedYear: year,
            requestedSection: section,
            facultyAssignments: facultyMember.assignments
          }
        });
      }
    }
  }

  if (!authorized) {
    return res.status(403).json({ error: 'unauthorized to upload for this subject/section' });
  }

  const all = materialsDB.read();
  const id = uuidv4();
  // Determine url path relative to /uploads
  let fileUrl = null;
  let filename = null;
  if (req.file) {
    // Use the file destination (relative to uploadsDir) to build the public URL
    filename = req.file.filename;
    const destRel = path.relative(uploadsDir, req.file.destination || uploadsDir).replace(/\\/g, '/');
    fileUrl = `/uploads/${destRel}/${req.file.filename}`.replace(/\/+/g, '/');
  } else if (link) {
    fileUrl = link;
  }

  const item = {
    id,
    title: title || (req.file ? req.file.originalname : ''),
    year: year || 'All',
    section: section || 'All',
    subject,
    type,
    course: course || null,
    branch: branch || null,
    module: module ? String(module) : null,
    unit: unit ? String(unit) : null,
    topic: req.body.topic || null,
    uploadedAt: new Date().toISOString(),
    filename: filename,
    url: fileUrl,
    originalName: req.file ? req.file.originalname : null,
    uploadedBy: uploaderType,
    uploaderId: uploaderData ? uploaderData.facultyId : null,
    uploaderName: uploaderData ? uploaderData.name : 'Admin'
  };

  // Add type-specific fields
  if (type === 'videos') {
    if (message) item.duration = message; // Store duration in message field
  } else if (type === 'modelPapers' || type === 'previousQuestions') {
    if (dueDate) item.examYear = dueDate; // Store exam year in dueDate field
    if (message) item.examType = message; // Store exam type in message field
  }

  all.push(item);
  materialsDB.write(all);
  res.status(201).json(item);
});

// faculty upload history (for faculty themselves)
app.get('/api/faculty/uploads', requireFaculty, (req, res) => {
  const all = materialsDB.read();
  const mine = all.filter(m => m.uploaderId === req.facultyData.facultyId);
  res.json(mine);
});

// admin view of a faculty's uploads
app.get('/api/faculty/:fid/uploads', requireAdmin, (req, res) => {
  const fid = req.params.fid;
  const all = materialsDB.read();
  const userUploads = all.filter(m => m.uploaderId === fid);
  res.json(userUploads);
});

app.delete('/api/materials/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const all = materialsDB.read();
  const item = all.find(m => m.id === id);
  if (!item) return res.status(404).json({ error: 'not found' });
  // delete file if exists
  if (item.url && item.url.startsWith('/uploads')) {
    // build absolute path from url
    const rel = item.url.replace(/^\/uploads\//, '').replace(/\//g, path.sep);
    const p = path.join(uploadsDir, rel);
    if (fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (e) { console.warn('Failed to unlink', p, e); }
    }
  } else if (item.filename) {
    // fallback: try filename in uploads root
    const p2 = path.join(uploadsDir, item.filename);
    if (fs.existsSync(p2)) {
      try { fs.unlinkSync(p2); } catch (e) { console.warn('Failed to unlink', p2, e); }
    }
  }
  materialsDB.write(all.filter(m => m.id !== id));
  res.json({ ok: true });
});

// messages
app.get('/api/messages', (req, res) => res.json(messagesDB.read()));
app.post('/api/messages', requireAdmin, (req, res) => {
  const { message, target } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const all = messagesDB.read();
  const item = { id: uuidv4(), message, target: target || 'all', createdAt: new Date().toISOString() };
  all.unshift(item);
  messagesDB.write(all);
  res.status(201).json(item);
});
app.delete('/api/messages/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const all = messagesDB.read();
  messagesDB.write(all.filter(m => m.id !== id));
  res.json({ ok: true });
});

app.post('/api/announcements', requireAdmin, (req, res) => {
  const { message, target, year, section, subject } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const all = messagesDB.read();
  const item = {
    id: uuidv4(),
    message,
    target: target || 'all',
    type: 'announcements',
    year: year || null,
    section: section || null,
    subject: subject || null,
    createdAt: new Date().toISOString()
  };
  all.unshift(item);
  messagesDB.write(all);
  res.status(201).json(item);
});

// courses/subjects routes
app.get('/api/courses', (req, res) => res.json(coursesDB.read()));
app.post('/api/courses', requireAdmin, (req, res) => {
  const { name, code, year, semester, branch, sections, description } = req.body;
  if (!name || !code || !year) return res.status(400).json({ error: 'missing required fields' });
  const arr = coursesDB.read();
  if (arr.find(c => c.code === code)) return res.status(409).json({ error: 'course code exists' });
  const item = { id: uuidv4(), name, code, year, semester, branch, sections: sections || [], description, createdAt: new Date().toISOString() };
  arr.push(item);
  coursesDB.write(arr);
  res.status(201).json(item);
});
app.put('/api/courses/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const arr = coursesDB.read();
  const idx = arr.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'course not found' });
  arr[idx] = { ...arr[idx], ...req.body };
  coursesDB.write(arr);
  res.json(arr[idx]);
});
app.delete('/api/courses/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const arr = coursesDB.read();
  coursesDB.write(arr.filter(c => c.id !== id));
  res.json({ ok: true });
});

// subjects routes (alias for courses)
app.get('/api/subjects', (req, res) => res.json(coursesDB.read()));
app.post('/api/subjects', requireAdmin, (req, res) => {
  const { name, code, year, semester, branch, sections, description } = req.body;
  if (!name || !code || !year) return res.status(400).json({ error: 'missing required fields' });
  const arr = coursesDB.read();
  if (arr.find(s => s.code === code)) return res.status(409).json({ error: 'subject code exists' });
  const item = { id: uuidv4(), name, code, year, semester, branch, sections: sections || [], description, createdAt: new Date().toISOString() };
  arr.push(item);
  coursesDB.write(arr);
  res.status(201).json(item);
});
app.put('/api/subjects/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const arr = coursesDB.read();
  const idx = arr.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'subject not found' });
  arr[idx] = { ...arr[idx], ...req.body };
  coursesDB.write(arr);
  res.json(arr[idx]);
});
app.delete('/api/subjects/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const arr = coursesDB.read();
  coursesDB.write(arr.filter(s => s.id !== id));
  res.json({ ok: true });
});

// root route
app.get('/', (req, res) => {
  res.json({
    message: 'Friendly College Management System API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      faculty: '/api/faculty',
      materials: '/api/materials',
      messages: '/api/messages',
      announcements: '/api/announcements',
      courses: '/api/courses',
      subjects: '/api/subjects',
      admin: '/api/admin'
    },
    documentation: 'This is the API server. Frontend is served separately on port 3000.'
  });
});

// health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
