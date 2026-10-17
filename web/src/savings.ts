export type SavingsInput = {
  takeoffs: number;
  manualHours: number;
  reviewHours: number;
  hourlyRate: number;
  pricePerTakeoff: number;
  avgInvoice: number;
  currentFeePercent: number;
};

export type SavingsResult = {
  hoursReturned: number;
  labourAvoided: number;
  takeoffFees: number;
  volume: number;
  feeDelta: number;
  net: number;
};

export const REVIEW_HOURS = 0.4;
export const PAYMENTS_FEE = 0.003;

export function computeSavings(input: SavingsInput): SavingsResult {
  const hoursReturned = Math.max(0, input.takeoffs * (input.manualHours - input.reviewHours));
  const labourAvoided = hoursReturned * input.hourlyRate;
  const takeoffFees = input.takeoffs * input.pricePerTakeoff;
  const volume = input.takeoffs * input.avgInvoice;
  const feeDelta = volume * (input.currentFeePercent / 100 - PAYMENTS_FEE);
  const net = labourAvoided + feeDelta - takeoffFees;
  return { hoursReturned, labourAvoided, takeoffFees, volume, feeDelta, net };
}

export function money(value: number): string {
  const sign = value < 0 ? '−' : '';
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString('en-AU')}`;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
