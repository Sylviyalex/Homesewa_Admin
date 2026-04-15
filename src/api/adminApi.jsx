import axios from 'axios';

const API_BASE_URL = 'https://api.13.233.165.167.sslip.io';



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// ==========================
// AUTH
// ==========================
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('admin_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('admin_token');
  }
};

const existingToken = localStorage.getItem('admin_token');
if (existingToken) {
  setAuthToken(existingToken);
}

export const loginAdmin = (payload) => api.post('/api/auth/login', payload);

// ==========================
// BOOKINGS
// ==========================
export const createManualBooking = (payload) =>
  api.post('/bookings/admin/create', payload);

export const getBookings = (params = {}) =>
  api.get('/api/admin/bookings', { params });

export const assignServiceman = (bookingId, servicemanId) =>
  api.put(`/api/admin/bookings/${bookingId}/assign`, { servicemanId });

export const updateBookingStatus = (bookingId, status) =>
  api.put(`/api/admin/bookings/${bookingId}/status`, { status });

// ==========================
// DASHBOARD & USERS
// ==========================
export const getDashboard = () => api.get('/api/admin/dashboard');

export const getUsers = () => api.get('/api/admin/users');

export const getAdminServices = () => api.get('/api/admin/services');

export const getServicemen = () => api.get('/api/admin/servicemen');

// ==========================
// PAYMENTS (UPDATED)
// ==========================

// 🔥 returns BOTH payments + pendingRequests
export const getPayments = async () => {
  const res = await api.get('/api/admin/payments');
  return res.data;
};

// 🔥 create payment request (admin action)
export const createPaymentRequest = async (payload) => {
  const res = await api.post('/api/admin/payments', payload);
  return res.data;
};

// 🔥 mark as paid
export const markPaymentPaid = async (id) => {
  const res = await api.put(`/api/admin/payments/${id}/paid`);
  return res.data;
};

// 🔥 OPTIONAL (good for debug / detail view)
export const getPaymentByBookingCode = async (bookingCode) => {
  const res = await api.get(`/api/admin/payments/booking/${bookingCode}`);
  return res.data;
};

// ==========================
// SERVICES
// ==========================
export const createService = async (formData) => {
  const res = await api.post('/api/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getServices = async () => {
  const res = await api.get('/api/services');
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/api/services/${id}`);
  return res.data;
};

// ==========================
// SERVICEMEN
// ==========================
export const createServiceman = async (payload) => {
  const res = await api.post('/api/admin/servicemen', payload);
  return res.data;
};

export default api;