import { Link } from 'react-router-dom';
import { AgentNative } from '../components/AgentNative';
import { TakeoffStudio } from '../components/TakeoffStudio';
import { WhiteLabel } from '../components/WhiteLabel';
import { useTitle } from '../hooks';

const STEPS = [
  { n: '01', title: 'The set arrives', body: 'A drop, a chat message, or an email. Architectural sheets and structural sheets in the same PDF.' },
  { n: '02', title: 'Each sheet is named', body: 'Site plan, slab, footing details, elevations, roof, window schedule. The title block and the drawing have to agree.' },
  { n: '03', title: 'Every line cites a region', body: 'A bar mark points at the callout it came from. N12 @ 200, SL82 mesh, a U-bar in a footing. The estimator can open that spot.' },
  { n: '04', title: 'The quote wears the yard’s name', body: 'A bar list, a price, ready for the desk to check and send. Lumber, roofing and windows sit on other tabs of the same set.' },
];

export default function Home() {
  useTitle('Leva AI — From the drawings to a quote');

  return (
    <main id="main" tabIndex={-1}>
      <section className="hero">
        <div className="wrap">
          <p className="kicker">AI-native takeoff for suppliers</p>
          <h1 className="display">From the drawings<br />to a quote.</h1>
          <p className="lede">Drop a plan set. Leva reads every sheet — notes, scales, callouts — and returns a rebar bar list that points back at the drawing, then a quote in the supplier’s name.</p>
          <div className="hero-actions">
            <a className="btn" href="#takeoff">Run the example set</a>
            <Link className="btn ghost" to="/pricing">Pricing</Link>
          </div>
        </div>
      </section>
      <TakeoffStudio />
      <section id="method" className="section">
        <div className="wrap">
          <p className="kicker">How a takeoff runs</p>
          <h2 className="display-2">Sheet, citation, line, price.</h2>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <AgentNative />
      <WhiteLabel />
      <section className="section rule">
        <div className="wrap">
          <p className="kicker">Pricing</p>
          <h2 className="display-2">A takeoff has a price. An idle month does not.</h2>
          <ul className="facts">
            <li><strong>Per takeoff</strong><span>Billed when a set is run. No subscription and no seat fee.</span></li>
            <li><strong>Nothing if unused</strong><span>A quiet month is not a charge.</span></li>
            <li><strong>0.3% to collect</strong><span>Only on payments that go through Leva. Not on the takeoff.</span></li>
          </ul>
          <Link className="btn" to="/pricing">Try the example arithmetic</Link>
        </div>
      </section>
    </main>
  );
}
