import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TakeoffDemo } from '../components/TakeoffDemo';
import { useTitle } from '../hooks';
import { money } from '../savings';

function exact(value: number) {
  return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PANELS = [
  {
    id: 'takeoff',
    label: 'Takeoff',
    title: 'The sheet becomes a list.',
    body: 'Leva reads the plan set and returns quantities a supplier can price: tonnes of rebar, linear metres of timber, square metres of roof, and a window count.',
  },
  {
    id: 'schedule',
    label: 'Scheduling',
    title: 'The steel meets the pour.',
    body: 'Rebar deliveries sit against the job. The date is yours to set. The takeoff and the booking stay on the same order.',
  },
  {
    id: 'pay',
    label: 'Payments',
    title: 'Collect at 0.3%.',
    body: 'When a supplier takes payment through Leva, the fee is 0.3% of the amount collected. There is no subscription beside it.',
  },
] as const;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

export default function Product() {
  useTitle('Product — Leva AI');
  const [panel, setPanel] = useState<(typeof PANELS)[number]['id']>('takeoff');
  const [day, setDay] = useState<(typeof DAYS)[number]>('Thu');
  const [invoice, setInvoice] = useState(18400);
  const fee = invoice * 0.003;
  const current = PANELS.find((item) => item.id === panel) ?? PANELS[0];

  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="wrap split">
          <div>
            <p className="kicker">Product</p>
            <h1 className="display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
              From the sheet to the booking.
            </h1>
          </div>
          <p className="lede">
            Three jobs, one set of drawings. Measure it, place the rebar, and collect. Lumber, roofing and windows are read from the same kind of set.
          </p>
        </div>
      </section>
      <section className="section rule">
        <div className="wrap product-switch">
          <div className="switch-list" role="tablist" aria-label="Product areas">
            {PANELS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`panel-${item.id}`}
                aria-selected={panel === item.id}
                aria-controls="panel-body"
                onClick={() => setPanel(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div id="panel-body" role="tabpanel" aria-labelledby={`panel-${current.id}`} className="card">
            <p className="kicker">{current.label}</p>
            <h2 className="display-2" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>{current.title}</h2>
            <p className="lede">{current.body}</p>
            {panel === 'schedule' && (
              <div>
                <p className="quiet">Example week. Click a day to park a delivery. Nothing is saved.</p>
                <div className="day-row" role="group" aria-label="Example delivery day">
                  {DAYS.map((name) => (
                    <button key={name} type="button" aria-pressed={day === name} onClick={() => setDay(name)}>
                      {name}
                    </button>
                  ))}
                </div>
                <p>Example: slab steel leaves on {day}.</p>
              </div>
            )}
            {panel === 'pay' && (
              <label className="field">
                <span className="field-label">
                  Example invoice
                  <output>{money(invoice)}</output>
                </span>
                <input
                  type="range"
                  min={2000}
                  max={80000}
                  step={200}
                  value={invoice}
                  onChange={(event) => setInvoice(Number(event.target.value))}
                />
                <p className="quiet">
                  Fee at 0.3% is {exact(fee)}. The supplier receives {exact(invoice - fee)}. The invoice figure is an example; the rate is 0.3%.
                </p>
              </label>
            )}
            {panel === 'takeoff' && (
              <p className="quiet">
                The runnable sheet is below, and on the <Link to="/#takeoff">home page</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
      <TakeoffDemo />
    </main>
  );
}
