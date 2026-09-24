import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Boxes, Check, Clapperboard, Code2 } from 'lucide-react';

const officialServices = [
  {
    id: 'desarrollo-web',
    number: '01',
    title: 'Desarrollo Web',
    description:
      'Diseñamos y desarrollamos soluciones web adaptadas a los objetivos, contenidos y necesidades de cada proyecto, desde una presencia corporativa hasta productos digitales interactivos.',
    capabilities: ['Sitios corporativos', 'Landing pages', 'Plataformas y aplicaciones web', 'Interfaces e interactividad'],
    icon: Code2,
  },
  {
    id: 'modelado-experiencias-3d',
    number: '02',
    title: 'Modelado y Experiencias 3D',
    description:
      'Creamos recursos, espacios y experiencias tridimensionales para comunicar productos, visualizar ideas y desarrollar propuestas digitales inmersivas.',
    capabilities: [
      'Modelado 3D',
      'Visualización y renderizado 3D',
      'Entornos digitales',
      'Experiencias tridimensionales interactivas',
    ],
    icon: Boxes,
  },
  {
    id: 'animacion-contenido-digital',
    number: '03',
    title: 'Animación y Contenido Digital',
    description:
      'Damos movimiento a ideas y mensajes mediante piezas visuales pensadas para marcas, productos y proyectos creativos.',
    capabilities: ['Animación 2D y 3D', 'Motion graphics', 'Piezas audiovisuales', 'Contenido visual digital'],
    icon: Clapperboard,
  },
];

const Services: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <header className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="services-page-title">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_16%_18%,rgba(179,23,47,0.24),transparent_42%),radial-gradient(circle_at_84%_28%,rgba(255,59,92,0.12),transparent_38%),linear-gradient(180deg,#0a0b0f_0%,#050506_62%,#08090d_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-akai-grid bg-[length:32px_32px] opacity-[0.15] [mask-image:radial-gradient(circle_at_center,black_18%,transparent_80%)]"
        />

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">NUESTROS SERVICIOS</p>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end lg:gap-14">
            <div className="min-w-0 animate-fade-up motion-reduce:animate-none">
              <h1
                id="services-page-title"
                className="max-w-4xl text-[2.45rem] font-black leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
              >
                Soluciones creativas y tecnológicas para dar forma a tu proyecto.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                En Kyoru Studio integramos desarrollo web, experiencias 3D y producción visual para convertir ideas en soluciones
                digitales claras, funcionales y adaptadas a cada proyecto.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="akai-btn-primary gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Presentar un proyecto
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#servicios"
                  className="akai-btn-secondary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Conocer los servicios
                </a>
              </div>
            </div>

            <div className="animate-fade-up motion-reduce:animate-none lg:[animation-delay:120ms]">
              <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-akai-gray/60 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,59,92,0.16),transparent_44%)]"
                />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">Una propuesta integrada</p>
                  <p className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
                    Tres áreas que pueden trabajar juntas o responder a una necesidad específica.
                  </p>

                  <ul className="mt-6 space-y-3" aria-label="Servicios oficiales de Kyoru Studio">
                    {officialServices.map((service) => (
                      <li
                        key={service.id}
                        className="flex items-center gap-4 rounded-2xl border border-red-900/40 bg-black/30 px-4 py-3"
                      >
                        <span className="text-xs font-bold tracking-[0.18em] text-red-300">{service.number}</span>
                        <span className="text-sm font-semibold text-zinc-100">{service.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        id="servicios"
        aria-labelledby="services-categories-title"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:scroll-mt-28 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">ÁREAS DE TRABAJO</p>
          </div>
          <h2 id="services-categories-title" className="akai-section-title mt-3">
            Tres servicios para construir, visualizar y comunicar.
          </h2>
          <p className="akai-section-subtitle max-w-3xl leading-relaxed">
            Cada línea se adapta al alcance y a la etapa de tu proyecto. Podemos abordar una necesidad concreta o combinar capacidades
            cuando la propuesta lo requiera.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {officialServices.map((service) => {
            const Icon = service.icon;
            const titleId = `${service.id}-title`;

            return (
              <article
                key={service.id}
                id={service.id}
                aria-labelledby={titleId}
                className="akai-card relative flex h-full min-w-0 flex-col overflow-hidden p-6 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 md:last:col-span-2 lg:last:col-span-1"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/35 bg-red-950/45 text-red-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-black tracking-[0.22em] text-red-300">{service.number}</span>
                </div>

                <h3 id={titleId} className="mt-6 text-2xl font-bold leading-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{service.description}</p>

                <div className="mt-6 border-t border-red-900/35 pt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">Capacidades</h4>
                  <ul className="mt-4 space-y-3">
                    {service.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-200">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    to="/contact"
                    aria-label={`Consultar sobre ${service.title}`}
                    className="akai-btn-secondary w-full gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto lg:w-full xl:w-auto"
                  >
                    Consultar servicio
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="services-contact-title" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">HABLEMOS DE TU PROYECTO</p>
            <h2 id="services-contact-title" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cuéntanos qué quieres crear.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Comparte tu idea, objetivos y alcance inicial. Con esa información podremos identificar la línea de servicio más adecuada
              para comenzar la conversación.
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
  );
};

export default Services;
