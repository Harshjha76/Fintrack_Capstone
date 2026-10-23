import { SITUATIONS, today } from '@/lib/finance';

export function validateTx(type, v) {
  const e = {};
  const raw = String(v.amount ?? '').trim();
  const n = Number(raw);
  if (!raw) e.amount = 'Enter an amount';
  else if (!Number.isFinite(n) || n <= 0) e.amount = 'Amount must be greater than 0';
  else if (n > 10000000) e.amount = 'Amount must be under ₹1,00,00,000';
  else if (!/^\d+(\.\d{1,2})?$/.test(raw)) e.amount = 'Use at most 2 decimal places';

  if (!v.date) e.date = 'Pick a date';
  else if (v.date > today()) e.date = 'Date cannot be in the future';

  if (type === 'income' && !v.source) e.source = 'Choose an income source';
  if (type === 'expense') {
    if (!v.category) e.category = 'Choose a category';
    if (!SITUATIONS.includes(v.situation)) e.situation = 'Choose a situation';
  }
  return e;
}