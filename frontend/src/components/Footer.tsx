import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/trabajos', label: 'Projects' },
  { to: '/estudio', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="kyoru-footer">
      <div className="kyoru-footer__inner">
        <div className="kyoru-footer__brand">
          <Link to="/" className="kyoru-footer__wordmark" aria-label="Go to the Kyoru Studio homepage">
            KYORU
            <span>STUDIO</span>
          </Link>
          <p>A creative and technology studio connecting art, technology and multimedia production.</p>
        </div>

        <div className="kyoru-footer__columns">
          <nav className="kyoru-footer__nav" aria-label="Footer navigation">
            <h2>NAVIGATION</h2>
            <ul>
              {primaryLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="kyoru-footer__original" aria-labelledby="footer-productions-title">
            <h2 id="footer-productions-title">ORIGINAL PRODUCTION</h2>
            <Link to="/trabajos/yorutsugi">
              <span>
                <strong>YORUTSUGI</strong>
                <small>Original production / In development</small>
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <div className="kyoru-footer__legal-slot" data-footer-slot="future-legal" hidden />
        </div>

        <div className="kyoru-footer__bottom">
          <p>© {year} Kyoru Studio. All rights reserved.</p>
          <p>ART × TECHNOLOGY × STORY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
