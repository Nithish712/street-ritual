import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

const MARQUEE_ITEMS = [
  'Raw Streetwear', 'Unapologetic Swag', 'Heavyweight Quality', 'Limited Drops',
  'No Restocks', 'Gang Mentality', 'Born Bold',
];

import { useStore } from '../context/StoreContext';

const TRUST_ITEMS = [
  { icon: '🔥', text: 'Premium Heavyweight Fabric' },
  { icon: '🚫', text: 'Strictly No Restocks' },
  { icon: '🛡️', text: '100% Authentic Quality' },
  { icon: '⚡', text: 'Fast & Secure Shipping' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { settings, categories, loading } = useStore();

  useEffect(() => {
    getProducts()
      .then(res => setFeatured((res.data.data || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <main>
      {/* Announcement Bar */}
      <div className="announce-bar">
        Raw Streetwear. Built for the Gang. Limited Edition Drops.
      </div>

      {/* Hero — Full Screen */}
      <section className="hero" id="hero">
        <div className={`hero__bg ${settings.hero_bg_url ? 'hero__bg--black' : 'hero__bg--green'}`} />
        <div className="hero__texture" />
        {settings.hero_bg_url && (
          <img
            src={settings.hero_bg_url}
            alt="Street Gang Style"
            className="hero__img"
          />
        )}
        <div className="hero__overlay" />

        <div className="hero__corner-tag">
          <span>Edition</span>
          <strong>001</strong>
        </div>

        <div className="hero__content">
          <span className="hero__eyebrow">
            New Drop
          </span>
          <h1 className="hero__title">
            {settings.hero_title_line_1 || 'Street'}
            <em>{settings.hero_title_line_2 || 'Swag'}</em>
          </h1>
          <p className="hero__sub">
            {settings.hero_subtitle || 'Built for the underground. Worn by the bold. Discover our latest heavyweight collection featuring unapologetic style and raw street aesthetics.'}
          </p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn-primary" id="hero-shop-btn">
              Shop The Drop
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
          {Array(4).fill(settings.marquee_text || 'Raw Streetwear | Unapologetic Swag | Heavyweight').map((item, i) => (
            <span key={i} className="marquee__item">
              {item} <span className="marquee__sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="section" id="categories">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '0 0 32px 0' }}>
          <div>
            <span className="section__label">Collections</span>
            <h2 className="section__title">Shop by Category</h2>
          </div>
          <Link to="/shop" className="btn btn-ghost" id="view-all-categories-btn">View All →</Link>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="category-card"
              id={`category-${cat.slug}`}
            >
              <img
                src={`https://placehold.co/600x800/2D4F1E/F5E6CC?text=${encodeURIComponent(cat.name)}`}
                alt={cat.name}
                className="category-card__img"
                loading="lazy"
              />
              <div className="category-card__overlay" />
              <span className="category-card__top-tag">Shop Now</span>
              <div className="category-card__content">
                <h2 className="category-card__name">{cat.name}</h2>
                <span className="category-card__cta">Shop Now &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <div className="trust-strip">
        <div className="trust-strip__inner">
          {TRUST_ITEMS.map(item => (
            <div key={item.text} className="trust-item">
              <span className="trust-item__icon">{item.icon}</span>
              <span className="trust-item__text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" id="featured-products">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '0 0 32px 0' }}>
            <div>
              <span className="section__label">New Drops</span>
              <h2 className="section__title">Street Essentials</h2>
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
          <div>
            <h2 className="about-strip__quote">
              Born in the streets.<br />
              Worn by the <span>gang.</span>
            </h2>
            <p className="about-strip__body">
              Street Ritual is more than a brand, it's a movement. We bring you heavyweight quality, raw designs, and an unapologetic attitude. Every drop is limited edition, made for those who dictate the culture, not follow it.
            </p>
            <div className="about-strip__stats">
              {[
                { num: 'Limited', label: 'Edition Drops' },
                { num: 'Premium', label: 'Heavyweight Fits' },
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
              src={settings.about_img_url || "https://placehold.co/1080x1080/2D4F1E/F5E6CC?text=RAW+SWAG"}
              alt="Streetwear Style"
              className="about-strip__img"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
