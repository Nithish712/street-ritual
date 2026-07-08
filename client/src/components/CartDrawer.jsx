import { useCart } from '../context/CartContext';
import { createCheckoutSession } from '../api';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const { data } = await createCheckoutSession({ items });
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Stash</h2>
          <button
            id="cart-close-btn"
            className="cart-drawer__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >✕</button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <p className="cart-empty__text">Your cart is empty</p>
              <button className="btn btn-outline-gold" onClick={() => setIsOpen(false)}>
                Shop Now
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartKey} className="cart-item">
                <img
                  src={item.images?.[0] || 'https://placehold.co/80x100/0d0d0d/cc0000?text=SR'}
                  alt={item.name}
                  className="cart-item__img"
                />
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__size">Size: {item.size}</p>
                  <p className="cart-item__price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <div className="cart-item__qty">
                    <button className="qty-btn" onClick={() => updateQty(item.cartKey, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.cartKey, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => removeItem(item.cartKey)}
                  aria-label="Remove item"
                >✕</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total">
              <span className="cart-total__label">Total</span>
              <span className="cart-total__amount">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button
              id="checkout-btn"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Checkout — ₹' + total.toLocaleString('en-IN')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
