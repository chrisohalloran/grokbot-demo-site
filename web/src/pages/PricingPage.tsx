import { Link } from 'react-router-dom';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { FAQS } from '../data';
import { useTitle } from '../hooks';

export default function PricingPage() {
  useTitle('Pricing — Leva AI');

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap" style={{ display: 'grid', gap: '1rem' }}>
          <p className="kicker">Pricing</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.4rem)' }}>
            Per takeoff. <em>0.3%</em> when you collect.
          </h1>
          <p className="lede">
            No subscription and no seat fee. A takeoff is billed when it runs. Payments collected through Leva are 0.3% of the amount.
          </p>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap">
          <div className="rate-grid">
            <article className="card">
              <p className="kicker">Takeoff</p>
              <strong>When it runs</strong>
              <p>One charge for a plan set. Not a month of access. The calculator uses an <span className="mark">example</span> price you can change.</p>
            </article>
            <article className="card">
              <p className="kicker">Payments</p>
              <strong>0.3%</strong>
              <p>Charged on money collected through Leva. An example $10,000 collection costs $30.</p>
            </article>
            <article className="card">
              <p className="kicker">Monthly</p>
              <strong>$0</strong>
              <p>Nothing to keep open, and nothing to cancel.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap">
          <header className="section-head">
            <p className="kicker">Calculator</p>
            <h2 className="display-2">Try the example arithmetic.</h2>
            <p className="lede">
              Move the inputs. The result is an illustration, not a forecast and not a quote. If the numbers stop looking favourable, the total says so.
            </p>
          </header>
          <SavingsCalculator />
        </div>
      </section>
      <section className="section rule">
        <div className="wrap" style={{ display: 'grid', gap: '1.2rem' }}>
          <h2 className="display-2">Questions worth answering plainly.</h2>
          <div className="faq">
            {FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p>
            <Link to="/#takeoff">Run the example takeoff</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
