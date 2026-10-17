import { useEffect, useRef, useState } from 'react';
import { QUOTE_INC, QUOTE_NO, TONNES, aud } from '../data';

export function AgentNative() {
  const reduce = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)[0];
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setShown(true);
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <section id="agents" className="section rule" ref={ref} data-chat={shown ? 'full' : 'partial'}>
      <div className="wrap">
        <p className="kicker">From a chat, or an inbox</p>
        <h2 className="display-2">The same takeoff, asked wherever the job arrives.</h2>
        <p className="lede">A rep can ask inside ChatGPT or Claude. A builder can email the plans to the yard. Leva answers with the bar list and the quote. There is no separate drawing package to learn.</p>
        <div className="agent-grid">
          <article className="thread" aria-label="Example chat request">
            <header>
              <p className="kicker">In a chat</p>
              <p className="quiet">Example thread. Not a transcript from a customer.</p>
            </header>
            <div className="msg you">
              <p>Quote the reo for this house.</p>
              <p className="attach">example-plans.pdf · 6 sheets</p>
            </div>
            <div className={shown ? 'msg ai on' : 'msg ai'} hidden={!shown}>
              <p>S-101 is the slab. The garage note is N12 at 200 centres. The house bay is SL82. Footings are on S-301.</p>
              <p>Example bar list, {TONNES} t. Quote {QUOTE_NO}, {aud(QUOTE_INC)} including GST, in the yard’s name. Each line cites a region on the sheet.</p>
            </div>
          </article>
          <article className="mail" aria-label="Example email request">
            <header>
              <p className="kicker">By email</p>
              <p className="quiet">Example addresses. Nothing is sent.</p>
            </header>
            <p className="mail-line"><span>From</span> plans@builder.example</p>
            <p className="mail-line"><span>To</span> takeoff@yard.example</p>
            <p className="mail-line"><span>Subject</span> Lot 14 — reo price?</p>
            <p className="mail-body">Plans attached. Can you quote the reo?</p>
            <div className={shown ? 'reply on' : 'reply'} hidden={!shown}>
              <p className="mail-line"><span>Reply</span> Leva, for the yard</p>
              <p>Quote {QUOTE_NO} is attached. Example total {aud(QUOTE_INC)} including GST, {TONNES} t. The estimator can change any line before it goes to the builder.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
