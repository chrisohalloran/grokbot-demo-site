import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BARS, TRACE } from '../data';
import { useTitle } from '../hooks';
import { PlanSheet } from '../sheets';

const FOCUS = ['M1', 'F1', 'M5'] as const;

export default function Product() {
  useTitle('Product — Leva AI');
  const [mark, setMark] = useState<(typeof FOCUS)[number]>('M1');
  const bar = BARS.find((item) => item.id === mark) ?? BARS[0]!;
  const trace = TRACE.find((line) => line.itemId === mark);

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap narrow">
          <p className="kicker">Product</p>
          <h1 className="display">Every line points at the sheet.</h1>
          <p className="lede">Leva is a takeoff. It reads the PDF a supplier was sent and writes a schedule an estimator can check. It does not build a model of the house, and it does not replace the person who sends the quote.</p>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap stage-grid product-grid">
          <div className="viewer">
            <PlanSheet sheetId={bar.sheetId} hotId={bar.regionId} showZones />
          </div>
          <div className="panel">
            <p className="kicker">Example citation</p>
            <div className="brand-switch" role="group" aria-label="Example bar marks">
              {FOCUS.map((id) => {
                const item = BARS.find((barItem) => barItem.id === id);
                return (
                  <button key={id} type="button" className="btn ghost slim" aria-pressed={mark === id} onClick={() => setMark(id)}>
                    {item?.mark} {item?.size}
                  </button>
                );
              })}
            </div>
            <p className="trace-sheet">{bar.cite}</p>
            <p>{trace?.text}</p>
            <table className="data">
              <caption>The selected example line.</caption>
              <tbody>
                <tr><th scope="row">Mark</th><td>{bar.mark}</td></tr>
                <tr><th scope="row">Size</th><td>{bar.size}</td></tr>
                <tr><th scope="row">Shape</th><td>{bar.shape}</td></tr>
                <tr><th scope="row">Length</th><td>{bar.length}</td></tr>
                <tr><th scope="row">Qty</th><td>{bar.qty}</td></tr>
                <tr><th scope="row">Mass</th><td>{bar.massKg.toFixed(1)} kg</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="display-2">What the desk still does.</h2>
          <ul className="facts">
            <li><strong>Check the cite</strong><span>Open the region, agree or change the count, then send.</span></li>
            <li><strong>Keep the name</strong><span>The quote goes out on the yard’s stationery. <Link to="/#white-label">See a fictional skin</Link>.</span></li>
            <li><strong>Same pages, more trades</strong><span>Lumber, roofing and windows are further readings of the set, not a different tool.</span></li>
          </ul>
          <p className="lede">The list is also what the yard schedules against a pour, and what it can collect against. Payments made through Leva are 0.3%.</p>
          <Link className="btn" to="/#agents">See the chat and the inbox</Link>
        </div>
      </section>
    </main>
  );
}
