import { Link } from 'react-router-dom';
import { useTitle } from '../hooks';

export default function About() {
  useTitle('About — Leva AI');

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap narrow">
          <p className="kicker">About</p>
          <h1 className="display">For the yard that prices from drawings.</h1>
          <p className="lede">Leva reads plan sets for building material suppliers. It starts with rebar: a full PDF in, a bar list and a quote out, each line cited back to the sheet. Lumber, roofing and windows are the same kind of reading on the same pages.</p>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap split">
          <div>
            <h2 className="display-2">What it is for</h2>
            <p>Estimators run out of hours before they run out of jobs. Leva is overflow for that desk. The person who knows the yard still checks the cite, edits the line and sends the quote.</p>
            <p>A job can arrive as a file, as a question in ChatGPT or Claude, or as an email from a builder. The answer is the same schedule.</p>
          </div>
          <div>
            <h2 className="display-2">What this site is</h2>
            <p>A demo. The plan sheets were drawn for it. The counts follow the notes on those sheets, and the prices are example rates. Acme Steel is not a real supplier.</p>
            <p>There are no customer logos and no performance claims on these pages. If a number can be edited, it is marked as an example. The 0.3% payments fee is the fee on money collected through Leva.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow">
          <h2 className="display-2">Four things, said once.</h2>
          <ul className="plain">
            <li>Read the sheets that were sent. Do not invent a model the yard did not ask for.</li>
            <li>Cite the region. A line without a place on the drawing is not finished.</li>
            <li>Price it in the supplier’s name.</li>
            <li>Charge for the takeoff that ran, and 0.3% when a payment runs through the platform.</li>
          </ul>
          <Link className="btn" to="/#takeoff">Run the example set</Link>
        </div>
      </section>
    </main>
  );
}
