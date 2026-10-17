import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { TakeoffDemo } from '../components/TakeoffDemo';
import { TradesMap } from '../components/TradesMap';
import { TRADES } from '../data';
import { useTitle } from '../hooks';

const RAIL = [
  { id: 'model', label: 'Model' },
  { id: 'takeoff', label: 'Takeoff' },
  { id: 'method', label: 'Method' },
  { id: 'trades', label: 'Trades' },
  { id: 'rates', label: 'Pricing' },
];

function PageRail() {
  const [active, setActive] = useState('model');

  useEffect(() => {
    const nodes = RAIL.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.1, 0.25, 0.5] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="page-rail" aria-label="On this page">
      {RAIL.map((item) => (
        <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default function Home() {
  useTitle('Leva AI — The AI supply chain for building material suppliers');

  return (
    <main id="main" tabIndex={-1}>
      <PageRail />
      <Hero />
      <section className="section" aria-label="Trade order">
        <div className="wrap">
          <p className="kicker">Order of work</p>
          <ol className="trade-row">
            {TRADES.map((trade) => (
              <li key={trade.id}>
                <span>{trade.index}</span>
                {trade.name}
              </li>
            ))}
          </ol>
          <p className="quiet">In that order. One plan set.</p>
        </div>
      </section>
      <TakeoffDemo />
      <HowItWorks />
      <TradesMap />
      <section id="rates" className="section rule">
        <div className="wrap">
          <header className="section-head">
            <p className="kicker">Pricing</p>
            <h2 className="display-2">Pay for the takeoff. Not for a seat.</h2>
            <p className="lede">
              No subscription. Supplier payments collected through Leva are 0.3%. The dollar amounts below are examples so you can try the arithmetic.
            </p>
          </header>
          <div className="rate-grid" style={{ marginBottom: '1.2rem' }}>
            <article className="card">
              <p className="kicker">Takeoff</p>
              <strong>Per plan set</strong>
              <p className="quiet">You pay when a takeoff runs. <span className="mark">Example</span> $49 on the calculator.</p>
            </article>
            <article className="card">
              <p className="kicker">Payments</p>
              <strong>0.3%</strong>
              <p className="quiet">Of the amount collected through Leva. On $10,000, that is $30.</p>
            </article>
            <article className="card">
              <p className="kicker">Subscription</p>
              <strong>$0</strong>
              <p className="quiet">No monthly fee to keep the account open.</p>
            </article>
          </div>
          <SavingsCalculator />
          <p className="quiet" style={{ marginTop: '1rem' }}>
            <Link to="/pricing">Pricing, including the worked example</Link>
          </p>
        </div>
      </section>
      <section className="band">
        <div className="wrap section" style={{ display: 'grid', gap: '1rem' }}>
          <p className="kicker">Next</p>
          <h2 className="display-2">Bring a plan set.</h2>
          <p className="lede">Rebar first. The rest of the sheet follows — lumber, roof, windows — then the delivery and the payment.</p>
          <div className="hero-actions">
            <a className="btn" href="#takeoff">Run the example</a>
            <Link className="btn ghost" to="/product">Read the product</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
