export type BoxKind = 'slab' | 'wall' | 'window' | 'roof';

export type Mark = {
  id: string;
  kind: BoxKind;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

export type WindowMark = Mark & { axis: 'h' | 'v' };

export const SLAB: Mark = { id: 'slab', kind: 'slab', x: 140, y: 90, w: 680, h: 410, label: 'Slab' };
export const ROOF: Mark = { id: 'roof', kind: 'roof', x: 112, y: 62, w: 736, h: 466, label: 'Roof' };

export const WALLS: Mark[] = [
  { id: 'wall-n', kind: 'wall', x: 140, y: 78, w: 680, h: 24, label: 'North wall' },
  { id: 'wall-s', kind: 'wall', x: 140, y: 488, w: 680, h: 24, label: 'South wall' },
  { id: 'wall-w', kind: 'wall', x: 128, y: 90, w: 24, h: 410, label: 'West wall' },
  { id: 'wall-e', kind: 'wall', x: 808, y: 90, w: 24, h: 410, label: 'East wall' },
  { id: 'wall-b', kind: 'wall', x: 348, y: 90, w: 24, h: 410, label: 'Grid B' },
  { id: 'wall-c', kind: 'wall', x: 578, y: 90, w: 24, h: 410, label: 'Grid C' },
  { id: 'wall-2', kind: 'wall', x: 140, y: 268, w: 680, h: 24, label: 'Grid 2' },
];

export const WINDOWS: WindowMark[] = [
  { id: 'w1', kind: 'window', axis: 'h', x: 168, y: 84, w: 78, h: 12, label: 'W1' },
  { id: 'w2', kind: 'window', axis: 'h', x: 386, y: 84, w: 70, h: 12, label: 'W2' },
  { id: 'w3', kind: 'window', axis: 'h', x: 518, y: 84, w: 58, h: 12, label: 'W3' },
  { id: 'w4', kind: 'window', axis: 'h', x: 648, y: 84, w: 92, h: 12, label: 'W4' },
  { id: 'w5', kind: 'window', axis: 'v', x: 814, y: 118, w: 12, h: 58, label: 'W5' },
  { id: 'w6', kind: 'window', axis: 'v', x: 814, y: 198, w: 12, h: 48, label: 'W6' },
  { id: 'w7', kind: 'window', axis: 'v', x: 814, y: 308, w: 12, h: 52, label: 'W7' },
  { id: 'w8', kind: 'window', axis: 'h', x: 176, y: 494, w: 84, h: 12, label: 'W8' },
  { id: 'w9', kind: 'window', axis: 'h', x: 420, y: 494, w: 78, h: 12, label: 'W9' },
  { id: 'w10', kind: 'window', axis: 'h', x: 548, y: 494, w: 72, h: 12, label: 'W10' },
  { id: 'w11', kind: 'window', axis: 'v', x: 134, y: 348, w: 12, h: 72, label: 'W11' },
];

export const QUANTITIES = [
  { id: 'rebar', label: 'Rebar', value: 1.84, digits: 2, unit: 't' },
  { id: 'lumber', label: 'Lumber', value: 186, digits: 0, unit: 'LM' },
  { id: 'roof', label: 'Roof', value: 142, digits: 0, unit: 'm²' },
  { id: 'windows', label: 'Windows', value: 11, digits: 0, unit: 'count' },
] as const;

export const LINE_ITEMS = [
  { trade: 'Rebar', item: 'SL82 mesh', qty: '24', unit: 'sheets' },
  { trade: 'Rebar', item: 'N12 bar', qty: '510', unit: 'm' },
  { trade: 'Rebar', item: 'N16 bar', qty: '96', unit: 'm' },
  { trade: 'Rebar', item: 'Total steel', qty: '1.84', unit: 't' },
  { trade: 'Lumber', item: '90×45 studs', qty: '112', unit: 'LM' },
  { trade: 'Lumber', item: '90×45 plates', qty: '74', unit: 'LM' },
  { trade: 'Lumber', item: 'Total lumber', qty: '186', unit: 'LM' },
  { trade: 'Roofing', item: 'Roof field', qty: '128', unit: 'm2' },
  { trade: 'Roofing', item: 'Ridges and hips', qty: '14', unit: 'm2' },
  { trade: 'Roofing', item: 'Total roof', qty: '142', unit: 'm2' },
  { trade: 'Windows', item: '2100×1200', qty: '4', unit: 'count' },
  { trade: 'Windows', item: '1800×900', qty: '5', unit: 'count' },
  { trade: 'Windows', item: '600×900', qty: '2', unit: 'count' },
  { trade: 'Windows', item: 'Total windows', qty: '11', unit: 'count' },
] as const;

export const TAKEOFF_CSV = `\uFEFFnote,Example takeoff for sample sheet A-101. Not a measured project.\ntrade,item,quantity,unit,note\n${LINE_ITEMS.map((row) => `${row.trade},${row.item},${row.qty},${row.unit},example`).join('\n')}\n`;

export const DONE_STATUS =
  'Example takeoff ready. Rebar 1.84 tonnes, lumber 186 linear metres, roof 142 square metres, 11 windows.';

export const STORY = [
  {
    kicker: '01 — Upload',
    title: 'The set lands.',
    body: 'Architectural and structural PDFs arrive together. The whole set a supplier was sent, not a photo of one detail.',
  },
  {
    kicker: '02 — Read',
    title: 'The sheet is marked.',
    body: 'Slabs, walls, windows and roof planes are outlined on the drawing, the way an estimator marks up paper.',
  },
  {
    kicker: '03 — Measure',
    title: 'Quantities, by trade.',
    body: 'Rebar comes off as tonnes. Lumber as linear metres. Roof as area. Windows as a count.',
  },
  {
    kicker: '04 — Deliver',
    title: 'Book it, then collect.',
    body: 'Put the rebar delivery on the pour. When the supplier takes payment through Leva, the fee is 0.3%.',
  },
] as const;

export const TRADES = [
  {
    id: 'rebar',
    index: '01',
    name: 'Rebar',
    state: 'Starting trade',
    body: 'Bars, mesh and chairs from the structural sheets, weighed as tonnes a yard can price.',
  },
  {
    id: 'lumber',
    index: '02',
    name: 'Lumber',
    state: 'Same plan set',
    body: 'Plates, studs and joists as linear metres, taken from the walls already marked for steel.',
  },
  {
    id: 'roofing',
    index: '03',
    name: 'Roofing',
    state: 'Same plan set',
    body: 'Planes, ridges and area in square metres, from the roof drawn over that plan.',
  },
  {
    id: 'windows',
    index: '04',
    name: 'Windows',
    state: 'Same plan set',
    body: 'Opening counts and sizes from the window marks on the architectural sheets.',
  },
] as const;

export type TradeId = (typeof TRADES)[number]['id'];

export const FAQS = [
  {
    q: 'Is there a subscription?',
    a: 'No. A takeoff is billed when you run it. There is no monthly seat fee.',
  },
  {
    q: 'What is the payments fee?',
    a: '0.3% of the amount collected through Leva. On an example $10,000 collection, that is $30.',
  },
  {
    q: 'What is an example rate?',
    a: 'A stand-in number so you can try the calculator. It is not a published Leva price.',
  },
  {
    q: 'Which trades are in the takeoff?',
    a: 'Rebar first. Lumber, roofing and windows are read from the same kind of plan set.',
  },
  {
    q: 'Can I upload a drawing here?',
    a: 'No. The sheet on this site is a sample drawn for the demo. Nothing is uploaded or stored.',
  },
] as const;
