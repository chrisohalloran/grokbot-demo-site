import { Link } from 'react-router-dom';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { FAQS } from '../data';
import { useTitle } from '../hooks';

export default function PricingPage() {
  useTitle('Pricing — Leva AI');

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap narrow">
          <p className="kicker">Pricing</p>
          <h1 className="display">Pay when a takeoff runs.</h1>
          <p className="lede">No subscription. Nothing charged in a month you don’t use it. Payments a supplier collects through Leva are 0.3% of the amount.</p>
        </div>
        <div className="wrap">
          <ul className="facts">
            <li><strong>Per takeoff</strong><span>The price is for a set that was read. The dollar amount in the calculator is an example you can edit.</span></li>
            <li><strong>Idle is free</strong><span>No seats to park. No plan ticking over on a quiet week.</span></li>
            <li><strong>0.3% on collection</strong><span>Only when money moves through the platform. The takeoff fee is separate.</span></li>
          </ul>
        </div>
      </section>
      <section className="section rule" id="calculator">
        <div className="wrap">
          <h2 className="display-2">Example arithmetic.</h2>
          <p className="lede">Change the inputs. The result is the arithmetic of those examples, not a promise about a yard’s books.</p>
          <SavingsCalculator />
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow">
          <h2 className="display-2">Plain answers.</h2>
          <div className="faq">
            {FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p className="quiet">The worked example on the home page uses example rates as well. <Link to="/#takeoff">Run that set</Link>.</p>
        </div>
      </section>
    </main>
  );
}
