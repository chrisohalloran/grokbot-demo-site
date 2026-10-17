import { useState } from 'react';
import { ACME, YARD, type Brand } from '../data';
import { QuoteCard } from './QuoteCard';

export function WhiteLabel() {
  const [brand, setBrand] = useState<Brand>(ACME);

  return (
    <section id="white-label" className="section">
      <div className="wrap white-grid">
        <div>
          <p className="kicker">The yard’s name on the quote</p>
          <h2 className="display-2">Overflow for the estimators you already have.</h2>
          <p className="lede">The reading does not change when the stationery does. Leva is extra capacity for the desk, not a replacement for it. Acme Steel is fictional, used here so the skin is obvious.</p>
          <div className="brand-switch" role="group" aria-label="Quote stationery">
            {[YARD, ACME].map((item) => (
              <button key={item.id} type="button" className="btn ghost slim" aria-pressed={brand.id === item.id} onClick={() => setBrand(item)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <QuoteCard brand={brand} />
      </div>
    </section>
  );
}
