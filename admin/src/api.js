import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'streetritual_admin_2024';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
});

// Products
export const getAdminProducts = () => api.get('/api/admin/products');
export const createProduct = (data) => api.post('/api/admin/products', data);
export const updateProduct = (id, data) => api.put(`/api/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);

// Orders
export const getAdminOrders = () => api.get('/api/admin/orders');
export const updateOrderStatus = (id, status) => api.patch(`/api/admin/orders/${id}/status`, { status });

// Auth
export const adminLogin = (secret) => api.post('/api/admin/login', { secret });

export default api;
