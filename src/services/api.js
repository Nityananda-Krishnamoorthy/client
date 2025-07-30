import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add authorization token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (data) => api.patch('/users/me', data),
  uploadAvatar: (formData) => api.patch('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  followUser: (username) => api.post(`/users/${username}/follow`),
  unfollowUser: (username) => api.delete(`/users/${username}/follow`),
  getCurrentUser: () => api.get('/users/me')
};