import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getProducts = (params) => api.get('/api/products', { params });
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createCheckoutSession = (data) => api.post('/api/orders/checkout', data);
export const getSession = (sessionId) => api.get(`/api/orders/session/${sessionId}`);

export default api;
