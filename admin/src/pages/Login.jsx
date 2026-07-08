import { useState } from 'react';
import { adminLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await adminLogin(secret);
      if (data.success) {
        login(data.token);
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('Invalid secret key. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Street <span style={{ color: 'var(--gold)' }}>Ritual</span></h1>
        <p className="login-sub">Admin Access</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-secret-input">Admin Secret Key</label>
            <input
              id="admin-secret-input"
              type="password"
              className="form-input"
              placeholder="Enter secret key..."
              value={secret}
              onChange={e => setSecret(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
