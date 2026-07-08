import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-name">Street <span>Ritual</span></div>
          <p className="footer__brand-desc">
            Luxury streetwear for those who move different. Built for the streets. Worn by the bold.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer__col-title">Shop</h4>
          <ul className="footer__links">
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?category=tshirts">T-Shirts</Link></li>
            <li><Link to="/shop?category=shirts">Shirts</Link></li>
            <li><Link to="/shop?category=hoodies">Hoodies</Link></li>
            <li><Link to="/shop?category=jeans">Jeans</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">Info</h4>
          <ul className="footer__links">
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Care Instructions</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">Contact</h4>
          <ul className="footer__links">
            <li><a href="mailto:hello@streetritual.in">hello@streetritual.in</a></li>
            <li><a href="#">Instagram DM</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2024 Street Ritual. All rights reserved.</span>
        <span>Made in India 🇮🇳</span>
      </div>
    </footer>
  );
}
