import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers3, Sparkles } from 'lucide-react';
import YorutsugiArtwork from '../components/YorutsugiArtwork';
import { yorutsugi } from '../data/yorutsugi';

const Trabajos: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="portfolio-page-title">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_14%_18%,rgba(179,23,47,0.25),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(255,59,92,0.12),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_62%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.15] [mask-image:radial-gradient(circle_at_center,black_18%,transparent_80%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PROYECTOS Y PRODUCCIONES</p>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-center lg:gap-14">
            <div className="min-w-0 animate-fade-up motion-reduce:animate-none">
              <h1
                id="portfolio-page-title"
                className="max-w-4xl text-[2.45rem] font-black leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
              >
                Producciones originales y un portafolio en evolución.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Este espacio comienza con YORUTSUGI, la primera producción original de Kyoru Studio. El catálogo crecerá cuando nuevos
                trabajos cuenten con información y créditos verificados.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={yorutsugi.route}
                  className="akai-btn-primary gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Descubrir {yorutsugi.title}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="akai-btn-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Presentar un proyecto
                </Link>
              </div>
            </div>

            <div aria-hidden="true" className="animate-fade-up motion-reduce:animate-none lg:[animation-delay:120ms]">
              <div className="relative min-h-72 overflow-hidden rounded-3xl border border-red-500/20 bg-akai-gray/60 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:min-h-80 sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,59,92,0.18),transparent_44%)]" />
                <div className="absolute inset-0 bg-akai-grid bg-[length:26px_26px] opacity-[0.12]" />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                    <Layers3 className="h-4 w-4" />
                    Selección editorial
                  </span>
                  <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.9)]" />
                </div>

                <div className="relative mt-12">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">01 · Original</p>
                  <p className="mt-4 break-words text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                    {yorutsugi.title}
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
                    {yorutsugi.format} de {yorutsugi.genres.join(' y ').toLowerCase()}.
                  </p>
                </div>

                <div className="relative mt-10 flex flex-wrap gap-2">
                  <span className="akai-chip">{yorutsugi.label}</span>
                  <span className="akai-chip">{yorutsugi.editorialStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div>
        <section
          id="producciones"
          aria-labelledby="original-production-title"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:scroll-mt-28 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="akai-hud-line" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PRODUCCIÓN DESTACADA</p>
            </div>
            <h2 id="original-production-title" className="akai-section-title mt-3">
              Una obra propia en desarrollo.
            </h2>
            <p className="akai-section-subtitle max-w-3xl leading-relaxed">
              Por ahora, esta selección presenta únicamente la producción original cuya relación con Kyoru Studio está confirmada.
            </p>
          </div>

          <article
            aria-labelledby="portfolio-yorutsugi-title"
            className="akai-panel mt-10 overflow-hidden p-4 sm:p-6 lg:p-8"
          >
            <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-center lg:gap-12">
              <YorutsugiArtwork className="min-h-[24rem] sm:min-h-[30rem]" priority />

              <div className="min-w-0 px-1 pb-2 sm:px-2 lg:px-0">
                <div className="flex flex-wrap gap-2">
                  <span className="akai-chip">{yorutsugi.label}</span>
                  <span className="akai-chip">{yorutsugi.editorialStatus}</span>
                </div>

                <h3
                  id="portfolio-yorutsugi-title"
                  className="mt-6 break-words text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl"
                >
                  {yorutsugi.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">{yorutsugi.description}</p>

                <dl className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-2xl border border-red-900/35 bg-black/25 p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.17em] text-red-300">Formato</dt>
                    <dd className="mt-2 text-sm font-semibold text-zinc-100">{yorutsugi.format}</dd>
                  </div>
                  <div className="rounded-2xl border border-red-900/35 bg-black/25 p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.17em] text-red-300">Género</dt>
                    <dd className="mt-2 text-sm font-semibold text-zinc-100">{yorutsugi.genres.join(' y ')}</dd>
                  </div>
                  <div className="rounded-2xl border border-red-900/35 bg-black/25 p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.17em] text-red-300">Estado editorial</dt>
                    <dd className="mt-2 text-sm font-semibold text-zinc-100">{yorutsugi.editorialStatus}</dd>
                  </div>
                </dl>

                <Link
                  to={yorutsugi.route}
                  className="akai-btn-primary mt-8 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Conocer la obra
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section aria-labelledby="future-portfolio-title" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="akai-panel grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/35 bg-red-950/35 text-red-100">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">CATÁLOGO EN EVOLUCIÓN</p>
              <h2 id="future-portfolio-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Preparado para incorporar futuros trabajos.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                Nuevos proyectos comerciales y producciones originales se añadirán cuando dispongan de contenido, créditos y una
                clasificación administrativa que permita presentarlos con precisión.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="portfolio-contact-title" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="akai-panel relative isolate overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_120%,rgba(179,23,47,0.3),transparent_48%),linear-gradient(135deg,rgba(10,10,14,0.82),rgba(4,4,6,0.94))]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-akai-grid bg-[length:30px_30px] opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black_10%,transparent_78%)]"
            />

            <div className="mx-auto max-w-3xl animate-fade-up motion-reduce:animate-none">
              <BookOpen className="mx-auto h-6 w-6 text-red-300" aria-hidden="true" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-red-300">HABLEMOS DE TU PROYECTO</p>
              <h2 id="portfolio-contact-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Tienes una idea que quieres convertir en proyecto?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                Comparte tus objetivos y el alcance inicial para comenzar una conversación clara sobre lo que necesitas.
              </p>
              <Link
                to="/contact"
                className="akai-btn-primary mt-7 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Presentar mi proyecto
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Trabajos;
