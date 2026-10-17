import { useMemo, useState } from 'react';
import { REVIEW_HOURS, clamp, computeSavings, money } from '../savings';

export function SavingsCalculator() {
  const [takeoffs, setTakeoffs] = useState(24);
  const [manualHours, setManualHours] = useState(5.5);
  const [hourlyRate, setHourlyRate] = useState(95);
  const [price, setPrice] = useState(49);
  const [invoice, setInvoice] = useState(15000);
  const [fee, setFee] = useState(1.5);

  const result = useMemo(
    () =>
      computeSavings({
        takeoffs,
        manualHours,
        reviewHours: REVIEW_HOURS,
        hourlyRate,
        pricePerTakeoff: price,
        avgInvoice: invoice,
        currentFeePercent: fee,
      }),
    [fee, hourlyRate, invoice, manualHours, price, takeoffs],
  );

  return (
    <div className="calc-grid">
      <div className="field-card">
        <p className="kicker">Example inputs</p>
        <label className="field">
          <span className="field-label">
            Takeoffs per month
            <output>{takeoffs}</output>
          </span>
          <input
            type="range"
            min={1}
            max={80}
            value={takeoffs}
            onChange={(event) => setTakeoffs(Number(event.target.value))}
            aria-valuetext={`${takeoffs} takeoffs per month`}
          />
        </label>
        <label className="field">
          <span className="field-label">
            Manual hours each
            <output>{manualHours.toFixed(1)}</output>
          </span>
          <input
            type="range"
            min={0.5}
            max={16}
            step={0.5}
            value={manualHours}
            onChange={(event) => setManualHours(Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span className="field-label">Example labour, $ / hour</span>
          <input
            type="number"
            min={0}
            max={400}
            value={hourlyRate}
            onChange={(event) => setHourlyRate(clamp(Number(event.target.value), 0, 400))}
          />
        </label>
        <label className="field">
          <span className="field-label">Example price per takeoff, $</span>
          <input
            type="number"
            min={0}
            max={2000}
            value={price}
            onChange={(event) => setPrice(clamp(Number(event.target.value), 0, 2000))}
          />
        </label>
        <label className="field">
          <span className="field-label">
            Example collection each job
            <output>{money(invoice)}</output>
          </span>
          <input
            type="range"
            min={1000}
            max={80000}
            step={500}
            value={invoice}
            onChange={(event) => setInvoice(Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span className="field-label">
            Fee you pay elsewhere
            <output>{fee.toFixed(1)}%</output>
          </span>
          <input
            type="range"
            min={0}
            max={4}
            step={0.1}
            value={fee}
            onChange={(event) => setFee(Number(event.target.value))}
          />
        </label>
        <p className="quiet">
          Review time is an example allowance of {REVIEW_HOURS} hours per takeoff. It is not a measured average. Leva’s payments fee in this model is 0.3%.
        </p>
      </div>
      <div className="result">
        <p className="kicker">Example net, per month</p>
        <p className="big num">{money(result.net)}</p>
        <p className="quiet">
          {result.net >= 0
            ? 'At these example inputs, labour time and the fee difference cover the takeoff charges.'
            : 'At these example inputs, the takeoff charges are higher than the labour and fee difference.'}
        </p>
        <dl>
          <div>
            <dt>Hours returned</dt>
            <dd className="num">{result.hoursReturned.toFixed(1)}</dd>
          </div>
          <div>
            <dt>Labour avoided</dt>
            <dd className="num">{money(result.labourAvoided)}</dd>
          </div>
          <div>
            <dt>Payment difference vs 0.3%</dt>
            <dd className="num">{money(result.feeDelta)}</dd>
          </div>
          <div>
            <dt>Takeoff fees</dt>
            <dd className="num">{money(result.takeoffFees)}</dd>
          </div>
        </dl>
        <details>
          <summary>Show the example formula</summary>
          <p>
            Hours returned = takeoffs × (manual hours − {REVIEW_HOURS}). Labour avoided = those hours × the example rate.
            Payment difference = takeoffs × example collection × (your fee − 0.3%). Takeoff fees = takeoffs × the example price.
            Net = labour avoided + payment difference − takeoff fees.
          </p>
        </details>
      </div>
    </div>
  );
}
