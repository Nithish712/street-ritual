import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const MARQUEE_ITEMS = ['Street Ritual', 'New Drop', 'Luxury Street', 'Born Raw', 'Stay Ritual', 'Limited Edition'];

const CATEGORIES = [
  { key: 'tshirts', label: 'T-Shirts', subtitle: 'Essential Cuts' },
  { key: 'shirts', label: 'Shirts', subtitle: 'Woven Originals' },
  { key: 'hoodies', label: 'Hoodies', subtitle: 'Heavy Weight' },
  { key: 'jeans', label: 'Jeans', subtitle: 'Selvedge Denim' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => setFeatured((res.data.data || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero__bg" />
        <div className="hero__bg-grid" />
        <div className="hero__accent" />
        <div className="hero__content">
          <p className="hero__eyebrow">New Drop — SS 2024</p>
          <h1 className="hero__title">
            Street
            <span className="hero__title-gold">Ritual</span>
          </h1>
          <p className="hero__subtitle">Luxury streetwear — for those who move different</p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn-primary" id="hero-shop-btn">
              Shop the Drop
            </Link>
            <Link to="/shop?category=hoodies" className="btn btn-outline" id="hero-hoodies-btn">
              View Hoodies
            </Link>
          </div>
        </div>
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee__item">
              {item} <span className="marquee__dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section id="categories" style={{ padding: '2px 0', background: 'var(--black)' }}>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/shop?category=${cat.key}`}
              className="category-card"
              id={`category-${cat.key}`}
            >
              <img
                src={`https://placehold.co/600x800/111111/d4af37?text=${encodeURIComponent(cat.label)}`}
                alt={cat.label}
                className="category-card__img"
                loading="lazy"
              />
              <div className="category-card__overlay" />
              <div className="category-card__content">
                <p className="category-card__label">{cat.subtitle}</p>
                <h2 className="category-card__name">{cat.label}</h2>
                <span className="category-card__arrow">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" id="featured-products">
          <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span className="section__label">Latest Drop</span>
              <h2 className="section__title">Featured Pieces</h2>
            </div>
            <Link to="/shop" className="btn btn-ghost" id="view-all-btn">View All →</Link>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* About Strip */}
      <div className="about-strip" id="about">
        <div className="about-strip__inner">
          <div className="about-strip__text">
            <h2 className="about-strip__quote">
              Not just clothes.<br />
              <span>A statement.</span>
            </h2>
            <p className="about-strip__body">
              Street Ritual was born from the underground — where craft meets culture and every piece carries weight. 
              We don't follow trends. We set rituals. Each drop is limited. Each piece is intentional.
            </p>
            <div className="about-strip__stats">
              <div>
                <div className="about-strip__stat-num">100%</div>
                <div className="about-strip__stat-label">Premium Cotton</div>
              </div>
              <div>
                <div className="about-strip__stat-num">Limited</div>
                <div className="about-strip__stat-label">Each Drop</div>
              </div>
              <div>
                <div className="about-strip__stat-num">India</div>
                <div className="about-strip__stat-label">Made Here</div>
              </div>
            </div>
          </div>
          <div className="about-strip__visual">
            <img
              src="https://placehold.co/600x600/111111/d4af37?text=STREET+RITUAL"
              alt="Street Ritual brand"
              className="about-strip__img"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
