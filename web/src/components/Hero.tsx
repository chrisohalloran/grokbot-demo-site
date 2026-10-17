import { useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { burstRender } from '../renderBus';
import { useMediaQuery } from '../hooks';
import { useTheme } from '../theme';
import { HeroDrawing } from './HeroDrawing';
import type { MouseRef, ProgressRef } from './HeroScene';

const Scene = lazy(() => import('./HeroScene'));

const STAGES = ['A bare slab.', 'Rebar lands on the mat.', 'Frame and roof follow.'];

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const wide = useMediaQuery('(min-width: 981px)');
  const pin = wide && !reduce;
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const percentRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [stage, setStage] = useState(0);
  const [live, setLive] = useState(false);
  const [flat, setFlat] = useState(() => !supportsWebGL());
  const [show3d, setShow3d] = useState(false);
  const [replay, setReplay] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const publish = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    progressRef.current = clamped;
    stageEl.current?.style.setProperty('--p', clamped.toFixed(4));
    if (percentRef.current) percentRef.current.textContent = String(Math.round(clamped * 100)).padStart(2, '0');
    const next = clamped < 0.34 ? 0 : clamped < 0.67 ? 1 : 2;
    setStage((current) => (current === next ? current : next));
    burstRender(2);
  };

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (pin) publish(value);
  });

  useEffect(() => {
    if (reduce) {
      publish(1);
      return;
    }
    if (pin) {
      publish(scrollYProgress.get());
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 2800);
      publish(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // publish is recreated each render and only touches refs plus setState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, reduce, replay, scrollYProgress]);

  useEffect(() => {
    if (flat || reduce) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      setShow3d(true);
      detach();
    };
    const detach = () => {
      window.removeEventListener('pointermove', start);
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('wheel', start);
      window.removeEventListener('keydown', start);
      window.removeEventListener('touchstart', start);
    };
    window.addEventListener('pointermove', start, { passive: true });
    window.addEventListener('pointerdown', start, { passive: true });
    window.addEventListener('wheel', start, { passive: true });
    window.addEventListener('keydown', start);
    window.addEventListener('touchstart', start, { passive: true });
    return detach;
  }, [flat, reduce]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouseRef.current.x = event.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = event.clientY / window.innerHeight - 0.5;
      stageEl.current?.style.setProperty('--mx', mouseRef.current.x.toFixed(3));
      stageEl.current?.style.setProperty('--my', mouseRef.current.y.toFixed(3));
      if (live) burstRender(10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [live]);

  const assemble = () => {
    if (pin) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    else setReplay((value) => value + 1);
  };

  return (
    <section id="model" ref={sectionRef} className={pin ? 'hero-pin is-pin' : 'hero-pin'}>
      <div className="hero-sticky">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="kicker">Drawing 00 · Rebar first</p>
            <h1 className="display">
              The AI <em>supply chain</em> for building material suppliers.
            </h1>
            <p className="lede">
              Send a full plan set. Leva measures it — rebar first, then lumber, roofing and windows — and carries the job through scheduling and payment.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#takeoff">
                Run a takeoff
              </a>
              <Link className="btn ghost" to="/pricing">
                See pricing
              </Link>
              <button type="button" className="btn ghost" onClick={assemble}>
                Assemble the frame
              </button>
            </div>
            <p className="caption-swap" aria-hidden="true">
              {STAGES[stage]}
            </p>
            <p className="sr">
              Decorative model of a slab, rebar, a timber frame and a roof. It assembles as you scroll and turns slightly with the pointer.
              {flat ? ' A line drawing is shown on this device.' : ''}
            </p>
          </div>
          <div ref={stageEl} className={live ? 'stage is-live' : 'stage'}>
            <div className="stage-chrome">
              <span>Model 00</span>
              <span className="mark">Example</span>
            </div>
            <div className="drawing-wrap">
              <HeroDrawing />
            </div>
            {show3d && !flat && (
              <div className="canvas-wrap">
                <Suspense fallback={null}>
                  <Scene
                    progressRef={progressRef as ProgressRef}
                    mouseRef={mouseRef as MouseRef}
                    dark={theme === 'dark'}
                    onReady={() => setLive(true)}
                    onFail={() => {
                      setFlat(true);
                      setLive(false);
                    }}
                  />
                </Suspense>
              </div>
            )}
            <div className="stage-foot">
              <span>Assembly</span>
              <div className="meter" aria-hidden="true">
                <span />
              </div>
              <span ref={percentRef}>00</span>
            </div>
          </div>
        </div>
      </div>
      <div ref={endRef} />
    </section>
  );
}
