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

// simple admin-check middleware
function requireAdmin(req, res, next) {
  const admin = adminDB.read() || {};
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'admin token required' });
  // only allow valid token, not password
  if (admin.adminToken && token === admin.adminToken) return next();
  return res.status(401).json({ error: 'invalid admin token' });
}

// admin auth endpoints
app.post('/api/admin/login', (req, res) => {
  const { adminId, password } = req.body || {};
  const admin = adminDB.read() || {};
  if (!adminId || !password) return res.status(400).json({ error: 'missing' });
  if (admin.adminId === adminId && admin.password === password) {
    const token = uuidv4();
    const next = { ...admin, adminToken: token, tokenIssuedAt: new Date().toISOString() };
    adminDB.write(next);
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'invalid' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const admin = adminDB.read() || {};
  delete admin.adminToken;
  delete admin.tokenIssuedAt;
  adminDB.write(admin);
  return res.json({ ok: true });
});

// routes: students
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
  res.json({ ok: true });
});

// faculty routes
app.get('/api/faculty', (req, res) => res.json(facultyDB.read()));
app.post('/api/faculty', requireAdmin, (req, res) => {
  const { name, facultyId, email, password, assignments } = req.body;
  if (!facultyId || !name) return res.status(400).json({ error: 'missing' });
  const arr = facultyDB.read();
  if (arr.find(f => f.facultyId === facultyId)) return res.status(409).json({ error: 'facultyId exists' });
  const item = { name, facultyId, email, password, assignments: assignments || [] };
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
  facultyDB.write(arr.filter(f => f.facultyId !== fid));
  res.json({ ok: true });
});

// materials routes (multipart upload)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`)
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

app.get('/api/materials', (req, res) => {
  const { year, section, subject, type, course } = req.query;
  const all = materialsDB.read();
  let filtered = all;
  if (year && year !== 'All') filtered = filtered.filter(m => String(m.year) === String(year));
  if (section && section !== 'All') filtered = filtered.filter(m => String(m.section) === String(section));
  if (subject) filtered = filtered.filter(m => String(m.subject) === String(subject));
  if (type) filtered = filtered.filter(m => String(m.type) === String(type));
  if (course) filtered = filtered.filter(m => String(m.course) === String(course));
  res.json(filtered);
});

app.post('/api/materials', requireAdmin, upload.single('file'), (req, res) => {
  const { year, section, subject, type, title, link, dueDate, message, course, moduleId, unitId, topic } = req.body;
  
  if (!subject || !type) return res.status(400).json({ error: 'missing required fields: subject, type' });
  if (subject !== 'Advance Courses' && (!year || !section)) return res.status(400).json({ error: 'missing year or section for non-advance courses' });
  
  const all = materialsDB.read();
  const courses = coursesDB.read();
  
  // Find the associated course
  const associatedCourse = courses.find(c => 
    c.code === course || 
    c.name === subject ||
    (c.year === parseInt(year) && c.sections.includes(section))
  );
  
  if (!associatedCourse) {
    return res.status(400).json({ error: 'Course not found. Please verify course details.' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  
  const item = {
    id,
    title: title || (req.file ? req.file.originalname : ''),
    year: year || 'All',
    section: section || 'All',
    subject,
    type,
    courseId: associatedCourse.id,
    courseCode: associatedCourse.code,
    moduleId: moduleId || null,
    unitId: unitId || null,
    topic: topic || null,
    uploadedAt: now,
    updatedAt: now,
    createdBy: req.headers['x-faculty-id'] || 'admin',
    isActive: true,
    filename: req.file ? req.file.filename : null,
    url: req.file ? `/uploads/${req.file.filename}` : (link || null),
    originalName: req.file ? req.file.originalname : null,
    metadata: {
      size: req.file ? req.file.size : null,
      mimeType: req.file ? req.file.mimetype : null,
    }
  };

  // Add type-specific fields
  if (type === 'videos') {
    item.duration = message || null;
    item.isVideoLink = !req.file;
  } else if (type === 'notes') {
    item.description = message || null;
  } else if (type === 'assignments') {
    item.dueDate = dueDate || null;
    item.instructions = message || null;
  } else if (type === 'modelPapers') {
    item.examYear = dueDate || null;
    item.examType = message || null;
  }

  // Find existing material collection for this course/section/type
  const materialCollectionIndex = all.findIndex(m => 
    m.courseId === associatedCourse.id && 
    m.section === section &&
    m.type === type
  );

  if (materialCollectionIndex === -1) {
    // Create new collection if it doesn't exist
    all.push({
      id: uuidv4(),
      courseId: associatedCourse.id,
      courseCode: associatedCourse.code,
      year,
      section,
      type,
      items: [item],
      createdAt: now,
      updatedAt: now
    });
  } else {
    // Add to existing collection
    all[materialCollectionIndex].items.push(item);
    all[materialCollectionIndex].updatedAt = now;
  }

  materialsDB.write(all);
  res.status(201).json(item);
});

app.delete('/api/materials/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const all = materialsDB.read();
  const item = all.find(m => m.id === id);
  if (!item) return res.status(404).json({ error: 'not found' });
  // delete file if exists
  if (item.filename) {
    const p = path.join(uploadsDir, item.filename);
    if (fs.existsSync(p)) fs.unlinkSync(p);
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
  const { name, code, year, semester, branch, sections, description, modules } = req.body;
  if (!name || !code || !year) return res.status(400).json({ error: 'missing required fields' });
  const arr = coursesDB.read();
  if (arr.find(c => c.code === code)) return res.status(409).json({ error: 'course code exists' });
  
  // Create course with modules structure
  const item = {
    id: uuidv4(),
    name,
    code,
    year,
    semester,
    branch,
    sections: sections || [],
    description,
    modules: modules || [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  arr.push(item);
  coursesDB.write(arr);
  
  // Create initial materials structure for this course
  const materials = materialsDB.read();
  const materialTypes = ['notes', 'videos', 'modelPapers', 'syllabus', 'assignments'];
  
  // Create empty material collections for each section
  sections.forEach(section => {
    materialTypes.forEach(type => {
      materials.push({
        id: uuidv4(),
        courseId: item.id,
        courseCode: code,
        year,
        section,
        type,
        items: [],
        createdAt: new Date().toISOString()
      });
    });
  });
  
  materialsDB.write(materials);
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

// admin
app.get('/api/admin', (req, res) => res.json(adminDB.read()));
app.put('/api/admin', (req, res) => { adminDB.write(req.body); res.json(req.body); });

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
