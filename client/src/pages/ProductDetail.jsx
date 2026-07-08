import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => {
        setProduct(res.data.data);
        setSelectedSize(res.data.data.sizes?.[0] || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { addToast('Please select a size'); return; }
    addItem(product, selectedSize);
    addToast(`${product.name} — ${selectedSize} added to cart ✓`);
  };

  if (loading) return (
    <div className="loading-screen" style={{ paddingTop: '100px' }}>
      <div className="loading-spinner" />
      <p className="loading-text">Loading...</p>
    </div>
  );

  if (!product) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
      <h1 className="display-md" style={{ color: 'var(--off-white)' }}>Product not found</h1>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);

  const images = product.images?.length
    ? product.images
    : [`https://placehold.co/600x800/0d0d0d/cc0000?text=${encodeURIComponent(product.name)}`];

  return (
    <main className="product-detail">
      <div className="section">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '48px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-4)' }}>
          <Link to="/" style={{ color: 'var(--gray-4)', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--red)'} onMouseOut={e => e.target.style.color = 'var(--gray-4)'}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: 'var(--gray-4)', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--red)'} onMouseOut={e => e.target.style.color = 'var(--gray-4)'}>Shop</Link>
          <span>›</span>
          <span style={{ color: 'var(--off-white)' }}>{product.name}</span>
        </nav>

        <div className="product-detail__grid">
          {/* Images */}
          <div className="product-detail__images">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="product-detail__main-img"
              id="product-main-image"
            />
            {images.length > 1 && (
              <div className="product-detail__thumbnails">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`product-detail__thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    id={`product-thumb-${i}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <p className="product-detail__category">{product.category}</p>
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__price">{price}</p>

            <div className="product-detail__divider" />

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <p className="size-label">Select Size</p>
                <div className="size-grid">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      id={`size-${size}`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="product-detail__desc">{product.description}</p>
            )}

            {/* Add to Cart */}
            <button
              id="add-to-cart-btn"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label="Add to cart"
            >
              {product.stock === 0 ? 'Sold Out' : `Add to Cart — ${price}`}
            </button>

            {/* Stock warning */}
            {product.stock > 0 && product.stock < 10 && (
              <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--red)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Only {product.stock} left
              </p>
            )}

            <div className="product-detail__divider" />

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📦', text: 'Free shipping on orders above ₹999' },
                { icon: '🔄', text: '7-day easy returns' },
                { icon: '✅', text: '100% authentic, handcrafted in India' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--gray-4)', fontSize: '0.85rem', letterSpacing: '1px' }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
