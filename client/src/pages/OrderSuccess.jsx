import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getSession } from '../api';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    getSession(sessionId)
      .then(res => setSession(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div className="loading-spinner" />
      <p className="loading-text">Confirming order...</p>
    </div>
  );

  const amount = session?.amount_total ? `₹${(session.amount_total / 100).toLocaleString('en-IN')}` : '';

  return (
    <main className="order-success">
      <div className="order-success__card">
        <div className="order-success__icon">✓</div>
        <span className="section__label" style={{ display: 'block', textAlign: 'center', marginBottom: '12px' }}>Order Confirmed</span>
        <h1 className="display-sm" style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--off-white)' }}>
          You&apos;re part of the ritual now.
        </h1>
        {session?.customer_email && (
          <p style={{ textAlign: 'center', color: 'var(--gray-4)', fontSize: '0.9rem', marginBottom: '8px' }}>
            Confirmation sent to <strong style={{ color: 'var(--off-white)' }}>{session.customer_email}</strong>
          </p>
        )}
        {amount && (
          <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '32px' }}>
            {amount} paid
          </p>
        )}
        <div className="gold-line gold-line--center" />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
          <Link to="/shop" className="btn btn-primary" id="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="btn btn-outline" id="go-home-btn">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
