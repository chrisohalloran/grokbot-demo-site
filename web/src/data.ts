export const EXAMPLE_SECONDS = 222;
export const QUOTE_NO = 'Q-1044';
export const RATE_PER_KG = 2.65;
export const BEND_ALLOWANCE = 420;
export const DELIVERY_ALLOWANCE = 180;
export const MESH_SHEET_KG = 51.3;

const KG_PER_M = { N12: 0.888, N16: 1.578 } as const;

export const PHASES = ['drop', 'fan', 'classify', 'read', 'trace', 'list', 'quote', 'done'] as const;
export type Phase = (typeof PHASES)[number];

export function phaseAtLeast(phase: Phase, target: Phase): boolean {
  return PHASES.indexOf(phase) >= PHASES.indexOf(target);
}

export function formatClock(total: number): string {
  const seconds = Math.max(0, Math.round(total));
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`;
}

export function aud(value: number): string {
  return value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function cutMass(kgPerM: number, lengthM: number, qty: number): number {
  return Math.round(kgPerM * lengthM * qty * 10) / 10;
}

export type SheetInfo = {
  id: string;
  title: string;
  discipline: string;
  scale: string;
};

export const SHEETS: SheetInfo[] = [
  { id: 'A-001', title: 'Site plan', discipline: 'Architectural', scale: '1:200' },
  { id: 'S-101', title: 'Slab plan', discipline: 'Structural', scale: '1:100' },
  { id: 'S-301', title: 'Footing details', discipline: 'Structural', scale: '1:20' },
  { id: 'A-201', title: 'Elevations', discipline: 'Architectural', scale: '1:100' },
  { id: 'A-401', title: 'Roof plan', discipline: 'Architectural', scale: '1:100' },
  { id: 'A-601', title: 'Window schedule', discipline: 'Architectural', scale: 'NTS' },
];

export type Region = {
  id: string;
  sheetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  chipX: number;
  chipY: number;
  callout: string;
  confidence: number;
};

export const REGIONS: Region[] = [
  { id: 'garage', sheetId: 'S-101', x: 208, y: 158, w: 154, h: 284, chipX: 214, chipY: 164, callout: 'N12 @ 200 CRS', confidence: 0.94 },
  { id: 'mesh', sheetId: 'S-101', x: 378, y: 158, w: 324, h: 284, chipX: 520, chipY: 164, callout: 'SL82 MESH', confidence: 0.97 },
  { id: 'beam', sheetId: 'S-101', x: 208, y: 276, w: 494, h: 40, chipX: 400, chipY: 248, callout: '2-N16 BTM · TIES @ 200', confidence: 0.91 },
  { id: 'lbar', sheetId: 'S-301', x: 188, y: 268, w: 150, h: 168, chipX: 196, chipY: 236, callout: 'N12 L-BAR', confidence: 0.9 },
  { id: 'ubar', sheetId: 'S-301', x: 400, y: 236, w: 210, h: 210, chipX: 430, chipY: 210, callout: 'N16 U-BAR @ 200', confidence: 0.92 },
  { id: 'joists', sheetId: 'A-201', x: 150, y: 118, w: 300, h: 36, chipX: 160, chipY: 96, callout: '140×45 JOISTS @ 450', confidence: 0.84 },
  { id: 'studs', sheetId: 'A-201', x: 160, y: 188, w: 560, h: 200, chipX: 176, chipY: 196, callout: 'STUDS @ 450', confidence: 0.86 },
  { id: 'plates', sheetId: 'A-201', x: 160, y: 418, w: 560, h: 28, chipX: 176, chipY: 392, callout: '90×45 PLATE', confidence: 0.88 },
  { id: 'roof', sheetId: 'A-401', x: 170, y: 132, w: 560, h: 300, chipX: 188, chipY: 146, callout: 'AREA 142 m²', confidence: 0.93 },
  { id: 'wins', sheetId: 'A-601', x: 108, y: 168, w: 784, h: 250, chipX: 120, chipY: 142, callout: '11 OPENINGS', confidence: 0.98 },
];

export type Bar = {
  id: string;
  mark: string;
  size: string;
  shape: string;
  length: string;
  qty: number;
  massKg: number;
  supply: number;
  sheetId: string;
  regionId: string;
  cite: string;
  callout: string;
};

function bar(input: Omit<Bar, 'massKg' | 'supply'> & { massKg: number }): Bar {
  return { ...input, supply: round2(input.massKg * RATE_PER_KG) };
}

export const BARS: Bar[] = [
  bar({
    id: 'F1',
    mark: 'F1',
    size: 'SL82',
    shape: 'Sheet',
    length: '6.0×2.4 m',
    qty: 5,
    massKg: Math.round(MESH_SHEET_KG * 5 * 10) / 10,
    sheetId: 'S-101',
    regionId: 'mesh',
    cite: 'S-101 house',
    callout: 'SL82 MESH',
  }),
  bar({
    id: 'M1',
    mark: 'M1',
    size: 'N12',
    shape: 'Straight',
    length: '5.80 m',
    qty: 19,
    massKg: cutMass(KG_PER_M.N12, 5.8, 19),
    sheetId: 'S-101',
    regionId: 'garage',
    cite: 'S-101 garage',
    callout: 'N12 @ 200 CRS',
  }),
  bar({
    id: 'M2',
    mark: 'M2',
    size: 'N12',
    shape: 'Straight',
    length: '3.40 m',
    qty: 31,
    massKg: cutMass(KG_PER_M.N12, 3.4, 31),
    sheetId: 'S-101',
    regionId: 'garage',
    cite: 'S-101 garage',
    callout: 'N12 @ 200 CRS',
  }),
  bar({
    id: 'M3',
    mark: 'M3',
    size: 'N16',
    shape: 'Straight',
    length: '10.60 m',
    qty: 2,
    massKg: cutMass(KG_PER_M.N16, 10.6, 2),
    sheetId: 'S-101',
    regionId: 'beam',
    cite: 'S-101 grid 2',
    callout: '2-N16 BTM',
  }),
  bar({
    id: 'M4',
    mark: 'M4',
    size: 'N12',
    shape: 'Tie',
    length: '1.60 m',
    qty: 55,
    massKg: cutMass(KG_PER_M.N12, 1.6, 55),
    sheetId: 'S-101',
    regionId: 'beam',
    cite: 'S-101 grid 2',
    callout: 'TIES @ 200',
  }),
  bar({
    id: 'M5',
    mark: 'M5',
    size: 'N16',
    shape: 'U-bar',
    length: '1.10 m',
    qty: 168,
    massKg: cutMass(KG_PER_M.N16, 1.1, 168),
    sheetId: 'S-301',
    regionId: 'ubar',
    cite: 'S-301 trench',
    callout: 'N16 U-BAR @ 200',
  }),
  bar({
    id: 'M6',
    mark: 'M6',
    size: 'N12',
    shape: 'L-bar',
    length: '0.90 m',
    qty: 40,
    massKg: cutMass(KG_PER_M.N12, 0.9, 40),
    sheetId: 'S-301',
    regionId: 'lbar',
    cite: 'S-301 toe',
    callout: 'N12 L-BAR',
  }),
];

export const BAR_MASS = round2(BARS.reduce((sum, item) => sum + item.massKg, 0) * 10) / 10;
export const BAR_SUPPLY = round2(BARS.reduce((sum, item) => sum + item.supply, 0));
export const QUOTE_EX = round2(BAR_SUPPLY + BEND_ALLOWANCE + DELIVERY_ALLOWANCE);
export const QUOTE_GST = round2(QUOTE_EX * 0.1);
export const QUOTE_INC = round2(QUOTE_EX + QUOTE_GST);
export const PAYMENT_FEE = round2(QUOTE_INC * 0.003);
export const TONNES = (BAR_MASS / 1000).toFixed(3);

export type TraceLine = {
  id: string;
  sheetId: string;
  itemId?: string;
  text: string;
};

export const TRACE: TraceLine[] = [
  { id: 't1', sheetId: 'A-001', text: 'A-001 Site plan. Title block says scale 1:200. Footprint and setbacks only. No reinforcement on this sheet.' },
  { id: 't2', sheetId: 'S-101', text: 'S-101 Slab plan. Scale 1:100. Grids A–D are 3.60 m bays. Grids 1–3 are 3.00 m bays. Overall 10.80 × 6.00 m.' },
  { id: 't3', sheetId: 'S-101', itemId: 'F1', text: 'House bay is noted SL82 mesh. Area 7.20 × 6.00 m. Example sheet 6.0 × 2.4 m, plus an example lap allowance: 5 sheets. Example confidence 0.97.' },
  { id: 't4', sheetId: 'S-101', itemId: 'M1', text: 'Garage note: N12 @ 200 CRS. Long bars run the 6.00 m depth, 100 mm cover each end, cut 5.80 m. 3.60 / 0.20 + 1 = 19 bars. Example confidence 0.94.' },
  { id: 't5', sheetId: 'S-101', itemId: 'M2', text: 'Garage short bars run the 3.60 m bay, cut 3.40 m. 6.00 / 0.20 + 1 = 31 bars.' },
  { id: 't6', sheetId: 'S-101', itemId: 'M3', text: 'Grid 2 beam: 2-N16 bottom, cut 10.60 m, two bars. N12 ties @ 200, 55 at 1.60 m. Example confidence 0.91.' },
  { id: 't7', sheetId: 'S-301', itemId: 'M5', text: 'S-301 footing section. N16 U-bar @ 200 along 33.6 m of trench: 168 bars, each 1.10 m. Example confidence 0.92.' },
  { id: 't8', sheetId: 'S-301', itemId: 'M6', text: 'Same detail, toe of the footing: N12 L-bars, 40 at 0.90 m. Example confidence 0.90.' },
  { id: 't9', sheetId: 'A-201', text: 'A-201 Elevations. Framing notes for the lumber tab: plates, studs, joists. No bar marks on this sheet.' },
  { id: 't10', sheetId: 'A-401', text: 'A-401 Roof plan. The note on the sheet reads 142 m². That figure is printed on this example drawing, then read back.' },
  { id: 't11', sheetId: 'A-601', text: 'A-601 Window schedule. Four marks. 4 + 3 + 2 + 2 = 11 openings. Example confidence 0.98.' },
];

export type TradeLine = {
  id: string;
  item: string;
  detail: string;
  qty: string;
  unit: string;
  sheetId: string;
  regionId: string;
  cite: string;
};

export const LUMBER: TradeLine[] = [
  { id: 'L1', item: '90×45 MGP10', detail: 'Plates', qty: '48', unit: 'LM', sheetId: 'A-201', regionId: 'plates', cite: 'A-201 plate' },
  { id: 'L2', item: '90×45 MGP10', detail: 'Studs @ 450', qty: '90', unit: 'LM', sheetId: 'A-201', regionId: 'studs', cite: 'A-201 studs' },
  { id: 'L3', item: '140×45 MGP10', detail: 'Joists @ 450', qty: '48', unit: 'LM', sheetId: 'A-201', regionId: 'joists', cite: 'A-201 joists' },
];

export const ROOF_LINES: TradeLine[] = [
  { id: 'RF1', item: 'Roof area', detail: 'Note on the plan', qty: '142', unit: 'm²', sheetId: 'A-401', regionId: 'roof', cite: 'A-401 note' },
  { id: 'RF2', item: 'Ridge', detail: 'Dimension on the plan', qty: '12.4', unit: 'm', sheetId: 'A-401', regionId: 'roof', cite: 'A-401 ridge' },
  { id: 'RF3', item: 'Eaves', detail: 'Example perimeter', qty: '33.6', unit: 'm', sheetId: 'A-401', regionId: 'roof', cite: 'A-401 eaves' },
];

export const WINDOW_LINES: TradeLine[] = [
  { id: 'W1', item: 'W1', detail: '1810 × 1210', qty: '4', unit: 'no', sheetId: 'A-601', regionId: 'wins', cite: 'A-601 W1' },
  { id: 'W2', item: 'W2', detail: '1810 × 610', qty: '3', unit: 'no', sheetId: 'A-601', regionId: 'wins', cite: 'A-601 W2' },
  { id: 'W3', item: 'W3', detail: '610 × 610', qty: '2', unit: 'no', sheetId: 'A-601', regionId: 'wins', cite: 'A-601 W3' },
  { id: 'SD1', item: 'SD1', detail: '2110 × 2110 sliding', qty: '2', unit: 'no', sheetId: 'A-601', regionId: 'wins', cite: 'A-601 SD1' },
];

export const WINDOW_COUNT = WINDOW_LINES.reduce((sum, line) => sum + Number(line.qty), 0);

export type Brand = {
  id: 'yard' | 'acme';
  name: string;
  line: string;
  fictional: boolean;
};

export const YARD: Brand = { id: 'yard', name: 'Example Yard', line: 'Estimating', fictional: false };
export const ACME: Brand = { id: 'acme', name: 'Acme Steel', line: 'Estimating desk', fictional: true };

export function locate(id: string): { sheetId: string; regionId: string; cite: string; label: string } | null {
  const found = BARS.find((item) => item.id === id);
  if (found) return { sheetId: found.sheetId, regionId: found.regionId, cite: found.cite, label: `${found.mark} ${found.size}` };
  const trade = [...LUMBER, ...ROOF_LINES, ...WINDOW_LINES].find((item) => item.id === id);
  if (trade) return { sheetId: trade.sheetId, regionId: trade.regionId, cite: trade.cite, label: trade.item };
  return null;
}

export function regionById(id: string): Region | undefined {
  return REGIONS.find((region) => region.id === id);
}

export const TAKEOFF_CSV = [
  'note,Example takeoff for the sample house on these sheets. Not a measured project.',
  'mark,size,shape,length,qty,mass_kg,supply_aud,sheet,cite',
  ...BARS.map((item) => [item.mark, item.size, item.shape, item.length, item.qty, item.massKg, item.supply, item.sheetId, item.cite].join(',')),
  `total_mass_kg,${BAR_MASS}`,
  `supply_aud,${BAR_SUPPLY}`,
  `example_bend_aud,${BEND_ALLOWANCE}`,
  `example_delivery_aud,${DELIVERY_ALLOWANCE}`,
  `example_total_inc_gst_aud,${QUOTE_INC}`,
].join('\n');

export const FAQS = [
  {
    q: 'Is there a subscription?',
    a: 'No. There is no seat fee and no monthly plan. A takeoff is billed when it runs.',
  },
  {
    q: 'What if a month goes by with no takeoffs?',
    a: 'Nothing is charged. Unused time is not a product you are paying for.',
  },
  {
    q: 'What does the 0.3% cover?',
    a: 'Payments a supplier collects through Leva. It is not a charge on the takeoff itself.',
  },
  {
    q: 'Are the calculator prices real?',
    a: 'The dollar inputs are examples you can change. The 0.3% payments fee is the platform fee. Review time is an example allowance, not a measured average.',
  },
  {
    q: 'Does this replace the estimating desk?',
    a: 'No. It is overflow capacity for the estimators already there. Every line can be checked against the sheet it came from.',
  },
  {
    q: 'Are the drawings a real job?',
    a: 'No. The sheets, the bar list, the other quantities and the quote are examples made for this demo. Acme Steel is a fictional supplier.',
  },
] as const;
