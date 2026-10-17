import { useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { DONE_STATUS, LINE_ITEMS, QUANTITIES, ROOF, SLAB, TAKEOFF_CSV, WALLS, WINDOWS } from '../data';

function useCountUp(target: number, active: boolean) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduce) {
      setValue(target);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 850);
      setValue(target * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduce, target]);

  return value;
}

function formatQty(value: number, digits: number) {
  return digits === 0 ? Math.round(value).toLocaleString('en-AU') : value.toFixed(digits);
}

export function TakeoffDemo() {
  const reduce = useReducedMotion() ?? false;
  const uid = useId().replace(/:/g, '');
  const timers = useRef<number[]>([]);
  const [active, setActive] = useState<Set<string>>(() => new Set());
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [status, setStatus] = useState('Example sheet A-101 is on the table. Run the takeoff to mark it.');
  const done = phase === 'done';
  const rebar = useCountUp(QUANTITIES[0].value, done);
  const lumber = useCountUp(QUANTITIES[1].value, done);
  const roof = useCountUp(QUANTITIES[2].value, done);
  const windows = useCountUp(QUANTITIES[3].value, done);
  const shown = [rebar, lumber, roof, windows];

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const reset = () => {
    clearTimers();
    setActive(new Set());
    setPhase('idle');
    setStatus('Example sheet A-101 is on the table. Run the takeoff to mark it.');
  };

  const run = () => {
    if (phase === 'running') return;
    clearTimers();
    setActive(new Set());
    const sequence = [
      { id: SLAB.id, delay: 180 },
      ...WALLS.map((wall, index) => ({ id: wall.id, delay: 420 + index * 80 })),
      ...WINDOWS.map((windowMark, index) => ({ id: windowMark.id, delay: 1100 + index * 55 })),
      { id: ROOF.id, delay: 1100 + WINDOWS.length * 55 + 160 },
    ];
    if (reduce) {
      setActive(new Set(sequence.map((item) => item.id)));
      setPhase('done');
      setStatus(DONE_STATUS);
      return;
    }
    setPhase('running');
    setStatus('Reading the example sheet.');
    sequence.forEach((item) => {
      const id = window.setTimeout(() => {
        setActive((current) => new Set(current).add(item.id));
      }, item.delay);
      timers.current.push(id);
    });
    const last = sequence[sequence.length - 1]?.delay ?? 0;
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done');
        setStatus(DONE_STATUS);
      }, last + 320),
    );
  };

  const download = () => {
    const blob = new Blob([TAKEOFF_CSV], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leva-example-takeoff.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const on = (id: string) => (active.has(id) ? 'detect on' : 'detect');

  return (
    <section id="takeoff" className="section rule">
      <div className="wrap">
        <header className="section-head">
          <p className="kicker">Live takeoff · Sample sheet</p>
          <h2 className="display-2">Run the example plan.</h2>
          <p className="lede">
            This sheet was drawn for the demo. Nothing is uploaded. Press run and the marks land on the slab, the walls, the windows and the roof.
          </p>
        </header>
        <div className="demo">
          <div className="plan-sheet">
            <svg
              className="plan-svg"
              viewBox="0 0 1000 700"
              role="img"
              aria-label={
                done
                  ? 'Example plan with the slab, walls, windows and roof marked.'
                  : 'Example architectural plan of a sample house, unmarked.'
              }
            >
              <defs>
                <pattern id={`hatch-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
                  <path className="hatch" d="M0 8 L8 0" />
                </pattern>
              </defs>
              <rect x="36" y="28" width="928" height="644" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
              <rect x={SLAB.x} y={SLAB.y} width={SLAB.w} height={SLAB.h} fill={`url(#hatch-${uid})`} />
              <g className="wall">
                <path d="M140 90 H820 V500 H140 Z" />
                <path className="thin" d="M360 90 V500 M590 90 V500 M140 280 H820 M700 280 V500 M700 390 H820" />
              </g>
              <g>
                {WINDOWS.map((mark) => (
                  <rect key={mark.id} className="cut" x={mark.x} y={mark.y} width={mark.w} height={mark.h} />
                ))}
                <rect className="cut" x="470" y="84" width="34" height="12" />
                <rect className="cut" x="134" y="150" width="12" height="88" />
              </g>
              <g className="glass">
                {WINDOWS.map((mark) =>
                  mark.axis === 'h' ? (
                    <line
                      key={`${mark.id}-g`}
                      x1={mark.x}
                      x2={mark.x + mark.w}
                      y1={mark.y + mark.h / 2}
                      y2={mark.y + mark.h / 2}
                    />
                  ) : (
                    <line
                      key={`${mark.id}-g`}
                      y1={mark.y}
                      y2={mark.y + mark.h}
                      x1={mark.x + mark.w / 2}
                      x2={mark.x + mark.w / 2}
                    />
                  ),
                )}
              </g>
              <g className="tick">
                {WINDOWS.filter((mark) => mark.axis === 'h').map((mark) => (
                  <g key={`${mark.id}-t`}>
                    <line x1={mark.x} x2={mark.x} y1={mark.y} y2={mark.y + mark.h} />
                    <line x1={mark.x + mark.w} x2={mark.x + mark.w} y1={mark.y} y2={mark.y + mark.h} />
                  </g>
                ))}
              </g>
              <path className="door" d="M470 90 A34 34 0 0 1 504 124" />
              <path className="door" d="M140 150 H168 V238" />
              <g className="room">
                <text x="230" y="190">GARAGE</text>
                <text x="445" y="175">LIVING</text>
                <text x="670" y="175">KITCHEN</text>
                <text x="220" y="400">BED 1</text>
                <text x="490" y="400">BED 2</text>
                <text x="735" y="340">BATH</text>
                <text x="730" y="455">L'DRY</text>
              </g>
              <g className="tiny">
                <text x="140" y="70">A</text>
                <text x="360" y="70">B</text>
                <text x="590" y="70">C</text>
                <text x="812" y="70">D</text>
                <text x="108" y="94">1</text>
                <text x="108" y="284">2</text>
                <text x="108" y="504">3</text>
              </g>
              <g aria-hidden="true">
                <rect className={`${on(SLAB.id)} slab`} x={SLAB.x} y={SLAB.y} width={SLAB.w} height={SLAB.h} />
                {WALLS.map((mark) => (
                  <rect key={mark.id} className={`${on(mark.id)} wall`} x={mark.x} y={mark.y} width={mark.w} height={mark.h} />
                ))}
                {WINDOWS.map((mark) => (
                  <g key={mark.id}>
                    <rect className={`${on(mark.id)} window`} x={mark.x - 3} y={mark.y - 3} width={mark.w + 6} height={mark.h + 6} />
                  </g>
                ))}
                <rect className={`${on(ROOF.id)} roof`} x={ROOF.x} y={ROOF.y} width={ROOF.w} height={ROOF.h} />
                {phase === 'running' && <rect className="scan" x="140" y="90" width="680" height="4" />}
              </g>
              <g>
                <rect x="620" y="560" width="330" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
                <text className="tiny" x="634" y="582">EXAMPLE SHEET</text>
                <text className="room" x="634" y="608">A-101 · SAMPLE HOUSE</text>
                <text className="tiny" x="634" y="632">NOT FOR CONSTRUCTION</text>
                <text className="tiny" x="634" y="650">SCALE SHOWN AS EXAMPLE</text>
              </g>
            </svg>
            <div className="legend" aria-hidden="true">
              <span><i className="swatch slab" /> Slab</span>
              <span><i className="swatch wall" /> Wall</span>
              <span><i className="swatch window" /> Window</span>
              <span><i className="swatch roof" /> Roof</span>
            </div>
          </div>
          <div className="panel" aria-busy={phase === 'running'}>
            <p className="kicker">Quantities</p>
            <div className="panel-actions">
              <button type="button" className="btn" onClick={run} disabled={phase === 'running'}>
                {phase === 'running' ? 'Reading…' : phase === 'done' ? 'Run again' : 'Run takeoff'}
              </button>
              <button type="button" className="btn ghost" onClick={reset}>
                Reset
              </button>
              <button type="button" className="btn ghost" onClick={download} disabled={!done}>
                Download CSV
              </button>
            </div>
            <p className="status" role="status">{status}</p>
            <table>
              <caption>Example quantities for sample sheet A-101. Not a measured project.</caption>
              <thead>
                <tr>
                  <th scope="col">Quantity</th>
                  <th scope="col">Example result</th>
                </tr>
              </thead>
              <tbody>
                {QUANTITIES.map((row, index) => (
                  <tr key={row.id}>
                    <th scope="row">{row.label}</th>
                    <td>{done ? `${formatQty(shown[index] ?? 0, row.digits)} ${row.unit}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {done && (
              <details>
                <summary>Example line items</summary>
                <table className="lines">
                  <thead>
                    <tr>
                      <th scope="col">Trade</th>
                      <th scope="col">Item</th>
                      <th scope="col">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LINE_ITEMS.map((row) => (
                      <tr key={`${row.trade}-${row.item}`}>
                        <td style={{ textAlign: 'left' }}>{row.trade}</td>
                        <td style={{ textAlign: 'left' }}>{row.item}</td>
                        <td>{row.qty} {row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
