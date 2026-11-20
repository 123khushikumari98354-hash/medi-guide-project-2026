// Every call to the backend lives here, so pages never touch fetch() directly.
//  - VITE_USE_MOCK=true  -> runs entirely in the browser with demo data (no backend needed)
//  - VITE_USE_MOCK=false -> calls the Express API (Vite proxies /api to http://localhost:5000 in dev)
import { session } from './session';
import { mockApi } from './mock/mockApi';

export { session };
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth) { const s = session.get(); if (s) headers.Authorization = `Bearer ${s.token}`; }
  let res;
  try { res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined }); }
  catch { throw new Error('Cannot reach the server. Is the Express API running?'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const err = new Error(data.error || `Request failed (${res.status})`); err.status = res.status; throw err; }
  return data;
}
const qs = (o) => { const p = new URLSearchParams(Object.entries(o).filter(([, v]) => v)); const s = p.toString(); return s ? `?${s}` : ''; };

const realApi = {
  departments: () => req('/departments'),
  rooms: () => req('/rooms'),
  doctors: (params = {}) => req('/doctors' + qs(params)),
  slots: (doctorId, date) => req(`/doctors/${doctorId}/slots?date=${date}`),
  analyze: (text) => req('/symptoms/analyze', { method: 'POST', body: { text } }),
  book: (b) => req('/appointments', { method: 'POST', body: b }),
  cancel: (ref, phone) => req(`/appointments/${ref}?phone=${phone}`, { method: 'DELETE' }),
  queues: () => req('/queues'),
  takeToken: (departmentSlug, name) => req('/tokens', { method: 'POST', body: { departmentSlug, name } }),
  feedback: (f) => req('/feedback', { method: 'POST', body: f }),
  login: (role, pin) => req('/auth/login', { method: 'POST', body: { role, pin } }),
  admin: {
    summary: () => req('/admin/summary', { auth: true }),
    appointments: () => req('/admin/appointments', { auth: true }),
    cancelAppointment: (ref) => req(`/admin/appointments/${ref}`, { method: 'DELETE', auth: true }),
    patchDepartment: (slug, body) => req(`/admin/departments/${slug}`, { method: 'PATCH', body, auth: true }),
    callNext: (slug) => req(`/admin/queues/${slug}/call-next`, { method: 'POST', auth: true }),
    setDays: (id, days) => req(`/admin/doctors/${id}/days`, { method: 'PATCH', body: { days }, auth: true }),
    addDoctor: (b) => req('/admin/doctors', { method: 'POST', body: b, auth: true }),
    removeDoctor: (id) => req(`/admin/doctors/${id}`, { method: 'DELETE', auth: true }),
    feedback: () => req('/admin/feedback', { auth: true }),
    resetQueues: () => req('/admin/queues/reset', { method: 'POST', auth: true }),
  },
};

export const api = USE_MOCK ? mockApi : realApi;
