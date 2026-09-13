import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const businessLinks = [
  { to: "/services", label: "Servicios" },
  { to: "/trabajos", label: "Proyectos" },
];

const mobileLinks = [{ to: "/", label: "Inicio" }, ...businessLinks];

const BRAND_NAME = "KYORU STUDIO";
const BRAND_DESCRIPTOR = "Estudio creativo y tecnológico";
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DRAWER_TRANSITION_MS = 300;

type NavigationVariant = "desktop" | "mobile";

const getNavLinkClass = (isActive: boolean, variant: NavigationVariant) => {
  const base =
    "relative border font-semibold transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/85 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const size =
    variant === "desktop"
      ? "inline-flex min-h-10 items-center rounded-full px-4 text-sm tracking-[0.02em]"
      : "flex min-h-12 w-full items-center rounded-2xl px-4 text-base";
  const state = isActive
    ? "border-red-400/45 bg-red-950/55 text-red-50 shadow-[0_0_22px_rgba(179,23,47,0.18)]"
    : "border-transparent text-zinc-300 hover:border-red-500/35 hover:bg-red-950/30 hover:text-white hover:shadow-[0_0_18px_rgba(179,23,47,0.14)]";

  return `${base} ${size} ${state}`;
};

const getCtaClass = (isActive: boolean, variant: NavigationVariant) => {
  const base =
    "inline-flex items-center justify-center border border-red-400/55 bg-akai-red font-bold text-white shadow-[0_12px_28px_rgba(179,23,47,0.26)] transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const size =
    variant === "desktop"
      ? "ml-2 min-h-10 rounded-full px-5 text-sm"
      : "mt-3 min-h-12 w-full rounded-2xl px-4 text-base";
  const state = isActive
    ? "border-red-300/80 bg-red-700 shadow-akai-glow"
    : "hover:-translate-y-0.5 hover:border-red-300/80 hover:bg-red-700 hover:shadow-akai-glow";

  return `${base} ${size} ${state}`;
};

const desktopLinkClass = ({ isActive }: { isActive: boolean }) => getNavLinkClass(isActive, "desktop");
const mobileLinkClass = ({ isActive }: { isActive: boolean }) => getNavLinkClass(isActive, "mobile");
const desktopCtaClass = ({ isActive }: { isActive: boolean }) => getCtaClass(isActive, "desktop");
const mobileCtaClass = ({ isActive }: { isActive: boolean }) => getCtaClass(isActive, "mobile");

const menuButtonClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-700/40 bg-black/45 text-zinc-100 transition-all duration-300 motion-reduce:transition-none hover:border-red-400/70 hover:bg-red-950/40 hover:shadow-[0_0_18px_rgba(179,23,47,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/85 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const brandClass =
  "group flex min-w-0 flex-1 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/85 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:flex-none";

const brandLogoClass =
  "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-500/25 bg-black/45 shadow-[0_0_18px_rgba(179,23,47,0.16)] backdrop-blur transition-all duration-300 motion-reduce:transition-none group-hover:border-red-400/45 group-hover:shadow-[0_0_24px_rgba(179,23,47,0.22)] sm:h-11 sm:w-11";

const brandTitleClass =
  "block truncate text-[0.82rem] font-black uppercase leading-none tracking-[0.24em] text-white transition-colors group-hover:text-red-50 sm:text-[0.95rem] md:tracking-[0.28em]";

const brandSubtitleClass =
  "mt-1 block max-w-full truncate text-[10px] font-medium leading-none tracking-[0.06em] text-zinc-400 sm:text-[11px] sm:tracking-[0.08em]";

type BrandCopyProps = { compact?: boolean };

const BrandCopy: React.FC<BrandCopyProps> = ({ compact = false }) => (
  <div className="min-w-0 leading-tight">
    <p className={compact ? "truncate text-xs font-black uppercase tracking-[0.24em] text-white" : brandTitleClass}>
      {BRAND_NAME}
    </p>
    <p className={compact ? "mt-1 truncate text-[11px] font-medium tracking-[0.08em] text-zinc-400" : brandSubtitleClass}>
      {BRAND_DESCRIPTOR}
    </p>
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

  const handleDialogPointerDown = (event: React.PointerEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const clickedInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;
    if (!clickedInside) closeDrawer(true);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-red-500/10 bg-akai-black/80 shadow-[0_12px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link to="/" className={brandClass} aria-label="Ir al inicio de Kyoru Studio">
          <span className={brandLogoClass}>
            <img src="/favicon.svg" alt="" aria-hidden="true" width="44" height="44" className="h-full w-full" />
          </span>
          <BrandCopy />
        </Link>

        <div className="hidden items-center gap-1.5 lg:flex xl:gap-2">
          {businessLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className={desktopCtaClass}>
            Hablemos
          </NavLink>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={openDrawer}
          className={`${menuButtonClass} lg:hidden`}
          aria-label="Abrir menú de navegación"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          aria-expanded={isDrawerMounted}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>

      {isDrawerMounted ? (
        <dialog
          ref={dialogRef}
          id={dialogId}
          aria-label="Menú de navegación"
          className={`fixed inset-y-0 left-auto right-0 z-50 m-0 h-dvh max-h-none w-[min(88vw,24rem)] max-w-none transform-gpu overflow-y-auto overscroll-contain border-0 border-l border-red-500/15 bg-akai-dark/95 p-5 text-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.5)] outline-none backdrop:bg-black/70 backdrop:backdrop-blur-sm transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${isDrawerVisible ? "translate-x-0" : "translate-x-full"}`}
          onCancel={(event) => {
            event.preventDefault();
            closeDrawer(true);
          }}
          onPointerDown={handleDialogPointerDown}
          onTransitionEnd={(event) => {
            if (!isDrawerVisible && event.target === event.currentTarget && event.propertyName === "transform") {
              finishDrawerClose();
            }
          }}
        >
          <div className="mb-7 flex items-center justify-between gap-4">
            <BrandCopy compact />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => closeDrawer(true)}
              className={menuButtonClass}
              aria-label="Cerrar menú de navegación"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ul className="flex flex-col gap-2">
            {mobileLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={mobileLinkClass}
                  onClick={handleMobileNavigation}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <NavLink to="/contact" className={mobileCtaClass} onClick={handleMobileNavigation}>
            Hablemos
          </NavLink>
        </dialog>
      ) : null}
    </header>
  );
};

export default Navbar;
