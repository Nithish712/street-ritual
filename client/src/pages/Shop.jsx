import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'tshirts', label: 'T-Shirts' },
  { key: 'shirts', label: 'Shirts' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'jeans', label: 'Jeans' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (search) params.search = search;

    getProducts(params)
      .then(res => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const handleFilter = (key) => {
    if (key === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: key });
    }
  };

  return (
    <main className="shop-page">
      <div className="shop-header">
        <span className="section__label">The Collection</span>
        <h1 className="section__title">Shop All</h1>
        <div className="shop-search" id="shop-search">
          <svg className="shop-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search pieces..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="shop-search-input"
            aria-label="Search products"
          />
        </div>
      </div>

      <div className="section">
        <div className="shop-filters" role="group" aria-label="Product categories">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${activeCategory === f.key ? 'active' : ''}`}
              onClick={() => handleFilter(f.key)}
              id={`filter-${f.key}`}
              aria-pressed={activeCategory === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p className="loading-text">Loading pieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-4)' }}>
            <p className="display-sm" style={{ marginBottom: '16px', color: 'var(--off-white)' }}>No pieces found</p>
            <p style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>Try a different category</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--gray-4)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>
              {products.length} {products.length === 1 ? 'piece' : 'pieces'} available
            </p>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
