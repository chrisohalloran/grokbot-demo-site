import { useState } from 'react';
import {
  BARS,
  BEND_ALLOWANCE,
  DELIVERY_ALLOWANCE,
  PAYMENT_FEE,
  QUOTE_EX,
  QUOTE_GST,
  QUOTE_INC,
  QUOTE_NO,
  RATE_PER_KG,
  TONNES,
  aud,
  type Brand,
} from '../data';

export function QuoteCard({ brand }: { brand: Brand }) {
  const [armed, setArmed] = useState(false);

  return (
    <article className={brand.id === 'acme' ? 'paper-card acme' : 'paper-card'} aria-label={`${brand.name} example quote ${QUOTE_NO}`}>
      <header className="brand-bar">
        <div>
          <p className="brand-name">{brand.name}</p>
          <p className="brand-line">{brand.line}</p>
        </div>
        <span className="flag">{brand.fictional ? 'Fictional' : 'Example'}</span>
      </header>
      <div className="quote-body">
        <p className="quote-kicker">Quote {QUOTE_NO} · Sample house, lot 14</p>
        <p className="quote-lead">{TONNES} t of rebar. Example supply at {aud(RATE_PER_KG)} per kg.</p>
        <div className="table-wrap">
          <table className="data">
            <caption>Example priced lines for {QUOTE_NO}. Not a tender.</caption>
            <thead>
              <tr>
                <th scope="col">Mark</th>
                <th scope="col">kg</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {BARS.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.mark} {item.size}</th>
                  <td>{item.massKg.toFixed(1)}</td>
                  <td>{aud(item.supply)}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Bend and fix</th>
                <td>—</td>
                <td>{aud(BEND_ALLOWANCE)}</td>
              </tr>
              <tr>
                <th scope="row">Delivery</th>
                <td>—</td>
                <td>{aud(DELIVERY_ALLOWANCE)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <dl className="totals">
          <div><dt>Ex GST</dt><dd>{aud(QUOTE_EX)}</dd></div>
          <div><dt>GST 10%</dt><dd>{aud(QUOTE_GST)}</dd></div>
          <div><dt>Total</dt><dd>{aud(QUOTE_INC)}</dd></div>
        </dl>
        <p className="fine">
          Bend, delivery and the kilogram rate are examples. If this total were collected through Leva, the fee would be 0.3% ({aud(PAYMENT_FEE)}). The takeoff is billed separately.
        </p>
        <button type="button" className="btn slim" onClick={() => setArmed(true)} aria-pressed={armed}>
          {armed ? 'Not sent. This demo stops here.' : 'Mark ready to send'}
        </button>
      </div>
    </article>
  );
}
