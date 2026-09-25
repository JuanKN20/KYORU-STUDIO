import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, ExternalLink } from 'lucide-react';
import YorutsugiArtwork from '../components/YorutsugiArtwork';
import { yorutsugi } from '../data/yorutsugi';

const Yorutsugi: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="yorutsugi-page-title">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_16%_16%,rgba(179,23,47,0.28),transparent_42%),radial-gradient(circle_at_84%_22%,rgba(255,59,92,0.12),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_64%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/68 via-black/82 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.14] [mask-image:radial-gradient(circle_at_center,black_18%,transparent_82%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <Link
            to="/trabajos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 underline-offset-4 hover:text-white hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a proyectos
          </Link>

          <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1.08fr)] lg:items-center lg:gap-14">
            <div className="min-w-0 animate-fade-up motion-reduce:animate-none">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="akai-hud-line" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PRODUCCIÓN ORIGINAL DE KYORU STUDIO</p>
              </div>

              <h1
                id="yorutsugi-page-title"
                className="mt-6 break-words text-[3rem] font-black leading-none tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                {yorutsugi.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">{yorutsugi.description}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="akai-chip">{yorutsugi.label}</span>
                <span className="akai-chip">{yorutsugi.format}</span>
                {yorutsugi.genres.map((genre) => (
                  <span key={genre} className="akai-chip">
                    {genre}
                  </span>
                ))}
                <span className="akai-chip">{yorutsugi.editorialStatus}</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#protagonistas"
                  className="akai-btn-primary gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Conocer protagonistas
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#publicaciones"
                  className="akai-btn-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Estado de publicación
                </a>
              </div>
            </div>

            <div className="animate-fade-up motion-reduce:animate-none lg:[animation-delay:120ms]">
              <YorutsugiArtwork className="min-h-[28rem] sm:min-h-[36rem] lg:min-h-[40rem]" priority />
            </div>
          </div>
        </div>
      </header>

      <div>
        <section
          id="protagonistas"
          aria-labelledby="protagonists-title"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:scroll-mt-28 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="akai-hud-line" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PERSONAJES PRINCIPALES</p>
            </div>
            <h2 id="protagonists-title" className="akai-section-title mt-3">
              Cinco protagonistas.
            </h2>
            <p className="akai-section-subtitle max-w-3xl leading-relaxed">
              Estos son los protagonistas confirmados del canon actual. Sus perfiles e imágenes oficiales se incorporarán cuando el
              material correspondiente esté disponible en el proyecto web.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Protagonistas de YORUTSUGI">
            {yorutsugi.protagonists.map((protagonist, index) => (
              <li key={protagonist.name} className="min-w-0">
                <article className="akai-card flex h-full min-w-0 flex-col overflow-hidden p-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  {protagonist.imageUrl ? (
                    <img
                      src={protagonist.imageUrl}
                      alt={`Retrato oficial de ${protagonist.name}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-red-900/35 bg-[radial-gradient(circle_at_center,rgba(179,23,47,0.2),transparent_58%),linear-gradient(145deg,#0d0e13,#070709)]"
                    >
                      <span className="text-3xl font-black tracking-[-0.04em] text-red-200/70">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  )}

                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                    Protagonista {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 break-words text-xl font-bold leading-tight text-white">
                    {protagonist.name}
                    {protagonist.alias ? <span className="block text-base font-medium text-zinc-400">({protagonist.alias})</span> : null}
                  </h3>
                  {!protagonist.imageUrl ? (
                    <p className="mt-auto pt-5 text-xs leading-relaxed text-zinc-500">Imagen canónica pendiente de integración.</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="publicaciones"
          aria-labelledby="publications-title"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-16 sm:scroll-mt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="akai-hud-line" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">AVANCES Y CAPÍTULOS</p>
              </div>
              <h2 id="publications-title" className="akai-section-title mt-3">
                Estado de publicación.
              </h2>
              <p className="akai-section-subtitle max-w-2xl leading-relaxed">
                La obra cuenta con material visual y capítulos publicados, pero el repositorio todavía no incluye un inventario
                verificable ni sus URLs oficiales.
              </p>
            </div>

            {yorutsugi.publications.length > 0 ? (
              <ul className="grid gap-4">
                {yorutsugi.publications.map((publication) => (
                  <li key={publication.url}>
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="akai-card flex min-w-0 items-center justify-between gap-4 p-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      aria-label={`${publication.label}: ${publication.title}. Abre en una pestaña nueva`}
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-red-300">{publication.label}</span>
                        <span className="mt-2 block break-words font-semibold text-white">{publication.title}</span>
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-red-200" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <article className="akai-panel p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/35 bg-red-950/35 text-red-100">
                    <Clock3 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white">Referencias oficiales pendientes de integración.</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                      No mostramos títulos, cantidades, fechas ni enlaces hasta contar con una lista confirmada de los capítulos y
                      plataformas ya publicados.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>

          {yorutsugi.officialLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {yorutsugi.officialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="akai-btn-secondary gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  aria-label={`${link.label}. Abre en una pestaña nueva`}
                >
                  {link.label}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </section>

        <section aria-labelledby="yorutsugi-follow-title" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="akai-panel relative isolate overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_120%,rgba(179,23,47,0.32),transparent_48%),linear-gradient(135deg,rgba(10,10,14,0.84),rgba(4,4,6,0.96))]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-akai-grid bg-[length:30px_30px] opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black_10%,transparent_78%)]"
            />

            <div className="mx-auto max-w-3xl animate-fade-up motion-reduce:animate-none">
              <BookOpen className="mx-auto h-6 w-6 text-red-300" aria-hidden="true" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-red-300">SIGUE SU DESARROLLO</p>
              <h2 id="yorutsugi-follow-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Acompaña la evolución de {yorutsugi.title}.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                Los canales específicos de la obra se añadirán cuando sus URLs estén confirmadas. Mientras tanto, puedes escribirnos
                para consultar novedades sobre su desarrollo.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="akai-btn-primary gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Consultar novedades
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/trabajos"
                  className="akai-btn-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Ver producciones
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Yorutsugi;
