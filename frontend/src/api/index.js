import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cear_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Solo redirigir si había sesión activa (token expirado), no durante el login
    if (err.response?.status === 401 && localStorage.getItem('cear_token')) {
      localStorage.removeItem('cear_token');
      localStorage.removeItem('cear_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
