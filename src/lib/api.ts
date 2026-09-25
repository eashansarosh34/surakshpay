import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const api = axios.create({ baseURL: API_URL });

// Attach JWT token to every request
if (typeof window !== 'undefined') {
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      }
      return Promise.reject(err);
    },
  );
}

export default api;
export { USE_MOCK };
