import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import KyoruIntro from './KyoruIntro';

const KYORU_INTRO_SESSION_KEY = 'kyoru-intro-seen-v1';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const shouldPlayKyoruIntro = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
    return window.sessionStorage.getItem(KYORU_INTRO_SESSION_KEY) !== 'true';
  } catch {
    return false;
  }
};

const shouldPlayAmbientVideo = () => {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

const KyoruHero: React.FC = () => {
  const [introActive, setIntroActive] = useState(shouldPlayKyoruIntro);
  const [heroVideoPlaying, setHeroVideoPlaying] = useState(false);
  const [ambientVideoAllowed, setAmbientVideoAllowed] = useState(shouldPlayAmbientVideo);
  const [ambientVideoPlaying, setAmbientVideoPlaying] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const disableIntro = useCallback(() => setIntroActive(false), []);

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleMotionPreference = () => {
      setAmbientVideoAllowed(!motionQuery.matches);
      if (motionQuery.matches) setAmbientVideoPlaying(false);
    };

    handleMotionPreference();
    motionQuery.addEventListener('change', handleMotionPreference);
    return () => motionQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        hero.dataset.atmosphereActive = String(entry.isIntersecting);

        const ambientVideo = ambientVideoRef.current;
        if (!ambientVideoAllowed || !ambientVideo) return;

        if (entry.isIntersecting) {
          void ambientVideo.play().catch(() => setAmbientVideoPlaying(false));
        } else {
          ambientVideo.pause();
          setAmbientVideoPlaying(false);
        }
      },
      { rootMargin: '12% 0px' },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [ambientVideoAllowed]);

  return (
    <section
      ref={heroRef}
      data-atmosphere-active="true"
      className={`kyoru-immersive-hero${introActive ? ' kyoru-immersive-hero--intro' : ''}`}
      aria-labelledby="home-hero-title"
    >
      <div className="kyoru-immersive-hero__viewport">
        <KyoruIntro active={introActive} sessionKey={KYORU_INTRO_SESSION_KEY} onStorageUnavailable={disableIntro} />

        <div
          className="kyoru-immersive-hero__atmosphere"
          data-ambient-video-playing={ambientVideoPlaying ? 'true' : 'false'}
          aria-hidden="true"
        >
          <span className="kyoru-immersive-hero__moon-scene" />
          {ambientVideoAllowed && (
            <video
              ref={ambientVideoRef}
              className="kyoru-immersive-hero__ambient-video"
              src="/videos/Cinematic 1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
              onPlaying={() => setAmbientVideoPlaying(true)}
              onPause={() => setAmbientVideoPlaying(false)}
              onError={() => setAmbientVideoPlaying(false)}
            />
          )}
        </div>

        <div className="kyoru-immersive-hero__inner">
          <div className="kyoru-immersive-hero__title-frame">
            <h1 id="home-hero-title" className="kyoru-immersive-hero__title">
              <span className="kyoru-immersive-hero__title-line kyoru-immersive-hero__title-line--imagine">
                <span>IMAGINE</span> <span>BEYOND.</span>
              </span>
              <span className="kyoru-immersive-hero__title-line kyoru-immersive-hero__title-line--build">
                <span>BUILD</span> <span>WHAT&apos;S</span> <span>NEXT.</span>
              </span>
            </h1>
          </div>

          <div
            className="kyoru-immersive-hero__media"
            data-video-playing={heroVideoPlaying ? 'true' : 'false'}
            aria-hidden="true"
          >
            <div className="kyoru-immersive-hero__media-frame">
              <div className="kyoru-immersive-hero__fallback">
                <span className="kyoru-immersive-hero__fallback-word kyoru-immersive-hero__fallback-word--unknown">UNKNOWN</span>
                <span className="kyoru-immersive-hero__fallback-word kyoru-immersive-hero__fallback-word--real">REAL</span>
                <span className="kyoru-immersive-hero__fallback-origin" />
                <span className="kyoru-immersive-hero__fallback-line" />
              </div>
              <video
                className="kyoru-immersive-hero__video"
                src="/videos/Video 1 Home.web.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                onPlaying={() => setHeroVideoPlaying(true)}
                onError={() => setHeroVideoPlaying(false)}
              />
            </div>
          </div>

          <div className="kyoru-immersive-hero__support">
            <p className="kyoru-immersive-hero__copy">
              <span>Some ideas refuse to stay imaginary.</span>
              <span>
                We shape them through design, code, motion and storytelling — building digital experiences and original worlds
                with purpose, character and craft.
              </span>
            </p>

            <div className="kyoru-immersive-hero__actions">
              <Link to="/trabajos" className="kyoru-action kyoru-action--explore">
                <span>EXPLORE OUR WORK</span>
                <span className="kyoru-action__line" aria-hidden="true" />
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="kyoru-action kyoru-action--commercial">
                <span>START A PROJECT</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="kyoru-immersive-hero__handoff" aria-hidden="true">
            <span>THE UNKNOWN</span>
            <i />
            <span>BECOMES REAL</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KyoruHero;
