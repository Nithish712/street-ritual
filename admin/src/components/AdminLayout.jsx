import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '👕' },
  { to: '/categories', label: 'Categories', icon: '📁' },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children, title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-name">Street <span>Ritual</span></div>
          <div className="sidebar__brand-sub">Admin Panel</div>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <p className="sidebar__user">Logged in as Admin</p>
          <button
            id="logout-btn"
            className="btn btn-outline btn-sm"
            style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar__title">{title}</h1>
          <a href={import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" id="view-store-btn">
            ↗ View Store
          </a>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
