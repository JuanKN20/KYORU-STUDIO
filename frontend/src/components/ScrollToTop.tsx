import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { entryKeyFor, lastCommittedEntry, markCommittedEntry, readEntry, rememberEntry } from '../services/navigationMemory';

function hashTarget(hash: string) {
  if (!hash) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const { pathname, hash } = location;
  const key = entryKeyFor(location);
  const navigation = useNavigationType();

  useLayoutEffect(() => {
    const original = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = original; };
  }, []);

  useLayoutEffect(() => {
    const previous = lastCommittedEntry();
    const samePageReplace = navigation === 'REPLACE' && previous?.pathname === pathname;
    const previousEntry = samePageReplace ? readEntry(previous.key) : undefined;
    const saved = navigation === 'POP' ? readEntry(key)?.scroll
      : samePageReplace && previous.hash === hash ? previousEntry?.scroll : undefined;
    markCommittedEntry({ key, pathname, hash });
    if (previousEntry?.discipline !== undefined) rememberEntry(key, { discipline: previousEntry.discipline });

    // Layout effects run after the restored accordion has rendered, before paint.
    if (saved) {
      const context = saved.context && document.getElementById(saved.context.id);
      const resized = saved.width !== window.innerWidth || saved.height !== window.innerHeight;
      const top = context && saved.context && (resized || saved.focusId || saved.context.id !== 'home-capabilities')
        ? window.scrollY + context.getBoundingClientRect().top
          - (resized ? Math.min(Math.max(saved.context.top, 96), window.innerHeight / 2) : saved.context.top)
        : saved.y;
      window.scrollTo({ left: saved.x, top, behavior: 'instant' });
      if (saved.focusId) document.getElementById(saved.focusId)?.focus({ preventScroll: true });
    } else {
      const target = hashTarget(hash);
      if (target) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
        target.scrollIntoView({ behavior, block: 'start' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      } else {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
        document.querySelector<HTMLElement>('[data-route-focus]')?.focus({ preventScroll: true });
      }
    }

    const capabilities = pathname === '/' ? document.getElementById('home-capabilities') : null;
    const snapshot = (origin?: HTMLAnchorElement, restoreFocus = false) => {
      const bounds = capabilities?.getBoundingClientRect();
      const context = origin ? { id: origin.id, top: origin.getBoundingClientRect().top }
        : bounds && bounds.top < window.innerHeight && bounds.bottom > 0
          ? { id: 'home-capabilities', top: bounds.top } : undefined;
      rememberEntry(key, { scroll: {
        x: window.scrollX, y: window.scrollY, width: window.innerWidth, height: window.innerHeight,
        context, focusId: restoreFocus ? origin?.id : undefined,
      } });
    };
    const onScroll = () => {
      // A scroll queued by keyboard focus can arrive after click but before the route commits.
      const focusId = readEntry(key)?.scroll?.focusId;
      const focused = document.activeElement;
      if (focused instanceof HTMLAnchorElement && focused.id && focused.id === focusId) {
        snapshot(focused, true);
      } else {
        snapshot();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.origin !== window.location.origin || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const origin = link.hasAttribute('data-history-origin') ? link : undefined;
      snapshot(origin, event.detail === 0 && document.activeElement === origin);
    };
    if (!saved) snapshot();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, true);
    };
  }, [pathname, hash, key, navigation]);

  return null;
};
export default ScrollToTop;
