const API_URL = process.env.REACT_APP_API_URL || '';

const headersJson = { 'Content-Type': 'application/json' };

function getAdminHeaders() {
  const token = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('adminToken') : null;
  return token ? { 'x-admin-token': token } : {};
}

function getFacultyHeaders() {
  const token = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('facultyToken') : null;
  return token ? { 'x-faculty-token': token } : {};
}

export async function apiGet(path) {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, { headers: { ...getAdminHeaders() } });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: { ...headersJson, ...getAdminHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPut(path, body) {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
    method: 'PUT',
    headers: { ...headersJson, ...getAdminHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path) {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, { method: 'DELETE', headers: { ...getAdminHeaders() } });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiUpload(path, formData) {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    body: formData,
    headers: { ...getAdminHeaders() },
  });
  if (!res.ok) throw new Error(`UPLOAD ${path} failed: ${res.status}`);
  return res.json();
}

export async function adminLogin(adminId, password) {
  if (!API_URL) throw new Error('API_URL not configured');
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/admin/login`, {
      method: 'POST', headers: headersJson, body: JSON.stringify({ adminId, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Login failed: ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error('Admin login API error:', error);
    throw error;
  }
}

export async function facultyLogin(facultyId, password) {
  if (!API_URL) throw new Error('API_URL not configured');
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/faculty/login`, {
      method: 'POST', headers: headersJson, body: JSON.stringify({ facultyId, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Faculty login failed: ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error('Faculty login API error:', error);
    throw error;
  }
}

export async function facultyLogout() {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/faculty/logout`, {
    method: 'POST',
    headers: { ...getFacultyHeaders() }
  });
  if (!res.ok) throw new Error('faculty logout failed');
  return res.json();
}

export async function adminLogout() {
  if (!API_URL) throw new Error('API_URL not configured');
  const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/admin/logout`, { method: 'POST', headers: { ...getAdminHeaders() } });
  if (!res.ok) throw new Error('admin logout failed');
  return res.json();
}

const client = { apiGet, apiPost, apiPut, apiDelete, apiUpload, adminLogin, adminLogout, facultyLogin, facultyLogout };
export default client;
