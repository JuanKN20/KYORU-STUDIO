import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Cpu, Sparkles, Target, Zap } from 'lucide-react';
import KyoruIntro from '../components/KyoruIntro';
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

const capabilities = [
  {
    index: '01',
    title: 'DIGITAL',
    detail: 'Development / Web / Interactive',
    description: 'Desarrollo web e interfaces para experiencias digitales con intención y claridad.',
  },
  {
    index: '02',
    title: '3D',
    detail: 'Modeling / Experiences',
    description: 'Modelado, visualización y experiencias tridimensionales para ideas y entornos.',
  },
  {
    index: '03',
    title: 'MOTION',
    detail: 'Animation / Digital Content',
    description: 'Animación y contenido digital para comunicar, expandir y dar movimiento a una historia.',
  },
];

const creationProcess = [
  { index: '00', title: 'THE UNKNOWN', description: 'Toda creación empieza antes de tener forma.' },
  { index: '01', title: 'IMAGINE', description: 'Definimos una posibilidad y una dirección.' },
  { index: '02', title: 'DESIGN', description: 'Convertimos la idea en estructura, lenguaje y experiencia.' },
  { index: '03', title: 'BUILD', description: 'La hacemos funcional, tangible y técnicamente sólida.' },
  {
    index: '04',
    title: 'BRING IT TO LIFE',
    description: 'El concepto deja de ser una posibilidad y se convierte en algo real.',
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

      <section className="kyoru-selected-work" aria-labelledby="selected-work-title">
        <div className="kyoru-selected-work__inner">
          <div className="kyoru-section-index">
            <span>02</span>
            <span>SELECTED WORK</span>
          </div>

          <article className="kyoru-selected-work__feature">
            <div className="kyoru-selected-work__field" aria-hidden="true" data-kyoru-media-slot="yorutsugi-artwork">
              <span className="kyoru-selected-work__field-index">01 / KYORU ORIGINAL</span>
              <span className="kyoru-selected-work__field-title">YORUTSUGI</span>
              <span className="kyoru-selected-work__field-signal" />
              <span className="kyoru-selected-work__field-frame kyoru-selected-work__field-frame--one" />
              <span className="kyoru-selected-work__field-frame kyoru-selected-work__field-frame--two" />
              <span className="kyoru-selected-work__field-caption">ARTWORK / PENDING</span>
            </div>

            <div className="kyoru-selected-work__content">
              <p className="kyoru-selected-work__eyebrow">01 / KYORU ORIGINAL</p>
              <h2 id="selected-work-title" className="kyoru-selected-work__title">YORUTSUGI</h2>
              <p className="kyoru-selected-work__type">Original Manga / Animation / Worldbuilding</p>
              <p className="kyoru-selected-work__description">{yorutsugi.description}</p>
              <Link to={yorutsugi.route} className="kyoru-inline-action">
                <span>EXPLORE YORUTSUGI</span>
                <span className="kyoru-inline-action__line" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="kyoru-capabilities" aria-labelledby="capabilities-title">
        <div className="kyoru-capabilities__inner">
          <div className="kyoru-capabilities__heading">
            <div className="kyoru-section-index">
              <span>03</span>
              <span>CAPABILITIES</span>
            </div>
            <h2 id="capabilities-title">Craft across digital worlds.</h2>
          </div>

          <div className="kyoru-capabilities__list">
            {capabilities.map((capability) => (
              <Link key={capability.title} to="/services" className="kyoru-capability" aria-label={`Explorar ${capability.title}`}>
                <span className="kyoru-capability__index">{capability.index}</span>
                <span className="kyoru-capability__title">{capability.title}</span>
                <span className="kyoru-capability__detail">{capability.detail}</span>
                <span className="kyoru-capability__description">{capability.description}</span>
                <ArrowUpRight className="kyoru-capability__arrow h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="kyoru-original" aria-labelledby="home-original-title">
        <div className="kyoru-original__inner">
          <div className="kyoru-original__intro">
            <div className="kyoru-section-index">
              <span>04</span>
              <span>KYORU ORIGINAL</span>
            </div>
            <p className="kyoru-original__status">A WORLD IN DEVELOPMENT</p>
            <h2 id="home-original-title" className="kyoru-original__title">{yorutsugi.title}</h2>
            <p className="kyoru-original__copy">
              YORUTSUGI es la primera producción original de Kyoru Studio: un manga de fantasía y acción actualmente en desarrollo.
            </p>
          </div>

          <div className="kyoru-original__composition">
            <div className="kyoru-original__visual" aria-hidden="true" data-kyoru-media-slot="yorutsugi-world">
              <span className="kyoru-original__visual-word">WORLD</span>
              <span className="kyoru-original__visual-signal" />
              <span className="kyoru-original__visual-panel kyoru-original__visual-panel--world" />
              <span className="kyoru-original__visual-panel kyoru-original__visual-panel--manga" />
              <span className="kyoru-original__visual-panel kyoru-original__visual-panel--motion" />
              <span className="kyoru-original__visual-index">ORIGINAL / 001</span>
            </div>

            <div className="kyoru-original__details">
              <ul className="kyoru-original__disciplines" aria-label="Disciplinas de YORUTSUGI">
                {['MANGA', 'ANIMATION', 'WORLD', 'CHARACTERS'].map((discipline, index) => (
                  <li key={discipline}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{discipline}</strong>
                  </li>
                ))}
              </ul>

              <dl className="kyoru-original__metadata">
                <div>
                  <dt>FORMAT</dt>
                  <dd>ORIGINAL MANGA</dd>
                </div>
                <div>
                  <dt>GENRE</dt>
                  <dd>FANTASY / ACTION</dd>
                </div>
                <div>
                  <dt>STATUS</dt>
                  <dd>IN DEVELOPMENT</dd>
                </div>
              </dl>

              <Link to={yorutsugi.route} className="kyoru-inline-action kyoru-original__action">
                <span>EXPLORE THE WORLD</span>
                <span className="kyoru-inline-action__line" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="kyoru-process" aria-labelledby="home-process-title">
        <div className="kyoru-process__inner">
          <header className="kyoru-process__header">
            <div className="kyoru-section-index">
              <span>05</span>
              <span>PROCESS</span>
            </div>
            <h2 id="home-process-title" className="kyoru-process__title">
              <span>FROM NOTHING</span>
              <span>TO SOMETHING.</span>
            </h2>
            <p className="kyoru-process__intro">Una señal se convierte en dirección, estructura y finalmente en algo real.</p>
          </header>

          <ol className="kyoru-process__sequence">
            {creationProcess.map((step, stage) => (
              <li key={step.index} className="kyoru-process__step" data-stage={stage}>
                <div className="kyoru-process__entity" aria-hidden="true">
                  <span className="kyoru-process__entity-point" />
                  <span className="kyoru-process__entity-signal" />
                  <span className="kyoru-process__entity-frame" />
                  <span className="kyoru-process__entity-plane" />
                  <span className="kyoru-process__entity-result">REAL</span>
                </div>
                <div className="kyoru-process__step-copy">
                  <span className="kyoru-process__step-index">{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="kyoru-studio" aria-labelledby="home-studio-title">
        <div className="kyoru-studio__inner">
          <div className="kyoru-section-index">
            <span>06</span>
            <span>STUDIO</span>
          </div>

          <div className="kyoru-studio__statement">
            <h2 id="home-studio-title">
              <span>WE DON'T WORK</span>
              <span>IN ONE MEDIUM.</span>
            </h2>
            <p>
              Kyoru Studio es un estudio creativo y tecnológico que construye experiencias, productos y mundos combinando dirección
              artística, desarrollo y producción multimedia.
            </p>
          </div>

          <div className="kyoru-studio__territories" aria-label="Territorios creativos de Kyoru Studio">
            <p>ART <span aria-hidden="true">×</span> TECHNOLOGY <span aria-hidden="true">×</span> STORY</p>
            <ul>
              {['DIGITAL', 'MOTION', 'WORLDS'].map((territory, index) => (
                <li key={territory}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{territory}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="kyoru-showreel" aria-labelledby="home-showreel-title">
        <div className="kyoru-showreel__inner">
          <div className="kyoru-showreel__header">
            <div className="kyoru-section-index">
              <span>07</span>
              <span>MOTION / SHOWREEL</span>
            </div>
            <div>
              <h2 id="home-showreel-title">KYORU IN MOTION</h2>
              <p>Imagen, sonido y movimiento reunidos como una sola experiencia.</p>
            </div>
          </div>

          <div className="kyoru-showreel__stage" aria-hidden="true" data-kyoru-media-slot="showreel">
            <span className="kyoru-showreel__word">MOTION</span>
            <span className="kyoru-showreel__signal" />
            <span className="kyoru-showreel__frame kyoru-showreel__frame--primary" />
            <span className="kyoru-showreel__frame kyoru-showreel__frame--secondary" />
            <span className="kyoru-showreel__label">KYORU / MOVING IMAGE</span>
          </div>
        </div>
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
