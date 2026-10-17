import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useTheme } from '../theme';
import Home from '../pages/Home';

const Product = lazy(() => import('../pages/Product'));
const Pricing = lazy(() => import('../pages/PricingPage'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));

function ThemeButton() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 3.2A8.2 8.2 0 1 0 20.8 14 6.4 6.4 0 0 1 15 3.2Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}

export function Layout() {
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    const timer = window.setTimeout(() => {
      if (location.hash) {
        document.querySelector(location.hash)?.scrollIntoView();
        return;
      }
      window.scrollTo(0, 0);
      if (first.current) {
        first.current = false;
        return;
      }
      document.getElementById('main')?.focus();
    }, 40);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const nodes = panel ? [...panel.querySelectorAll<HTMLElement>('a, button')] : [];
    nodes[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab' || nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (!firstNode || !lastNode) return;
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <div className="nav-inner">
          <Logo onClick={() => setOpen(false)} />
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/product">Product</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink className="btn" to="/#takeoff">Run takeoff</NavLink>
            <ThemeButton />
          </nav>
          <div className="mobile-tools">
            <ThemeButton />
            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="site-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
          >
            <div className="menu-top">
              <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/product" onClick={() => setOpen(false)}>Product</NavLink>
            <NavLink to="/pricing" onClick={() => setOpen(false)}>Pricing</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/#takeoff" onClick={() => setOpen(false)}>Run takeoff</NavLink>
          </m.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <m.div
          key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="route-fallback wrap" role="status">Loading page</div>}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </m.div>
      </AnimatePresence>
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Logo />
            <p className="quiet">AI-native takeoff for building material suppliers. This demo uses example sheets, example rates and a fictional supplier. No customer claims.</p>
          </div>
          <nav aria-label="Footer">
            <NavLink to="/product">Product</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/#takeoff">Takeoff</NavLink>
          </nav>
        </div>
        <div className="wrap quiet">© {new Date().getFullYear()} Leva AI</div>
      </footer>
    </>
  );
}
