import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import KyoruHero from '../components/KyoruHero';
import HomeCapabilities from '../components/HomeCapabilities';
import { yorutsugi } from '../data/yorutsugi';

const creationProcess = [
  { index: '00', title: 'THE UNKNOWN', description: 'The unknown is where every act of creation begins.' },
  { index: '01', title: 'IMAGINE', description: 'Shaping a possibility into a direction.' },
  { index: '02', title: 'DESIGN', description: 'Turning an idea into structure, language and experience.' },
  { index: '03', title: 'BUILD', description: 'Making it functional, tangible and technically sound.' },
  {
    index: '04',
    title: 'BRING IT TO LIFE',
    description: 'Taking a concept from possibility to something real.',
  },
];

const Home: React.FC = () => {
  const selectedWorkRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const feature = selectedWorkRef.current;
    if (!feature) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (motion.matches) {
        feature.style.removeProperty('--work-reveal');
        feature.style.removeProperty('--work-offset');
        return;
      }
      const bounds = feature.getBoundingClientRect();
      const height = window.innerHeight;
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const entry = clamp((height - bounds.top) / (height * 0.5));
      const exit = clamp(bounds.bottom / (height * 0.35));
      const visibility = Math.min(entry, exit);
      feature.style.setProperty('--work-reveal', String(0.3 + visibility * 0.7));
      feature.style.setProperty('--work-offset', `${((1 - entry) * 12 - (1 - exit) * 8).toFixed(1)}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    schedule();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      feature.style.removeProperty('--work-reveal');
      feature.style.removeProperty('--work-offset');
    };
  }, []);

  return (
    <div className="w-full">
      <KyoruHero />

      <section className="kyoru-selected-work kyoru-selected-work--world" aria-labelledby="selected-work-title">
        <div className="kyoru-selected-work__inner">
          <div className="kyoru-section-index">
            <span>SELECTED WORK</span>
          </div>

          <article ref={selectedWorkRef} className="kyoru-selected-work__feature">
            <div className="kyoru-selected-work__field">
              <img className="kyoru-selected-work__art" src="/images/Yorutsugi 1.png"
                alt="Official YORUTSUGI artwork: a red-haired character overlooking a city at sunset."
                width={1672} height={941} loading="lazy" decoding="async" />
            </div>

            <div className="kyoru-selected-work__content">
              <p className="kyoru-selected-work__eyebrow">KYORU ORIGINAL / 001</p>
              <h2 id="selected-work-title" className="kyoru-selected-work__title">YORUTSUGI</h2>
              <p className="kyoru-selected-work__type">Original Manga / Fantasy / Action</p>
              <p className="kyoru-selected-work__status">In Development</p>
              <p className="kyoru-selected-work__description">
                A world taking shape. An original fantasy-action manga by Kyoru Studio.
              </p>
              <Link to={yorutsugi.route} className="kyoru-inline-action">
                <span>EXPLORE YORUTSUGI</span>
                <span className="kyoru-inline-action__line" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <HomeCapabilities />

      <section className="kyoru-original" aria-labelledby="home-original-title">
        <div className="kyoru-original__inner">
          <div className="kyoru-original__intro">
            <div className="kyoru-section-index">
              <span>KYORU ORIGINAL</span>
            </div>
            <p className="kyoru-original__status">A WORLD IN DEVELOPMENT</p>
            <h2 id="home-original-title" className="kyoru-original__title">{yorutsugi.title}</h2>
            <p className="kyoru-original__copy">
              YORUTSUGI is Kyoru Studio&apos;s first original production: a fantasy-action manga currently in development.
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
              <ul className="kyoru-original__disciplines" aria-label="YORUTSUGI disciplines">
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
              <span>PROCESS</span>
            </div>
            <h2 id="home-process-title" className="kyoru-process__title">
              <span>FROM NOTHING</span>
              <span>TO SOMETHING.</span>
            </h2>
            <p className="kyoru-process__intro">A signal becomes direction, structure and, ultimately, something real.</p>
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
            <span>STUDIO</span>
          </div>

          <div className="kyoru-studio__statement">
            <h2 id="home-studio-title">
              <span>WE DON'T WORK</span>
              <span>IN ONE MEDIUM.</span>
            </h2>
            <p>
              Kyoru Studio is a creative and technology studio building experiences, products and worlds through art direction,
              development and multimedia production.
            </p>
          </div>

          <div className="kyoru-studio__territories" aria-label="Kyoru Studio creative territories">
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
              <span>MOTION / SHOWREEL</span>
            </div>
            <div>
              <h2 id="home-showreel-title">KYORU IN MOTION</h2>
              <p>Image, sound and motion brought together as a single experience.</p>
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

      <section className="kyoru-contact-finale" aria-labelledby="home-contact-title">
        <div className="kyoru-contact-finale__inner">
          <div className="kyoru-section-index">
            <span>START A PROJECT</span>
          </div>

          <div className="kyoru-contact-finale__statement">
            <h2 id="home-contact-title">
              <span>WHAT SHOULD</span>
              <span>EXIST NEXT?</span>
            </h2>
            <p>Tell us what you&apos;re imagining. We can help turn that possibility into an experience, production or original world.</p>
          </div>

          <Link to="/contact" className="kyoru-contact-finale__action">
            <span>START A PROJECT</span>
            <span className="kyoru-contact-finale__action-line" aria-hidden="true" />
            <ArrowUpRight className="h-7 w-7" aria-hidden="true" />
          </Link>

          <div className="kyoru-contact-finale__signal" aria-hidden="true">
            <span>UNKNOWN</span>
            <span>NEXT</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
