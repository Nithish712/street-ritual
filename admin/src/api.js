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

// Upload
export const uploadImage = async (formData) => {
  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'x-admin-secret': ADMIN_SECRET
    }
  });
  
  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`);
  }
  
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return { data }; // Keep { data: ... } structure for compatibility with axios response
};

// Categories (Admin)
export const createCategory = (data) => api.post('/api/admin/categories', data);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`);

// Store Settings (Admin)
export const updateStoreSettings = (data) => api.post('/api/admin/settings', data);

// Public APIs (accessed by client, but we can define here to use in admin too)
export const getCategories = () => axios.get(`${API_URL}/api/store/categories`);
export const getStoreSettings = () => axios.get(`${API_URL}/api/store/settings`);

export default api;
