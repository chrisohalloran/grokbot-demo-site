import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { STORY } from '../data';
import { useMediaQuery } from '../hooks';

function StoryArt({ step }: { step: number }) {
  if (step === 0) {
    return (
      <ul className="files">
        {['A-101-plans.pdf', 'S-201-slab.pdf', 'S-301-details.pdf'].map((file) => (
          <li key={file}>
            <span>{file}</span>
            <span className="file-ext">PDF</span>
          </li>
        ))}
      </ul>
    );
  }
  if (step === 1) {
    return (
      <svg className="mini-plan" viewBox="0 0 320 180" aria-hidden="true">
        <rect x="20" y="20" width="280" height="140" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M120 20 V160 M210 20 V160 M20 90 H300" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="24" y="24" width="272" height="132" fill="none" stroke="var(--blue)" strokeWidth="1.5" />
        <rect x="150" y="16" width="36" height="10" fill="color-mix(in srgb, var(--good) 35%, transparent)" stroke="var(--good)" />
        <rect x="40" y="148" width="40" height="10" fill="color-mix(in srgb, var(--good) 35%, transparent)" stroke="var(--good)" />
      </svg>
    );
  }
  if (step === 2) {
    return (
      <ul className="qty-list">
        <li><span>Rebar</span><strong className="num">1.84 t</strong></li>
        <li><span>Lumber</span><strong className="num">186 LM</strong></li>
        <li><span>Roof</span><strong className="num">142 m²</strong></li>
        <li><span>Windows</span><strong className="num">11</strong></li>
      </ul>
    );
  }
  return (
    <div className="receipt">
      <div><span>Example invoice</span><span className="num">$18,400</span></div>
      <div><span>Payments fee, 0.3%</span><span className="num">$55.20</span></div>
      <div className="total"><span>Supplier receives</span><span className="num">$18,344.80</span></div>
      <p className="quiet">Example collection. The 0.3% is the fee. The invoice amount is not.</p>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion() ?? false;
  const wide = useMediaQuery('(min-width: 981px)');
  const pin = wide && !reduce;
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!pin) return;
    const next = Math.min(STORY.length - 1, Math.floor(value * STORY.length));
    setStep((current) => (current === next ? current : next));
  });

  const jump = (index: number) => {
    const node = ref.current;
    if (!node || !pin) {
      setStep(index);
      return;
    }
    const start = window.scrollY + node.getBoundingClientRect().top;
    const distance = node.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + (distance * (index + 0.12)) / STORY.length, behavior: 'smooth' });
  };

  return (
    <section id="method" ref={ref} className={pin ? 'story is-pin' : 'story section rule'}>
      <div className={pin ? 'story-sticky' : undefined}>
        <div className="wrap">
          <header className="section-head">
            <p className="kicker">How it works</p>
            <h2 className="display-2">Four moves, one set of drawings.</h2>
          </header>
          {pin ? (
            <div className="story-layout">
              <div className="story-copy">
                <div className="tabs" role="tablist" aria-label="Steps">
                  {STORY.map((item, index) => (
                    <button
                      key={item.kicker}
                      type="button"
                      role="tab"
                      id={`step-tab-${index}`}
                      aria-selected={step === index}
                      aria-controls="step-panel"
                      onClick={() => jump(index)}
                    >
                      0{index + 1}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <m.div
                    key={step}
                    id="step-panel"
                    role="tabpanel"
                    aria-labelledby={`step-tab-${step}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                  >
                    <p className="kicker">{STORY[step]?.kicker}</p>
                    <h3 className="display-2" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>{STORY[step]?.title}</h3>
                    <p className="lede">{STORY[step]?.body}</p>
                  </m.div>
                </AnimatePresence>
              </div>
              <div className="story-frame" aria-hidden="true">
                <div className="frame-top">
                  <span>Preview</span>
                  <span className="mark">Example</span>
                </div>
                <div className="frame-body">
                  <StoryArt step={step} />
                </div>
              </div>
            </div>
          ) : (
            <ol className="stack">
              {STORY.map((item, index) => (
                <li key={item.kicker}>
                  <p className="kicker">{item.kicker}</p>
                  <h3 className="display-2" style={{ fontSize: '2rem' }}>{item.title}</h3>
                  <p className="lede">{item.body}</p>
                  <div className="story-frame">
                    <div className="frame-top">
                      <span>Preview</span>
                      <span className="mark">Example</span>
                    </div>
                    <StoryArt step={index} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
