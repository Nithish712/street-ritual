import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || 'M';
    addItem(product, size);
    addToast(`${product.name} added to cart`);
  };

  const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);

  return (
    <Link to={`/product/${product.id}`} className="product-card" id={`product-${product.id}`}>
      <div className="product-card__img-wrap">
        <img
          src={product.images?.[0] || `https://placehold.co/600x800/f2f2f2/1a1a1a?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />
        {product.stock < 10 && product.stock > 0 && (
          <span className="product-card__badge">Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span className="product-card__badge" style={{ background: 'var(--gray-2)', color: 'var(--gray-4)' }}>Sold Out</span>
        )}
        <button
          className="product-card__quick-add"
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          id={`quick-add-${product.id}`}
          aria-label={`Quick add ${product.name} to cart`}
        >
          + Quick Add
        </button>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{price}</p>
      </div>
    </Link>
  );
}
