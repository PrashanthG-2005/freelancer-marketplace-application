import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const freelancersAPI = {
  getAll: (params) => API.get('/freelancers', { params }),
  getById: (id) => API.get(`/freelancers/${id}`),
  getMyProfile: () => API.get('/freelancers/me'),
  updateMyProfile: (data) => API.put('/freelancers/profile', data),
};

export const bookingsAPI = {
  create: (data) => API.post('/bookings', data),
  getFreelancerBookings: (freelancerId) => API.get(`/bookings/freelancer/${freelancerId}`),
  getClientBookings: (clientId) => API.get(`/bookings/client/${clientId}`),
  updateStatus: (id, status) => API.patch(`/bookings/${id}/status`, { status }),
};

export const clientsAPI = {
  getMyProfile: () => API.get('/clients/me'),
  updateMyProfile: (data) => API.put('/clients/profile', data),
};

export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default API;
