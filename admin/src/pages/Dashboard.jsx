import { useState, useEffect } from 'react';
import { getAdminProducts, getAdminOrders } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([getAdminProducts(), getAdminOrders()])
      .then(([pRes, oRes]) => {
        const products = pRes.data.data || [];
        const orders = oRes.data.data || [];
        const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0);
        const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        setStats({ products: products.length, orders: orders.length, revenue, pending });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-screen"><div className="loading-spinner" /><p className="loading-text">Loading dashboard...</p></div>
  );

  return (
    <div>
      <div className="stat-grid">
        {[
          { label: 'Total Products', value: stats.products, sub: 'Active in store' },
          { label: 'Total Orders', value: stats.orders, sub: 'All time' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, sub: 'Confirmed orders' },
          { label: 'Needs Attention', value: stats.pending, sub: 'Pending / processing' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-card__label">{s.label}</p>
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Recent Orders</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--gray-4)' }}>#{order.id.slice(0, 8)}</td>
                  <td style={{ color: 'var(--off-white)' }}>{order.customer_email}</td>
                  <td style={{ color: 'var(--gold)' }}>₹{Number(order.total).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-4)' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {recentOrders.length === 0 && (
        <div className="admin-table-wrap">
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <p className="empty-text">Ready to go live</p>
            <p style={{ color: 'var(--gray-4)', fontSize: '0.85rem', marginTop: '8px' }}>Orders will appear here after your first sale.</p>
          </div>
        </div>
      )}
    </div>
  );
}
