import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Boxes, Clapperboard, Code2, Cpu, Sparkles, Target, Zap } from 'lucide-react';
import KyoruIntro from '../components/KyoruIntro';
import ServicesCarousel from '../components/ServicesCarousel';
import YorutsugiArtwork from '../components/YorutsugiArtwork';
import { yorutsugi } from '../data/yorutsugi';

const differentiators = [
  {
    title: 'Creatividad con enfoque técnico',
    description: 'Diseñamos soluciones visuales con base sólida en arquitectura y desarrollo.',
    icon: Zap,
  },
  {
    title: 'Experiencias visualmente impactantes',
    description: 'Construimos productos con identidad estética fuerte y coherencia de marca.',
    icon: Sparkles,
  },
  {
    title: 'Soluciones adaptadas a cada proyecto',
    description: 'Cada propuesta se ajusta a objetivos reales, alcance y tipo de audiencia.',
    icon: Target,
  },
  {
    title: 'Integración de arte, tecnología e innovación',
    description: 'Unimos dirección creativa y ejecución técnica para producir experiencias premium.',
    icon: Cpu,
  },
];

const businessServices = [
  {
    title: 'Desarrollo Web',
    description: 'Diseñamos y desarrollamos sitios web, plataformas y aplicaciones digitales adaptadas a las necesidades de cada proyecto.',
    icon: Code2,
  },
  {
    title: 'Modelado y Experiencias 3D',
    description: 'Creamos modelos, entornos y experiencias tridimensionales para productos, espacios y proyectos digitales.',
    icon: Boxes,
  },
  {
    title: 'Animación y Contenido Digital',
    description: 'Desarrollamos animaciones 2D y 3D, piezas audiovisuales y contenido visual para marcas, productos y proyectos creativos.',
    icon: Clapperboard,
  },
];

const KYORU_INTRO_SESSION_KEY = 'kyoru-intro-seen-v1';

const shouldPlayKyoruIntro = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return window.sessionStorage.getItem(KYORU_INTRO_SESSION_KEY) !== 'true';
  } catch {
    return false;
  }
};

const Home: React.FC = () => {
  const [introActive, setIntroActive] = useState(shouldPlayKyoruIntro);
  const disableIntro = useCallback(() => setIntroActive(false), []);

  return (
    <div className="w-full">
      <section className={`kyoru-hero ${introActive ? 'kyoru-hero--intro' : ''}`} aria-labelledby="home-hero-title">
        <KyoruIntro active={introActive} sessionKey={KYORU_INTRO_SESSION_KEY} onStorageUnavailable={disableIntro} />

        <div className="kyoru-hero__media" aria-hidden="true">
          <div className="kyoru-hero__media-plane" data-kyoru-media-slot="future-master-media">
            <span className="kyoru-hero__media-word kyoru-hero__media-word--unknown">UNKNOWN</span>
            <span className="kyoru-hero__media-word kyoru-hero__media-word--real">REAL</span>
            <span className="kyoru-hero__media-origin" />
            <span className="kyoru-hero__media-fragment kyoru-hero__media-fragment--one" />
            <span className="kyoru-hero__media-fragment kyoru-hero__media-fragment--two" />
            <span className="kyoru-hero__media-fragment kyoru-hero__media-fragment--three" />
            <span className="kyoru-hero__media-signal" />
            <span className="kyoru-hero__media-cut" />
          </div>
        </div>

        <div className="kyoru-hero__inner">
          <div className="kyoru-hero__meta">
            <span>KYORU STUDIO / CREATIVE &amp; TECHNOLOGY</span>
            <span aria-hidden="true">CREATIVE / 001</span>
          </div>

          <h1 id="home-hero-title" className="kyoru-hero__title">
            <span className="kyoru-hero__title-line">
              <span>IMAGINE</span> <span>BEYOND.</span>
            </span>
            <span className="kyoru-hero__title-line kyoru-hero__title-line--offset">
              <span>BUILD</span> <span>WHAT&apos;S</span> <span>NEXT.</span>
            </span>
          </h1>

          <p className="kyoru-hero__copy">
            Kyoru Studio transforma ideas en experiencias digitales, mundos visuales y producciones originales donde creatividad y
            tecnología trabajan como una sola disciplina.
          </p>

          <div className="kyoru-hero__footer">
            <div className="kyoru-hero__actions">
              <Link to="/trabajos" className="kyoru-action kyoru-action--explore">
                <span>VIEW WORK</span>
                <span className="kyoru-action__line" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="kyoru-action kyoru-action--commercial">
                <span>START A PROJECT</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="kyoru-hero__scroll" aria-hidden="true">
              <span>SCROLL</span>
              <span className="kyoru-hero__scroll-line" />
            </div>
          </div>
        </div>
      </section>

      <section className="akai-page pt-8 md:pt-10">
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Qué hacemos</p>
        </div>
        <h2 className="akai-section-title mt-3">Líneas de negocio de Kyoru Studio</h2>
        <p className="akai-section-subtitle">
          Integramos tecnología, creatividad y producción multimedia para construir soluciones digitales con identidad y alto impacto
          visual.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businessServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} to="/services" className="akai-card block p-6" aria-label={`Ver servicios de ${service.title}`}>
                <div className="inline-flex rounded-xl border border-red-500/35 bg-red-950/40 p-2 text-red-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{service.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-red-200">Ver servicios</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="akai-page pt-2 md:pt-2" aria-labelledby="home-original-title">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="akai-hud-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">PRODUCCIÓN ORIGINAL</p>
          </div>
          <h2 id="home-original-title" className="akai-section-title mt-3">
            Nuestra primera obra original.
          </h2>
          <p className="akai-section-subtitle leading-relaxed">
            YORUTSUGI es la primera producción original de Kyoru Studio: un manga de fantasía y acción actualmente en desarrollo.
          </p>
        </div>

        <article
          aria-labelledby="home-yorutsugi-title"
          className="akai-panel mt-8 overflow-hidden p-4 sm:p-6 lg:p-8"
        >
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center lg:gap-12">
            <YorutsugiArtwork className="min-h-[22rem] sm:min-h-[26rem]" />

            <div className="min-w-0 px-1 pb-2 sm:px-2 lg:px-0">
              <div className="flex flex-wrap gap-2">
                <span className="akai-chip">{yorutsugi.label}</span>
                <span className="akai-chip">{yorutsugi.editorialStatus}</span>
              </div>

              <h3 id="home-yorutsugi-title" className="mt-6 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
                {yorutsugi.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{yorutsugi.description}</p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-red-900/35 bg-black/25 p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">Formato</dt>
                  <dd className="mt-2 text-sm font-semibold text-zinc-100">{yorutsugi.format}</dd>
                </div>
                <div className="rounded-2xl border border-red-900/35 bg-black/25 p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">Género</dt>
                  <dd className="mt-2 text-sm font-semibold text-zinc-100">{yorutsugi.genres.join(' y ')}</dd>
                </div>
              </dl>

              <Link
                to={yorutsugi.route}
                className="akai-btn-primary mt-7 gap-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Descubrir {yorutsugi.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="akai-page pt-2 md:pt-6">
        <div className="flex items-center gap-3">
          <div className="akai-hud-line" />
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Diferenciales</p>
        </div>
        <h2 className="akai-section-title mt-3">Por qué Kyoru Studio</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {differentiators.map((item) => (
            <article key={item.title} className="akai-card p-6">
              <div className="inline-flex rounded-xl border border-red-500/35 bg-red-950/40 p-2 text-red-200">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ServicesCarousel />

      <section className="akai-page pb-20 pt-2 md:pt-4">
        <div className="akai-panel p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-red-300">Siguiente paso</p>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Hablemos de tu proyecto</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-zinc-300 md:text-base">
            Si estás construyendo una marca, producto o experiencia digital, en Kyoru Studio podemos ayudarte a diseñarlo y
            desarrollarlo con un enfoque creativo y tecnológico.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="akai-btn-primary">
              Iniciar conversación
            </Link>
            <Link to="/services" className="akai-btn-secondary">
              Revisar servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
