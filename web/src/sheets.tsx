import { useId } from 'react';
import { REGIONS, SHEETS, type SheetInfo } from './data';

function sheetOf(id: string): SheetInfo {
  return SHEETS.find((item) => item.id === id) ?? SHEETS[0]!;
}

function Bubble({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g className="bubble">
      <circle cx={x} cy={y} r="16" />
      <text x={x} y={y + 5} textAnchor="middle">{label}</text>
    </g>
  );
}

function HDim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mid = (x1 + x2) / 2;
  return (
    <g className="dim">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 7} x2={x1} y2={y + 7} />
      <line x1={x2} y1={y - 7} x2={x2} y2={y + 7} />
      <text x={mid} y={y - 8} textAnchor="middle">{label}</text>
    </g>
  );
}

function VDim({ y1, y2, x, label }: { y1: number; y2: number; x: number; label: string }) {
  const mid = (y1 + y2) / 2;
  return (
    <g className="dim">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 7} y1={y1} x2={x + 7} y2={y1} />
      <line x1={x - 7} y1={y2} x2={x + 7} y2={y2} />
      <text x={x - 10} y={mid + 4} textAnchor="end">{label}</text>
    </g>
  );
}

function TitleBlock({ id, title, scale }: { id: string; title: string; scale: string }) {
  return (
    <g className="titleblock">
      <rect x="588" y="548" width="380" height="122" />
      <line x1="588" y1="578" x2="968" y2="578" />
      <line x1="588" y1="628" x2="968" y2="628" />
      <text x="604" y="570">EXAMPLE SHEET · NOT A REAL JOB</text>
      <text className="tb-id" x="604" y="612">{id}</text>
      <text className="tb-title" x="760" y="612">{title}</text>
      <text x="604" y="652">SCALE {scale} EXAMPLE</text>
      <text x="604" y="674">NOT FOR CONSTRUCTION</text>
    </g>
  );
}

function North({ x, y }: { x: number; y: number }) {
  return (
    <g className="north">
      <circle cx={x} cy={y} r="16" />
      <path d={`M ${x} ${y - 11} L ${x + 5} ${y + 8} L ${x} ${y + 2} L ${x - 5} ${y + 8} Z`} />
      <text x={x} y={y + 32} textAnchor="middle">N</text>
    </g>
  );
}

function Zones({ sheetId, hotId, show }: { sheetId: string; hotId?: string; show: boolean }) {
  if (!show) return null;
  const zones = REGIONS.filter((region) => region.sheetId === sheetId && (sheetId === 'S-101' || region.id === hotId));
  return (
    <g className="zones">
      {zones.map((region) => (
        <rect key={region.id} className={region.id === hotId ? 'hot' : 'warm'} x={region.x} y={region.y} width={region.w} height={region.h} rx="4" />
      ))}
    </g>
  );
}

function Slab({ hatch }: { hatch: string }) {
  return (
    <g>
      <Bubble x={200} y={96} label="A" />
      <Bubble x={370} y={96} label="B" />
      <Bubble x={540} y={96} label="C" />
      <Bubble x={710} y={96} label="D" />
      <Bubble x={78} y={150} label="1" />
      <Bubble x={78} y={300} label="2" />
      <Bubble x={78} y={450} label="3" />
      {[200, 370, 540, 710].map((x) => <line key={x} className="grid" x1={x} y1={112} x2={x} y2={450} />)}
      {[150, 300, 450].map((y) => <line key={y} className="grid" x1={94} y1={y} x2={710} y2={y} />)}
      <rect x="378" y="158" width="324" height="284" fill={`url(#${hatch})`} />
      <rect x="200" y="150" width="510" height="300" className="wall" />
      <rect x="208" y="158" width="494" height="284" className="wall inner" />
      <line className="wall" x1="370" y1="150" x2="370" y2="450" />
      <line className="wall" x1="378" y1="158" x2="378" y2="442" />
      <rect x="208" y="288" width="494" height="24" className="beam" />
      <text className="room" x="285" y="240" textAnchor="middle">GARAGE</text>
      <text className="room" x="540" y="240" textAnchor="middle">HOUSE</text>
      <text className="note" x="470" y="210">SL82 MESH</text>
      <text className="note" x="214" y="186">N12 @ 200</text>
      <text className="note" x="420" y="280">2-N16 BTM · N12 TIES @ 200</text>
      <HDim x1={200} x2={370} y={490} label="3600" />
      <HDim x1={370} x2={540} y={490} label="3600" />
      <HDim x1={540} x2={710} y={490} label="3600" />
      <VDim x={150} y1={150} y2={300} label="3000" />
      <VDim x={150} y1={300} y2={450} label="3000" />
      <text className="dim-note" x="200" y="530">10800 × 6000 EXAMPLE</text>
      <North x={860} y={140} />
    </g>
  );
}

function Footing() {
  return (
    <g>
      <text className="note" x="72" y="78">DETAIL 1 · EDGE FOOTING · EXAMPLE</text>
      <line className="ground" x1="80" y1="250" x2="900" y2="250" />
      <text className="dim-note" x="80" y="96">GL</text>
      <rect x="120" y="210" width="620" height="40" className="conc" />
      <path className="conc" d="M200 250 H560 V470 H360 V390 H200 Z" />
      <text className="room" x="430" y="200" textAnchor="middle">100 SLAB</text>
      <path className="bar" d="M230 300 H300 V430" />
      <path className="bar" d="M250 300 H320 V450" />
      <text className="note" x="188" y="292">N12 L-BAR</text>
      <path className="bar" d="M430 280 V430 H520 V280" />
      <path className="bar" d="M455 280 V445 H545 V280" />
      <text className="note" x="430" y="268">N16 U-BAR @ 200</text>
      <HDim x1={360} x2={560} y={510} label="450" />
      <VDim x={620} y1={250} y2={470} label="400" />
      <text className="dim-note" x="80" y="500">Trench run on plan 33.60 m example</text>
      <North x={900} y={120} />
    </g>
  );
}

function Site() {
  return (
    <g>
      <rect x="120" y="90" width="700" height="430" className="wall" />
      <rect x="300" y="210" width="240" height="160" className="foot" />
      <text className="room" x="420" y="295" textAnchor="middle">HOUSE</text>
      <path className="drive" d="M300 370 H180 V470 H420" />
      <text className="note" x="180" y="450">DRIVE</text>
      <HDim x1={120} x2={820} y={500} label="30000" />
      <VDim x={80} y1={90} y2={520} label="20000" />
      <text className="note" x="310" y="200">SETBACK 5000</text>
      <North x={900} y={130} />
    </g>
  );
}

function Elevation() {
  return (
    <g>
      <text className="note" x="72" y="78">NORTH ELEVATION · EXAMPLE</text>
      <line className="ground" x1="80" y1="450" x2="900" y2="450" />
      <path className="wall" d="M160 450 V230 H720 V450" />
      <path className="roof" d="M140 230 L440 90 L740 230" />
      <rect x="220" y="280" width="90" height="110" className="opening" />
      <rect x="360" y="300" width="70" height="70" className="opening" />
      <rect x="500" y="270" width="130" height="160" className="opening" />
      <text className="note" x="150" y="130">140×45 JOISTS @ 450</text>
      <text className="note" x="230" y="260">STUDS @ 450</text>
      <text className="note" x="160" y="430">90×45 PLATE</text>
      <VDim x={80} y1={230} y2={450} label="2700" />
      <HDim x1={160} x2={720} y={500} label="10800" />
    </g>
  );
}

function Roof() {
  return (
    <g>
      <rect x="170" y="132" width="560" height="300" className="wall" />
      <path className="roof" d="M170 132 L450 282 L170 432" />
      <path className="roof" d="M730 132 L450 282 L730 432" />
      <line className="ridge" x1="330" y1="282" x2="570" y2="282" />
      <text className="note" x="360" y="250">AREA 142 m² EXAMPLE</text>
      <text className="note" x="390" y="310">RIDGE</text>
      <HDim x1={330} x2={570} y={470} label="12400" />
      <text className="dim-note" x="170" y="510">Eaves 33.60 m example · slope 22° example</text>
      <North x={860} y={160} />
    </g>
  );
}

function Windows() {
  const rows = [
    ['W1', '1810 × 1210', '4', 'AWNING'],
    ['W2', '1810 × 610', '3', 'HIGHLIGHT'],
    ['W3', '610 × 610', '2', 'AWNING'],
    ['SD1', '2110 × 2110', '2', 'SLIDING'],
  ];
  return (
    <g>
      <text className="note" x="108" y="120">WINDOW SCHEDULE · EXAMPLE</text>
      {['MARK', 'SIZE', 'QTY', 'TYPE'].map((label, index) => (
        <text key={label} className="head" x={140 + index * 180} y="188">{label}</text>
      ))}
      <line x1="108" y1="200" x2="860" y2="200" />
      {rows.map((row, index) => (
        <g key={row[0]}>
          <line x1="108" y1={248 + index * 48} x2="860" y2={248 + index * 48} />
          {row.map((cell, cellIndex) => (
            <text key={cell} className="cell" x={140 + cellIndex * 180} y={232 + index * 48}>{cell}</text>
          ))}
        </g>
      ))}
      <text className="note" x="108" y="460">COUNT 11 · NOT FOR CONSTRUCTION</text>
    </g>
  );
}

export function PlanSheet({ sheetId, hotId, showZones }: { sheetId: string; hotId?: string; showZones: boolean }) {
  const hatch = useId().replace(/:/g, '');
  const sheet = sheetOf(sheetId);
  const hot = REGIONS.find((region) => region.id === hotId);
  const label = `${sheet.title}, example sheet ${sheet.id}${hot ? `, highlight ${hot.callout}` : ''}`;

  return (
    <svg className="plan" viewBox="0 0 1000 700" role="img" aria-label={label}>
      <defs>
        <pattern id={hatch} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 10 L10 0" />
        </pattern>
      </defs>
      <rect className="paper" width="1000" height="700" />
      <rect className="border" x="28" y="28" width="944" height="644" />
      {sheetId === 'A-001' && <Site />}
      {sheetId === 'S-101' && <Slab hatch={hatch} />}
      {sheetId === 'S-301' && <Footing />}
      {sheetId === 'A-201' && <Elevation />}
      {sheetId === 'A-401' && <Roof />}
      {sheetId === 'A-601' && <Windows />}
      <TitleBlock id={sheet.id} title={sheet.title.toUpperCase()} scale={sheet.scale} />
      <Zones sheetId={sheetId} hotId={hotId} show={showZones} />
    </svg>
  );
}

export function ThumbSheet({ id }: { id: string }) {
  return (
    <svg className="thumb-svg" viewBox="0 0 120 84" aria-hidden="true">
      <rect width="120" height="84" fill="#fbfbf8" />
      <rect x="2" y="2" width="116" height="80" fill="none" stroke="#1a1a1a" />
      {id === 'A-001' && <rect x="28" y="22" width="28" height="20" fill="none" stroke="#1a1a1a" />}
      {id === 'S-101' && (
        <g fill="none" stroke="#1a1a1a">
          <rect x="18" y="16" width="84" height="48" />
          <path d="M40 16 V64 M18 40 H102" />
        </g>
      )}
      {id === 'S-301' && <path d="M16 28 H90 V58 H60 V44 H16 Z" fill="none" stroke="#1a1a1a" />}
      {id === 'A-201' && <path d="M16 58 V32 H100 V58 M12 32 L58 14 L104 32" fill="none" stroke="#1a1a1a" />}
      {id === 'A-401' && <path d="M16 18 H104 V62 H16 Z M16 18 L60 40 L16 62 M104 18 L60 40 L104 62" fill="none" stroke="#1a1a1a" />}
      {id === 'A-601' && (
        <g stroke="#1a1a1a">
          <path d="M16 24 H104 M16 36 H104 M16 48 H104 M16 60 H104" />
        </g>
      )}
    </svg>
  );
}
