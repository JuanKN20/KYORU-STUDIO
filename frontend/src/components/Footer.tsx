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
    <footer className="relative overflow-hidden border-t border-red-900/30 bg-black/65">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(179,23,47,0.12),transparent_35%),radial-gradient(circle_at_88%_100%,rgba(255,59,92,0.07),transparent_38%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid min-w-0 gap-10 border-b border-red-900/30 pb-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(12rem,0.75fr)_minmax(14rem,0.8fr)] lg:gap-12">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex rounded-xl text-lg font-black uppercase tracking-[0.2em] text-white transition-colors motion-reduce:transition-none hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              aria-label="Ir al inicio de Kyoru Studio"
            >
              Kyoru Studio
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base">
              Estudio creativo y tecnológico enfocado en desarrollo web, experiencias 3D y contenido digital.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400">
              Creatividad y tecnología integradas para dar forma a soluciones y producciones con identidad propia.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">Navegación</h2>
            <ul className="mt-4 grid gap-1">
              {primaryLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-lg py-2 text-sm text-zinc-300 transition-colors motion-reduce:transition-none hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-productions-title">
            <h2 id="footer-productions-title" className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Producciones
            </h2>
            <Link
              to="/trabajos/yorutsugi"
              className="mt-5 flex min-h-20 min-w-0 items-center justify-between gap-4 rounded-2xl border border-red-900/40 bg-black/35 p-4 text-zinc-100 transition-colors motion-reduce:transition-none hover:border-red-500/55 hover:bg-red-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
            >
              <span className="min-w-0">
                <span className="block break-words text-sm font-bold tracking-[0.08em] text-white">YORUTSUGI</span>
                <span className="mt-1 block text-xs text-zinc-400">Producción original · En desarrollo</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
            </Link>
          </section>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs leading-relaxed text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Kyoru Studio. Todos los derechos reservados.</p>
          <p>Creatividad · Tecnología · Producción digital</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
