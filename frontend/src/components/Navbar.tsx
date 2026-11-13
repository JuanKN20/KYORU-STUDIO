import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown, X } from "lucide-react";

const businessLinks = [
  { to: "/services", label: "Services" },
  { to: "/trabajos", label: "Projects" },
  { to: "/estudio", label: "Studio" },
];

const mobileLinks = [
  { to: "/services", label: "Services" },
  { to: "/trabajos", label: "Projects" },
  { to: "/estudio", label: "Studio" },
  { to: "/contact", label: "Let's Talk" },
];

const BRAND_NAME = "KYORU STUDIO";
const BRAND_DESCRIPTOR = "Independent Multimedia Studio";
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DRAWER_TRANSITION_MS = 300;
const NAVBAR_SCROLL_THRESHOLD = 28;
const PROJECTS_CLOSE_DELAY_MS = 140;

type BrandCopyProps = { compact?: boolean };

const BrandCopy: React.FC<BrandCopyProps> = ({ compact = false }) => (
  <div className={`kyoru-navbar__brand-copy${compact ? " kyoru-navbar__brand-copy--compact" : ""}`}>
    <p>{BRAND_NAME}</p>
    <p>{BRAND_DESCRIPTOR}</p>
  </div>
);

const Navbar: React.FC = () => {
  const [isDrawerMounted, setDrawerMounted] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isProjectsOpen, setProjectsOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > NAVBAR_SCROLL_THRESHOLD);
  const { pathname } = useLocation();
  const dialogId = useId();
  const projectsPanelId = useId();
  const previousPathnameRef = useRef(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const projectsGroupRef = useRef<HTMLDivElement>(null);
  const projectsToggleRef = useRef<HTMLButtonElement>(null);
  const openFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const projectsCloseTimerRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const restoreFocusRef = useRef(false);

  const clearOpenFrame = useCallback(() => {
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearProjectsCloseTimer = useCallback(() => {
    if (projectsCloseTimerRef.current !== null) {
      window.clearTimeout(projectsCloseTimerRef.current);
      projectsCloseTimerRef.current = null;
    }
  }, []);

  const openProjects = useCallback(() => {
    clearProjectsCloseTimer();
    setProjectsOpen(true);
  }, [clearProjectsCloseTimer]);

  const closeProjects = useCallback(() => {
    clearProjectsCloseTimer();
    setProjectsOpen(false);
  }, [clearProjectsCloseTimer]);

  const scheduleProjectsClose = useCallback(() => {
    clearProjectsCloseTimer();
    projectsCloseTimerRef.current = window.setTimeout(() => {
      setProjectsOpen(false);
      projectsCloseTimerRef.current = null;
    }, PROJECTS_CLOSE_DELAY_MS);
  }, [clearProjectsCloseTimer]);

  const finishDrawerClose = useCallback(() => {
    clearOpenFrame();
    clearCloseTimer();
    if (dialogRef.current?.open) dialogRef.current.close();
    setDrawerVisible(false);
    setDrawerMounted(false);
    if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [clearCloseTimer, clearOpenFrame]);

  const closeDrawer = useCallback(
    (restoreFocus = true, immediate = false) => {
      if (!isDrawerMounted) return;
      clearOpenFrame();
      clearCloseTimer();
      restoreFocusRef.current = restoreFocus;
      setDrawerVisible(false);
      const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      if (immediate || reduceMotion) {
        finishDrawerClose();
        return;
      }
      closeTimerRef.current = window.setTimeout(finishDrawerClose, DRAWER_TRANSITION_MS + 50);
    },
    [clearCloseTimer, clearOpenFrame, finishDrawerClose, isDrawerMounted],
  );

  const openDrawer = useCallback(() => {
    clearCloseTimer();
    restoreFocusRef.current = false;
    setDrawerMounted(true);
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!isDrawerMounted) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.getBoundingClientRect();
    openFrameRef.current = window.requestAnimationFrame(() => {
      setDrawerVisible(true);
      closeButtonRef.current?.focus();
      openFrameRef.current = null;
    });
    return clearOpenFrame;
  }, [clearOpenFrame, isDrawerMounted]);

  useEffect(() => {
    if (!isDrawerMounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerMounted]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    closeProjects();
    if (isDrawerMounted) closeDrawer(true);
  }, [closeDrawer, closeProjects, isDrawerMounted, pathname]);

  useEffect(() => {
    const updateScrolledState = () => {
      scrollFrameRef.current = null;
      const nextScrolled = window.scrollY > NAVBAR_SCROLL_THRESHOLD;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };
    const handleScroll = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScrolledState);
      }
    };

    updateScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isProjectsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!projectsGroupRef.current?.contains(event.target as Node)) closeProjects();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeProjects();
      projectsToggleRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProjects, isProjectsOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleBreakpointChange = () => {
      if (desktopQuery.matches) {
        closeDrawer(false, true);
      } else {
        closeProjects();
      }
    };
    handleBreakpointChange();
    desktopQuery.addEventListener("change", handleBreakpointChange);
    return () => desktopQuery.removeEventListener("change", handleBreakpointChange);
  }, [closeDrawer, closeProjects]);

  useEffect(
    () => () => {
      clearOpenFrame();
      clearCloseTimer();
      clearProjectsCloseTimer();
    },
    [clearCloseTimer, clearOpenFrame, clearProjectsCloseTimer],
  );

  const handleMobileNavigation = () => closeDrawer(true);

  return (
    <header className={`kyoru-navbar${isScrolled ? " is-scrolled" : ""}`}>
      <nav className="kyoru-navbar__inner" aria-label="Primary navigation">
        <Link to="/" className="kyoru-navbar__brand" aria-label="Go to the Kyoru Studio homepage">
          <span className="kyoru-navbar__mark">
            <img src="/images/Kyoru/Logo%20Kyoru.png" alt="" aria-hidden="true" width="44" height="44" />
          </span>
          <BrandCopy />
        </Link>

        <div className="kyoru-navbar__desktop">
          {businessLinks.map((item) =>
            item.to === "/trabajos" ? (
              <div
                key={item.to}
                ref={projectsGroupRef}
                className={`kyoru-navbar__projects${isProjectsOpen ? " is-open" : ""}`}
                onMouseEnter={openProjects}
                onMouseLeave={scheduleProjectsClose}
                onFocusCapture={clearProjectsCloseTimer}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeProjects();
                }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `kyoru-navbar__link${isActive ? " is-active" : ""}`}
                  onClick={closeProjects}
                >
                  <span className="kyoru-navbar__link-label">{item.label}</span>
                </NavLink>
                <button
                  ref={projectsToggleRef}
                  type="button"
                  className="kyoru-navbar__projects-toggle"
                  aria-label={`${isProjectsOpen ? "Close" : "Open"} Projects destinations`}
                  aria-expanded={isProjectsOpen}
                  aria-controls={projectsPanelId}
                  onClick={() => (isProjectsOpen ? closeProjects() : openProjects())}
                >
                  <ChevronDown aria-hidden="true" />
                </button>

                {isProjectsOpen ? (
                  <div id={projectsPanelId} className="kyoru-projects-panel" aria-label="Project destinations">
                    <div className="kyoru-projects-panel__heading" aria-hidden="true">
                      <span>PROJECTS</span>
                    </div>
                    <Link to="/trabajos" className="kyoru-projects-panel__link" onClick={closeProjects}>
                      <span>
                        <strong>Selected Work</strong>
                        <small>Explore our projects</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <Link to="/trabajos/yorutsugi" className="kyoru-projects-panel__link" onClick={closeProjects}>
                      <span>
                        <strong>Kyoru Originals</strong>
                        <small>Enter the world of YORUTSUGI</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `kyoru-navbar__link${isActive ? " is-active" : ""}`}
              >
                <span className="kyoru-navbar__link-label">{item.label}</span>
              </NavLink>
            ),
          )}
          <NavLink
            to="/contact"
            className={({ isActive }) => `kyoru-navbar__cta${isActive ? " is-active" : ""}`}
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight aria-hidden="true" />
          </NavLink>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={openDrawer}
          className="kyoru-navbar__menu-trigger"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          aria-expanded={isDrawerMounted}
        >
          <span>MENU</span>
          <span className="kyoru-navbar__menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </nav>

      {isDrawerMounted ? (
        <dialog
          ref={dialogRef}
          id={dialogId}
          aria-label="Navigation menu"
          className={`kyoru-menu${isDrawerVisible ? " is-visible" : ""}`}
          onCancel={(event) => {
            event.preventDefault();
            closeDrawer(true);
          }}
          onTransitionEnd={(event) => {
            if (!isDrawerVisible && event.target === event.currentTarget && event.propertyName === "transform") {
              finishDrawerClose();
            }
          }}
        >
          <div className="kyoru-menu__header">
            <Link to="/" onClick={handleMobileNavigation} className="kyoru-menu__brand" aria-label="Go to the Kyoru Studio homepage">
              <span className="kyoru-navbar__mark">
                <img src="/images/Kyoru/Logo%20Kyoru.png" alt="" aria-hidden="true" width="44" height="44" />
              </span>
              <BrandCopy compact />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => closeDrawer(true)}
              className="kyoru-menu__close"
              aria-label="Close navigation menu"
            >
              <span>CLOSE</span>
              <X aria-hidden="true" />
            </button>
          </div>

          <nav className="kyoru-menu__nav" aria-label="Mobile navigation">
            <ul>
              {mobileLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `kyoru-menu__link${item.to === "/contact" ? " kyoru-menu__link--commercial" : ""}${isActive ? " is-active" : ""}`
                    }
                    onClick={handleMobileNavigation}
                  >
                    <strong>{item.label}</strong>
                    <ArrowRight aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/trabajos/yorutsugi" className="kyoru-menu__original" onClick={handleMobileNavigation}>
            <span>ORIGINAL / 001</span>
            <strong>YORUTSUGI</strong>
            <ArrowRight aria-hidden="true" />
          </Link>
        </dialog>
      ) : null}
    </header>
  );
};

export default Navbar;
