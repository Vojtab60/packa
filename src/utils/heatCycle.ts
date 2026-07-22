const DAY = 24 * 60 * 60 * 1000;

export type HeatForm = {
  startDate: string;
  heatLength: number;
  cycleLength: number;
  notes: string;
  symptoms: string;
};

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(date);
}

export function diffDays(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / DAY) + 1;
}

export function heatCalculations(form: HeatForm, today = new Date('2026-07-20T12:00:00')) {
  const start = new Date(`${form.startDate}T12:00:00`);
  const end = addDays(start, form.heatLength - 1);
  const fertileStart = addDays(start, 8);
  const fertileEnd = addDays(start, 14);
  const riskStart = addDays(start, 6);
  const riskEnd = addDays(start, 17);
  const nextStart = addDays(start, form.cycleLength);
  const reminder7 = addDays(nextStart, -7);
  const reminder1 = addDays(nextStart, -1);
  return {
    start,
    end,
    fertileStart,
    fertileEnd,
    riskStart,
    riskEnd,
    nextStart,
    reminder7,
    reminder1,
    currentDay: diffDays(start, today)
  };
}

export function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1, 12);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -startOffset);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}
