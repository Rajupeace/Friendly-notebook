// Small localStorage helper for app-local JSON "database"
import api from './apiClient';

const USE_API = Boolean(process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.length);
const safeParse = (v, fallback) => {
  try {
    return JSON.parse(v);
  } catch (e) {
    console.error('safeParse failed to parse value', e);
    return fallback;
  }
};

const DB_KEYS = {
  STUDENTS: 'registeredStudents',
  FACULTY: 'registeredFaculty',
  MATERIALS: 'courseMaterials',
  ADMIN: 'adminAccount',
};

export const readStudents = async () => {
  if (USE_API) return api.apiGet('/api/students');
  return safeParse(localStorage.getItem(DB_KEYS.STUDENTS), []);
};

export const writeStudents = async (arr) => {
  if (!Array.isArray(arr)) throw new Error('students must be an array');
  if (USE_API) throw new Error('writeStudents via API should use specific endpoints');
  localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(arr));
};

export const addStudent = async (student) => {
  if (USE_API) return api.apiPost('/api/students', student);
  const students = await readStudents();
  students.push(student);
  await writeStudents(students);
  return student;
};

export const readFaculty = async () => {
  if (USE_API) return api.apiGet('/api/faculty');
  return safeParse(localStorage.getItem(DB_KEYS.FACULTY), []);
};

export const writeFaculty = async (arr) => {
  if (!Array.isArray(arr)) throw new Error('faculty must be an array');
  if (USE_API) throw new Error('writeFaculty via API should use specific endpoints');
  localStorage.setItem(DB_KEYS.FACULTY, JSON.stringify(arr));
};

export const addFaculty = async (f) => {
  if (USE_API) return api.apiPost('/api/faculty', f);
  const faculty = await readFaculty();
  faculty.push(f);
  await writeFaculty(faculty);
  return f;
};

export const readMaterials = async (filters = {}) => {
  if (USE_API) {
    // Build query parameters for filtering
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year);
    if (filters.section) params.append('section', filters.section);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.type) params.append('type', filters.type);
    if (filters.course) params.append('course', filters.course);
    
    return api.apiGet(`/api/materials?${params.toString()}`);
  }

  // If a backend server is available on the same origin, try fetching materials from it
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/materials?${params.toString()}`);
    if (res && res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch materials from backend, falling back to localStorage');
  }

  // Fallback to localStorage with filtering
  const materials = safeParse(localStorage.getItem(DB_KEYS.MATERIALS), {});
  
  if (!Object.keys(filters).length) {
    return materials;
  }

  // Filter materials based on provided criteria
  const filtered = {};
  Object.entries(materials).forEach(([year, yearData]) => {
    if (filters.year && year !== filters.year) return;
    
    filtered[year] = {};
    Object.entries(yearData).forEach(([section, sectionData]) => {
      if (filters.section && section !== filters.section) return;
      
      filtered[year][section] = {};
      Object.entries(sectionData).forEach(([subject, subjectData]) => {
        if (filters.subject && subject !== filters.subject) return;
        
        filtered[year][section][subject] = {};
        Object.entries(subjectData).forEach(([type, items]) => {
          if (filters.type && type !== filters.type) return;
          
          filtered[year][section][subject][type] = items;
        });
      });
    });
  });

  return filtered;
};

export const readAdmin = () => {
  const v = safeParse(localStorage.getItem(DB_KEYS.ADMIN), null);
  if (!v) {
    // Seed a default admin to preserve previous behavior (can be changed via writeAdmin)
    const defaultAdmin = { adminId: 'ReddyFBN@1228', password: 'ReddyFBN' };
    localStorage.setItem(DB_KEYS.ADMIN, JSON.stringify(defaultAdmin));
    return defaultAdmin;
  }
  return v;
};

export const writeAdmin = (obj) => {
  if (typeof obj !== 'object' || obj === null) throw new Error('admin must be an object');
  localStorage.setItem(DB_KEYS.ADMIN, JSON.stringify(obj));
};

// Simple messaging/broadcast storage for admin
export const readMessages = () => {
  return safeParse(localStorage.getItem('adminMessages'), []);
};

export const writeMessages = (arr) => {
  if (!Array.isArray(arr)) throw new Error('messages must be an array');
  localStorage.setItem('adminMessages', JSON.stringify(arr));
};

export const addMessage = (msg) => {
  const arr = readMessages();
  arr.unshift(msg);
  writeMessages(arr);
  return msg;
};

export const writeMaterials = (obj) => {
  if (typeof obj !== 'object' || obj === null) throw new Error('materials must be an object');
  localStorage.setItem(DB_KEYS.MATERIALS, JSON.stringify(obj));
};

// Convert small File to data URL (returns Promise). Size guard prevents huge localStorage usage.
export const fileToDataUrl = (file, maxBytes = 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > maxBytes) {
      return resolve(null); // caller should store metadata only for large files (e.g., videos)
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
};

export const upsertMaterial = async (year, section, subject, type, item) => {
  if (USE_API) {
    // Use the backend API for material upload
    const formData = new FormData();

    // Add metadata fields
    formData.append('year', year);
    formData.append('section', section);
    formData.append('subject', subject);
    formData.append('type', type);
    formData.append('title', item.title || '');

    // Add course info if available
    if (item.courseId) formData.append('courseId', item.courseId);
    if (item.courseCode) formData.append('courseCode', item.courseCode);
    
    // Add module and unit info if available
    if (item.moduleId) formData.append('moduleId', item.moduleId);
    if (item.unitId) formData.append('unitId', item.unitId);
    if (item.topic) formData.append('topic', item.topic);

    // Add type-specific fields
    if (type === 'videos' && item.duration) {
      formData.append('message', item.duration); // Duration stored in message field
    } else if (type === 'notes' && item.description) {
      formData.append('message', item.description);
    } else if (type === 'assignments') {
      if (item.dueDate) formData.append('dueDate', item.dueDate);
      if (item.instructions) formData.append('message', item.instructions);
    } else if (type === 'modelPapers') {
      if (item.examYear) formData.append('dueDate', item.examYear);
      if (item.examType) formData.append('message', item.examType);
    }

    // Add file if it exists and is a File object
    if (item.file && item.file instanceof File) {
      formData.append('file', item.file);
    } else if (item.link) {
      // Add link if no file
      formData.append('link', item.link);
    }

    const result = await api.apiUpload('/api/materials', formData);
    
    // Update local cache if needed
    try {
      const mats = await readMaterials();
      const updated = {
        ...mats,
        [year]: {
          ...(mats[year] || {}),
          [section]: {
            ...(mats[year]?.[section] || {}),
            [subject]: {
              ...(mats[year]?.[section]?.[subject] || { notes: [], videos: [], modelPapers: [], syllabus: [], assignments: [] }),
              [type]: [...(mats[year]?.[section]?.[subject]?.[type] || []), result]
            }
          }
        }
      };
      writeMaterials(updated);
    } catch (e) {
      console.warn('Failed to update local materials cache:', e);
    }

    return result;
  } else {
    // Fallback to local storage
    const mats = await readMaterials();
    if (!mats[year]) mats[year] = {};
    if (!mats[year][section]) mats[year][section] = {};
    if (!mats[year][section][subject]) mats[year][section][subject] = { notes: [], videos: [], modelPapers: [], syllabus: [], assignments: [] };
    if (!mats[year][section][subject][type]) mats[year][section][subject][type] = [];
    
    // Add metadata
    const enhancedItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mats[year][section][subject][type].push(enhancedItem);
    writeMaterials(mats);
    return enhancedItem;
  }
};

export const getMaterialsFor = async (year, section, subject) => {
  if (USE_API) {
    // Get all materials and filter by year, section, subject
    const allMaterials = await api.apiGet('/api/materials');
    const filtered = allMaterials.filter(m =>
      String(m.year) === String(year) &&
      String(m.section) === String(section) &&
      m.subject === subject
    );

    // Group by type
    const result = { notes: [], videos: [], modelPapers: [], syllabus: [], assignments: [] };
    filtered.forEach(material => {
      if (result[material.type]) {
        result[material.type].push(material);
      }
    });
    return result;
  } else {
    // Fallback to local storage
    const mats = await readMaterials();
    return mats?.[year]?.[section]?.[subject] || { notes: [], videos: [], modelPapers: [], syllabus: [], assignments: [] };
  }
};

const LocalDB = {
  readStudents,
  writeStudents,
  addStudent,
  readFaculty,
  writeFaculty,
  addFaculty,
  readMaterials,
  writeMaterials,
  readAdmin,
  writeAdmin,
  readMessages,
  writeMessages,
  addMessage,
};

export default LocalDB;
