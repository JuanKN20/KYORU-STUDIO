import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

const businessLinks = [
  { to: "/services", label: "Services" },
  { to: "/trabajos", label: "Projects" },
  { to: "/estudio", label: "Studio" },
];

const mobileLinks = [
  { to: "/", label: "Home", index: "01" },
  { to: "/services", label: "Services", index: "02" },
  { to: "/trabajos", label: "Projects", index: "03" },
  { to: "/estudio", label: "Studio", index: "04" },
  { to: "/contact", label: "Contact", index: "05" },
];

const BRAND_NAME = "KYORU STUDIO";
const BRAND_DESCRIPTOR = "Creative & Technology Studio";
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DRAWER_TRANSITION_MS = 300;

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
  const { pathname } = useLocation();
  const dialogId = useId();
  const previousPathnameRef = useRef(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
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
    if (isDrawerMounted) closeDrawer(true);
  }, [closeDrawer, isDrawerMounted, pathname]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const closeAtDesktop = () => {
      if (desktopQuery.matches) closeDrawer(false, true);
    };
    closeAtDesktop();
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, [closeDrawer]);

  useEffect(
    () => () => {
      clearOpenFrame();
      clearCloseTimer();
    },
    [clearCloseTimer, clearOpenFrame],
  );

  const handleMobileNavigation = () => closeDrawer(true);

  return (
    <header className="kyoru-navbar">
      <nav className="kyoru-navbar__inner" aria-label="Primary navigation">
        <Link to="/" className="kyoru-navbar__brand" aria-label="Go to the Kyoru Studio homepage">
          <span className="kyoru-navbar__mark">
            <img src="/images/Kyoru/Logo%20Kyoru.png" alt="" aria-hidden="true" width="44" height="44" />
          </span>
          <BrandCopy />
        </Link>

        <div className="kyoru-navbar__desktop">
          {businessLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `kyoru-navbar__link${isActive ? " is-active" : ""}`}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) => `kyoru-navbar__cta${isActive ? " is-active" : ""}`}
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight aria-hidden="true" />
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
                    <span aria-hidden="true">{item.index}</span>
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
