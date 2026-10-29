import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const primaryLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/services', label: 'Servicios' },
  { to: '/trabajos', label: 'Proyectos' },
  { to: '/estudio', label: 'Estudio' },
  { to: '/contact', label: 'Contacto' },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="kyoru-footer">
      <div className="kyoru-footer__inner">
        <div className="kyoru-footer__brand">
          <Link to="/" className="kyoru-footer__wordmark" aria-label="Ir al inicio de Kyoru Studio">
            KYORU
            <span>STUDIO</span>
          </Link>
          <p>Estudio creativo y tecnológico que conecta arte, tecnología y producción multimedia.</p>
        </div>

        <div className="kyoru-footer__columns">
          <nav className="kyoru-footer__nav" aria-label="Navegación del pie de página">
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
                <small>Producción original / En desarrollo</small>
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <div className="kyoru-footer__legal-slot" data-footer-slot="future-legal" hidden />
        </div>

        <div className="kyoru-footer__bottom">
          <p>© {year} Kyoru Studio. Todos los derechos reservados.</p>
          <p>ART × TECHNOLOGY × STORY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
