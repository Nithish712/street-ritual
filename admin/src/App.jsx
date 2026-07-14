import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import StoreSettings from './pages/StoreSettings';
import AdminLayout from './components/AdminLayout';

function PrivateRoute({ element, title }) {
  const { isAuth } = useAuth();
  return isAuth ? <AdminLayout title={title}>{element}</AdminLayout> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuth } = useAuth();
  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} title="Dashboard" />} />
      <Route path="/products" element={<PrivateRoute element={<Products />} title="Products" />} />
      <Route path="/categories" element={<PrivateRoute element={<Categories />} title="Categories" />} />
      <Route path="/orders" element={<PrivateRoute element={<Orders />} title="Orders" />} />
      <Route path="/settings" element={<PrivateRoute element={<StoreSettings />} title="Store Settings" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
