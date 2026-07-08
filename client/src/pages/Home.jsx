import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const MARQUEE_ITEMS = ['Street Ritual', 'New Drop', 'Raw Gear', 'Born Loud', 'Stay Raw', 'Limited Edition', 'India Made'];

const CATEGORIES = [
  { key: 'tshirts', label: 'T-Shirts', subtitle: 'Essential Cuts' },
  { key: 'shirts', label: 'Shirts', subtitle: 'Woven Originals' },
  { key: 'hoodies', label: 'Hoodies', subtitle: 'Heavyweight' },
  { key: 'jeans', label: 'Jeans', subtitle: 'Raw Denim' },
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
      {/* Announcement Bar */}
      <div className="announce-bar">
        🔥 Free Shipping on orders above ₹999 &nbsp;·&nbsp; New Drop is Live — Shop Now
      </div>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero__bg-img" />
        <div className="hero__slash" />
        <div className="hero__slash-2" />

        <div className="hero__content">
          <span className="hero__tag">SS 2024 — New Collection</span>
          <h1 className="hero__title">
            Street
            <span className="hero__title-red">Ritual</span>
          </h1>
          <p className="hero__subtitle">Not just clothes. A declaration.</p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn-primary" id="hero-shop-btn">
              Shop the Drop
            </Link>
            <Link to="/shop?category=hoodies" className="btn btn-outline" id="hero-hoodies-btn">
              View Hoodies
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee__item">
              {item} <span className="marquee__sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section id="categories" style={{ padding: '3px 0', background: 'var(--black)' }}>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/shop?category=${cat.key}`}
              className="category-card"
              id={`category-${cat.key}`}
            >
              <img
                src={`https://placehold.co/600x800/0d0d0d/cc0000?text=${encodeURIComponent(cat.label)}`}
                alt={cat.label}
                className="category-card__img"
                loading="lazy"
              />
              <div className="category-card__overlay" />
              <span className="category-card__top-tag">{cat.subtitle}</span>
              <div className="category-card__content">
                <h2 className="category-card__name">{cat.label}</h2>
                <span className="category-card__cta">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" id="featured-products">
          <div className="section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
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
              Built for the<br />
              <span>streets.</span><br />
              Worn by the bold.
            </h2>
            <p className="about-strip__body">
              Street Ritual was born from the underground — where craft meets culture and every piece carries weight.
              We don't follow trends. We set rituals. Each drop is limited. Each piece is intentional.
              Made in India. Worn everywhere.
            </p>
            <div className="about-strip__stats">
              {[
                { num: '100%', label: 'Premium Fabric' },
                { num: 'Limited', label: 'Each Drop' },
                { num: 'India', label: 'Made Here' },
              ].map(s => (
                <div key={s.label}>
                  <div className="about-strip__stat-num">{s.num}</div>
                  <div className="about-strip__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-strip__visual">
            <img
              src="https://placehold.co/600x600/0d0d0d/cc0000?text=STREET+RITUAL"
              alt="Street Ritual brand visual"
              className="about-strip__img"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
