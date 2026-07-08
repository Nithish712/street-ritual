import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      showAlert(`Order updated to ${status}`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selected?.id === id) setSelected(o => ({ ...o, status }));
    } catch {
      showAlert('Failed to update status', 'error');
    }
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <p className="stat-card__label">Total Orders</p>
          <p className="stat-card__value">{orders.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Revenue</p>
          <p className="stat-card__value">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Processing</p>
          <p className="stat-card__value">{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Delivered</p>
          <p className="stat-card__value">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Orders</h2>
          <button className="btn btn-outline btn-sm" onClick={load}>↻ Refresh</button>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="loading-spinner" /><p className="loading-text">Loading...</p></div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><p className="empty-text">No orders yet</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--gray-4)' }}>
                      #{order.id.slice(0, 8)}
                    </td>
                    <td style={{ color: 'var(--off-white)' }}>{order.customer_email}</td>
                    <td>{Array.isArray(order.items) ? order.items.length : '—'} item(s)</td>
                    <td style={{ color: 'var(--gold)', fontWeight: '600' }}>₹{Number(order.total).toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-4)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelected(order)}
                          id={`view-order-${order.id}`}
                        >View</button>
                        <select
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto' }}
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          id={`status-select-${order.id}`}
                          aria-label="Update order status"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Order #{selected.id.slice(0, 8)}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Customer', val: selected.customer_email },
                  { label: 'Status', val: <StatusBadge status={selected.status} /> },
                  { label: 'Total', val: `₹${Number(selected.total).toLocaleString('en-IN')}` },
                  { label: 'Date', val: new Date(selected.created_at).toLocaleString('en-IN') },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-4)', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: 'var(--off-white)' }}>{val}</p>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-4)', marginBottom: '12px' }}>Items</h4>
              {Array.isArray(selected.items) && selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-1)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--off-white)' }}>{item.name} — <span style={{ color: 'var(--gray-4)' }}>{item.size}</span> × {item.quantity}</span>
                  <span style={{ color: 'var(--gold)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}

              {selected.shipping_address?.name && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-4)', marginBottom: '8px' }}>Shipping Address</h4>
                  <p style={{ color: 'var(--gray-5)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selected.shipping_address.name}<br />
                    {selected.shipping_address.address?.line1}<br />
                    {selected.shipping_address.address?.city}, {selected.shipping_address.address?.state}<br />
                    {selected.shipping_address.address?.postal_code}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
