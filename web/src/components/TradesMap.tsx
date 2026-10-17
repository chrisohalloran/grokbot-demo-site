import { useState, type KeyboardEvent } from 'react';
import { TRADES, type TradeId } from '../data';

export function TradesMap() {
  const [trade, setTrade] = useState<TradeId>('rebar');
  const current = TRADES.find((item) => item.id === trade) ?? TRADES[0];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TRADES.findIndex((item) => item.id === trade);
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? TRADES.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + TRADES.length) % TRADES.length;
    const id = TRADES[next]?.id;
    if (!id) return;
    setTrade(id);
    document.getElementById(`trade-${id}`)?.focus();
  };

  return (
    <section id="trades" className="section rule">
      <div className="wrap">
        <header className="section-head">
          <p className="kicker">Trades</p>
          <h2 className="display-2">One building. Four readings.</h2>
          <p className="lede">
            Rebar is where a job starts. Lumber, roofing and windows are the next readings of the same plan set — not a different product.
          </p>
        </header>
        <div className="trade-layout">
          <svg className="elevation" viewBox="0 0 680 420" role="img" aria-label={`${current.name} highlighted on an example building section.`}>
            <line className="ground" x1="36" y1="352" x2="644" y2="352" />
            <g className={trade === 'rebar' ? 'layer on' : 'layer'}>
              <rect className="rebar-slab" x="100" y="316" width="480" height="30" />
              {Array.from({ length: 14 }, (_, i) => (
                <circle key={i} cx={124 + i * 32} cy="331" r="3.2" fill="currentColor" />
              ))}
            </g>
            <g className={trade === 'lumber' ? 'layer on' : 'layer'}>
              <rect className="stud" x="112" y="168" width="16" height="148" />
              <rect className="stud" x="552" y="168" width="16" height="148" />
              {[180, 230, 430, 490].map((x) => (
                <rect key={x} className="stud" x={x} y="168" width="8" height="148" />
              ))}
              <rect className="stud" x="112" y="160" width="456" height="12" />
            </g>
            <g className={trade === 'windows' ? 'layer on' : 'layer'}>
              <rect className="win" x="210" y="198" width="86" height="78" />
              <rect className="win" x="360" y="198" width="86" height="78" />
            </g>
            <g className={trade === 'roofing' ? 'layer on' : 'layer'}>
              <polygon className="roof-shape" points="78,176 340,62 602,176" />
            </g>
          </svg>
          <div>
            <div className="tabs" role="tablist" aria-label="Trades" onKeyDown={onKeyDown}>
              {TRADES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`trade-${item.id}`}
                  aria-selected={trade === item.id}
                  aria-controls="trade-panel"
                  tabIndex={trade === item.id ? 0 : -1}
                  onClick={() => setTrade(item.id)}
                >
                  {item.index} {item.name}
                </button>
              ))}
            </div>
            <div className="trade-copy" id="trade-panel" role="tabpanel" aria-labelledby={`trade-${current.id}`}>
              <p className="kicker">{current.state}</p>
              <h3 className="display-2" style={{ fontSize: '2.4rem' }}>{current.name}</h3>
              <p className="lede">{current.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
