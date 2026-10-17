import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import {
  BARS,
  EXAMPLE_SECONDS,
  LUMBER,
  QUOTE_INC,
  REGIONS,
  ROOF_LINES,
  SHEETS,
  TAKEOFF_CSV,
  TONNES,
  TRACE,
  WINDOW_COUNT,
  WINDOW_LINES,
  YARD,
  aud,
  formatClock,
  locate,
  phaseAtLeast,
  type Phase,
  type TraceLine,
  type TradeLine,
} from '../data';
import { PlanSheet, ThumbSheet } from '../sheets';
import { QuoteCard } from './QuoteCard';

const FAN_AT = 700;
const CLASSIFY_AT = 1700;
const READ_AT = 2900;
const TRACE_AT = 3800;
const TRACE_STEP = 320;
const LIST_STEP = 160;

type Tab = 'trace' | 'bars' | 'quote' | 'lumber' | 'roof' | 'windows';

const TABS: { id: Tab; label: string }[] = [
  { id: 'trace', label: 'Trace' },
  { id: 'bars', label: 'Bar list' },
  { id: 'quote', label: 'Quote' },
  { id: 'lumber', label: 'Lumber' },
  { id: 'roof', label: 'Roof' },
  { id: 'windows', label: 'Windows' },
];

function statusFor(phase: Phase): string {
  switch (phase) {
    case 'drop':
      return 'Example plan set received. Six sheets.';
    case 'fan':
      return 'Laying the sheets out.';
    case 'classify':
      return 'Naming each sheet: site, slab, footings, elevations, roof, windows.';
    case 'read':
      return 'Reading scales, notes and callouts.';
    case 'trace':
      return 'Writing the sheet-by-sheet trace, with a citation on each line.';
    case 'list':
      return 'Streaming the example bar list.';
    case 'quote':
      return 'Pricing the example quote.';
    case 'done':
      return `Example quote ready. ${TONNES} tonnes. ${aud(QUOTE_INC)} including GST.`;
  }
}

export function TakeoffStudio() {
  const reduce = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)[0];
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduce ? 'done' : 'drop');
  const [traceCount, setTraceCount] = useState(reduce ? TRACE.length : 0);
  const [rows, setRows] = useState(reduce ? BARS.length : 0);
  const [tab, setTab] = useState<Tab>('bars');
  const [sheetId, setSheetId] = useState('S-101');
  const [activeId, setActiveId] = useState('M1');
  const [fileLabel, setFileLabel] = useState('example-plans.pdf');
  const [hint, setHint] = useState('Any file you drop stays in this browser. The demo plays an example set.');
  const [over, setOver] = useState(false);
  const [announce, setAnnounce] = useState('');
  const picked = useRef(false);
  const stopRef = useRef<() => void>(() => {});
  const clockRef = useRef<HTMLSpanElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);
  const listAt = TRACE_AT + TRACE.length * TRACE_STEP + 200;
  const quoteAt = listAt + BARS.length * LIST_STEP + 360;
  const doneAt = quoteAt + 800;

  useEffect(() => {
    if (reduce) {
      if (clockRef.current) clockRef.current.textContent = formatClock(EXAMPLE_SECONDS);
      return;
    }
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    let raf = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / doneAt);
      if (clockRef.current) clockRef.current.textContent = formatClock(EXAMPLE_SECONDS * t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setPhase('drop');
    setTraceCount(0);
    setRows(0);
    setSheetId('S-101');
    setActiveId('M1');
    if (!picked.current) setTab('trace');
    if (clockRef.current) clockRef.current.textContent = formatClock(0);
    raf = requestAnimationFrame(tick);
    later(FAN_AT, () => setPhase('fan'));
    later(CLASSIFY_AT, () => setPhase('classify'));
    later(READ_AT, () => setPhase('read'));
    later(TRACE_AT, () => setPhase('trace'));
    TRACE.forEach((_, index) => later(TRACE_AT + index * TRACE_STEP, () => setTraceCount(index + 1)));
    later(listAt, () => {
      setPhase('list');
      if (!picked.current) setTab('bars');
    });
    BARS.forEach((_, index) => later(listAt + index * LIST_STEP, () => setRows(index + 1)));
    later(quoteAt, () => setPhase('quote'));
    later(doneAt, () => {
      setPhase('done');
      if (clockRef.current) clockRef.current.textContent = formatClock(EXAMPLE_SECONDS);
    });
    stopRef.current = () => {
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
    };
    return () => stopRef.current();
  }, [doneAt, listAt, quoteAt, reduce, run]);

  useEffect(() => {
    const node = traceRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [traceCount, tab]);

  const showZones = phaseAtLeast(phase, 'read');
  const early = !phaseAtLeast(phase, 'read');
  const located = locate(activeId);
  const hotId = located && located.sheetId === sheetId ? located.regionId : undefined;
  const shown = BARS.slice(0, rows);
  const shownMass = Math.round(shown.reduce((sum, item) => sum + item.massKg, 0) * 10) / 10;

  const choose = (next: Tab) => {
    picked.current = true;
    setTab(next);
  };

  const focusItem = (id: string) => {
    const place = locate(id);
    if (!place) return;
    setActiveId(id);
    setSheetId(place.sheetId);
    setAnnounce(`${place.label}. ${place.cite}. Opened on ${place.sheetId}.`);
  };

  const openTrace = (line: TraceLine) => {
    setSheetId(line.sheetId);
    if (line.itemId) setActiveId(line.itemId);
    setAnnounce(line.itemId ? `${line.text}` : `${line.sheetId}. ${line.text}`);
  };

  const skip = () => {
    stopRef.current();
    setPhase('done');
    setTraceCount(TRACE.length);
    setRows(BARS.length);
    if (!picked.current) setTab('bars');
    if (clockRef.current) clockRef.current.textContent = formatClock(EXAMPLE_SECONDS);
  };

  const replay = () => {
    picked.current = false;
    setRun((value) => value + 1);
  };

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setOver(false);
    const name = event.dataTransfer.files?.[0]?.name;
    if (name) setFileLabel(name);
    setHint(name ? `${name} stays in this browser. Playing the example set.` : 'Playing the example set.');
    replay();
  };

  const download = () => {
    const blob = new Blob([TAKEOFF_CSV], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leva-example-bar-list.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="takeoff" className="section" data-phase={phase} onDragOver={(event) => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}>
      <div className="wrap">
        <div className={`studio${over ? ' is-over' : ''}`}>
          <div className="studio-bar">
            <p className="file-name"><span className="flag">Example</span> {fileLabel}</p>
            <p className="clock">Example elapsed <span ref={clockRef}>{reduce ? formatClock(EXAMPLE_SECONDS) : '00:00'}</span></p>
            {phase === 'done' ? (
              <button type="button" className="btn ghost slim" onClick={replay}>Replay</button>
            ) : (
              <button type="button" className="btn ghost slim" onClick={skip}>Skip to result</button>
            )}
          </div>
          <div className="studio-body">
            {early ? (
              <div className={phase === 'drop' ? 'fan is-drop' : 'fan is-spread'}>
                {phase === 'drop' ? (
                  <div className="pdf-card">
                    <strong>{fileLabel}</strong>
                    <span>6 sheets · architectural and structural</span>
                  </div>
                ) : (
                  SHEETS.map((sheet, index) => (
                    <div
                      key={sheet.id}
                      className="thumb static"
                      style={{ '--i': index } as CSSProperties}
                    >
                      <ThumbSheet id={sheet.id} />
                      <span className="thumb-id">{sheet.id}</span>
                      <span className={phaseAtLeast(phase, 'classify') ? 'thumb-title on' : 'thumb-title'}>{sheet.title}</span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="workspace">
                <div className="film" role="group" aria-label="Sheets in the example set">
                  {SHEETS.map((sheet) => (
                    <button
                      key={sheet.id}
                      type="button"
                      className={sheet.id === sheetId ? 'thumb on' : 'thumb'}
                      aria-pressed={sheet.id === sheetId}
                      onClick={() => setSheetId(sheet.id)}
                    >
                      <ThumbSheet id={sheet.id} />
                      <span className="thumb-id">{sheet.id}</span>
                      <span className="thumb-title on">{sheet.title}</span>
                    </button>
                  ))}
                </div>
                <div className="stage-grid">
                  <div className="viewer">
                    <PlanSheet sheetId={sheetId} hotId={hotId} showZones={showZones} />
                    {showZones && REGIONS.filter((region) => region.sheetId === sheetId).map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        className={region.id === hotId ? 'chip on' : 'chip'}
                        style={{ left: `${region.chipX / 10}%`, top: `${region.chipY / 7}%` }}
                        aria-pressed={region.id === hotId}
                        aria-label={`${region.callout}, example confidence ${region.confidence.toFixed(2)}, show on ${sheetId}`}
                        onClick={() => {
                          const match = [...BARS, ...LUMBER, ...ROOF_LINES, ...WINDOW_LINES].find((item) => item.regionId === region.id);
                          if (match) focusItem(match.id);
                        }}
                      >
                        <span>{region.callout}</span>
                        <span className="conf">{region.confidence.toFixed(2)}</span>
                      </button>
                    ))}
                    <p className="viewer-note">Blue marks are the example reading. Scores are example confidence, not a measured accuracy.</p>
                  </div>
                  <div className="panel">
                    <div className="tabs" role="tablist" aria-label="Result">
                      {TABS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          id={`tab-${item.id}`}
                          aria-selected={tab === item.id}
                          aria-controls="result-panel"
                          onClick={() => choose(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="panel-body" id="result-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
                      {tab === 'trace' && (
                        <div className="trace" ref={traceRef}>
                          <ol>
                            {TRACE.slice(0, traceCount).map((line) => (
                              <li key={line.id}>
                                <button type="button" className={line.itemId && line.itemId === activeId ? 'trace-line on' : 'trace-line'} onClick={() => openTrace(line)}>
                                  <span className="trace-sheet">{line.sheetId}</span>
                                  {line.text}
                                </button>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {tab === 'bars' && (
                        <>
                          <BarTable rows={shown} activeId={activeId} onFocus={focusItem} />
                          <p className="mass-line">Shown mass <strong>{shownMass.toFixed(1)} kg</strong> · example total {TONNES} t</p>
                          {phaseAtLeast(phase, 'quote') && (
                            <div className="summary">
                              <p className="kicker">Example quote · {YARD.name}</p>
                              <p className="sum-total">{aud(QUOTE_INC)} <span>inc GST</span></p>
                              <button type="button" className="btn slim" onClick={() => choose('quote')}>Open the quote</button>
                              <button type="button" className="btn ghost slim" onClick={download} disabled={rows < BARS.length}>Download CSV</button>
                            </div>
                          )}
                        </>
                      )}
                      {tab === 'quote' && <QuoteCard brand={YARD} />}
                      {tab === 'lumber' && <TradeTable lines={LUMBER} caption="Example lumber from the elevation notes. 48 + 90 + 48 = 186 LM." activeId={activeId} onFocus={focusItem} total="186 LM" />}
                      {tab === 'roof' && <TradeTable lines={ROOF_LINES} caption="Example roof quantities. The 142 m² is the note printed on A-401." activeId={activeId} onFocus={focusItem} total="142 m²" />}
                      {tab === 'windows' && <TradeTable lines={WINDOW_LINES} caption={`Example window schedule. Count ${WINDOW_COUNT}.`} activeId={activeId} onFocus={focusItem} total={`${WINDOW_COUNT} no`} />}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {over && <div className="drop-overlay">Release to play the example set</div>}
          </div>
          <p className="status" role="status">{statusFor(phase)}</p>
          <p className="sr" aria-live="polite">{announce}</p>
        </div>
        <p className="quiet studio-hint">{hint} The clock shows an example duration, not the length of this animation.</p>
      </div>
    </section>
  );
}

function BarTable({ rows, activeId, onFocus }: { rows: typeof BARS; activeId: string; onFocus: (id: string) => void }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <caption>Example bar list for the sample house. Not a measured job.</caption>
        <thead>
          <tr>
            <th scope="col">Mark</th>
            <th scope="col">Size</th>
            <th scope="col">Shape</th>
            <th scope="col">Length</th>
            <th scope="col">Qty</th>
            <th scope="col">Mass</th>
            <th scope="col">Cite</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className={item.id === activeId ? 'is-on' : undefined}>
              <th scope="row">{item.mark}</th>
              <td>{item.size}</td>
              <td>{item.shape}</td>
              <td>{item.length}</td>
              <td>{item.qty}</td>
              <td>{item.massKg.toFixed(1)} kg</td>
              <td>
                <button type="button" className="cite" data-item={item.id} aria-pressed={item.id === activeId} onClick={() => onFocus(item.id)}>
                  {item.cite}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TradeTable({ lines, caption, activeId, onFocus, total }: { lines: TradeLine[]; caption: string; activeId: string; onFocus: (id: string) => void; total: string }) {
  return (
    <>
      <div className="table-wrap">
        <table className="data">
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Detail</th>
              <th scope="col">Qty</th>
              <th scope="col">Cite</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item) => (
              <tr key={item.id} className={item.id === activeId ? 'is-on' : undefined}>
                <th scope="row">{item.item}</th>
                <td>{item.detail}</td>
                <td>{item.qty} {item.unit}</td>
                <td>
                  <button type="button" className="cite" data-item={item.id} aria-pressed={item.id === activeId} onClick={() => onFocus(item.id)}>
                    {item.cite}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mass-line">Example total <strong>{total}</strong></p>
    </>
  );
}
