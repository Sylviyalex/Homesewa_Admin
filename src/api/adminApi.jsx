import axios from 'axios';

const API_BASE_URL = 'http://13.233.165.167/api';

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

export const loginAdmin = (payload) => api.post('/auth/login', payload);

// ==========================
// BOOKINGS
// ==========================
export const createManualBooking = (payload) =>
  api.post('/admin/bookings/manual', payload);

export const getBookings = (params = {}) =>
  api.get('/admin/bookings', { params });

export const assignServiceman = (bookingId, servicemanId) =>
  api.put(`/admin/bookings/${bookingId}/assign`, { servicemanId });

export const updateBookingStatus = (bookingId, status) =>
  api.put(`/admin/bookings/${bookingId}/status`, { status });

// ==========================
// DASHBOARD & USERS
// ==========================
export const getDashboard = () => api.get('/admin/dashboard');

export const getUsers = () => api.get('/admin/users');

export const getAdminServices = () => api.get('/admin/services');

export const getServicemen = () => api.get('/admin/servicemen');

// ==========================
// PAYMENTS (UPDATED)
// ==========================

// 🔥 returns BOTH payments + pendingRequests
export const getPayments = async () => {
  const res = await api.get('/admin/payments');
  return res.data;
};

// 🔥 create payment request (admin action)
export const createPaymentRequest = async (payload) => {
  const res = await api.post('/admin/payments', payload);
  return res.data;
};

// 🔥 mark as paid
export const markPaymentPaid = async (id) => {
  const res = await api.put(`/admin/payments/${id}/paid`);
  return res.data;
};

// 🔥 OPTIONAL (good for debug / detail view)
export const getPaymentByBookingCode = async (bookingCode) => {
  const res = await api.get(`/admin/payments/booking/${bookingCode}`);
  return res.data;
};

// ==========================
// SERVICES
// ==========================
export const createService = async (formData) => {
  const res = await api.post('/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/services/${id}`);
  return res.data;
};

// ==========================
// SERVICEMEN
// ==========================
export const createServiceman = async (payload) => {
  const res = await api.post('/admin/servicemen', payload);
  return res.data;
};

export default api;