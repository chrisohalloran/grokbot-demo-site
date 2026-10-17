import { Link } from 'react-router-dom';
import { useTitle } from '../hooks';

export default function About() {
  useTitle('About — Leva AI');

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap" style={{ display: 'grid', gap: '1.2rem', maxWidth: '46rem' }}>
          <p className="kicker">About</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
            For the yard that still prices from drawings.
          </h1>
          <p className="lede">
            Leva is the AI supply chain for building material suppliers. It starts with rebar: a full plan set in, a takeoff out, then the delivery and the payment. Lumber, roofing and windows are the next readings of those same sheets.
          </p>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap split">
          <div>
            <h2 className="display-2">What it is for</h2>
            <p className="lede" style={{ marginTop: '0.8rem' }}>
              Suppliers who turn drawings into tonnes, lengths and counts, then have to get the material to site and get paid. The first desk is the rebar yard.
            </p>
          </div>
          <div>
            <h2 className="display-2">What this site is</h2>
            <p className="lede" style={{ marginTop: '0.8rem' }}>
              A product demo. The plan is an example sheet. Rates marked example are not a quote. There are no customer logos, testimonials or performance claims here.
            </p>
          </div>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap" style={{ display: 'grid', gap: '1rem' }}>
          <h2 className="display-2">Four things, said once.</h2>
          <ol className="stack">
            <li>
              <h3>Pay for a takeoff, not a seat.</h3>
              <p className="quiet">No subscription.</p>
            </li>
            <li>
              <h3>The payments fee is 0.3%.</h3>
              <p className="quiet">Stated on the amount collected through Leva.</p>
            </li>
            <li>
              <h3>Rebar is the starting trade.</h3>
              <p className="quiet">Lumber, roofing and windows follow on the same kind of plan set.</p>
            </li>
            <li>
              <h3>This demo does not take drawings.</h3>
              <p className="quiet">Run the sample sheet. Nothing is uploaded.</p>
            </li>
          </ol>
          <p>
            <Link to="/product">See the product</Link>
            {' · '}
            <Link to="/pricing">See pricing</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
