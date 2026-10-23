import { format, parseISO } from 'date-fns';

export const SITUATIONS = ['Necessary', 'Casual', 'Emergency', 'Entertainment', 'Time Pass', 'Other'];
export const DISCRETIONARY = ['Casual', 'Entertainment', 'Time Pass'];
export const SITUATION_COLORS = {
  Necessary: '#6366F1', Casual: '#A78BFA', Emergency: '#EF4444',
  Entertainment: '#F59E0B', 'Time Pass': '#EC4899', Other: '#64748B',
};
export const CATEGORIES = ['Food & Dining', 'Rent & Hostel', 'Transport', 'Books & Supplies', 'Tuition & Fees', 'Mobile & Internet', 'Entertainment', 'Shopping', 'Health', 'Other'];
export const INCOME_SOURCES = ['Pocket Money', 'Scholarship', 'Part-time Job', 'Internship Stipend', 'Freelance', 'Gift', 'Other'];
export const CHART_PALETTE = ['#6366F1', '#10B981', '#F59E0B', '#38BDF8', '#A78BFA', '#EC4899', '#EF4444', '#14B8A6', '#F97316', '#64748B'];
export const SORTS = { newest: 'Newest first', oldest: 'Oldest first', amount_desc: 'Amount: high to low', amount_asc: 'Amount: low to high' };

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
export const formatINR = (n) => inr.format(Number(n) || 0);
export const formatCompact = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (Math.abs(v) >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
  return `₹${Math.round(v)}`;
};
export const formatDate = (d) => (d ? format(parseISO(d), 'dd MMM yyyy') : '');
export const monthLabel = (key) => {
  if (!key) return '';
  try { return format(parseISO(`${key}-01`), 'MMMM yyyy'); } catch { return key; }
};
export const today = () => format(new Date(), 'yyyy-MM-dd');

// Traversal: visit every record once and accumulate the amount — O(n)
export function sumAmounts(list) {
  let total = 0;
  for (const r of list) total += Number(r.amount) || 0;
  return Math.round(total * 100) / 100;
}

// Grouping (equivalent of SQL: SELECT key, SUM(amount), COUNT(*) GROUP BY key ORDER BY SUM DESC)
export function groupSum(list, key) {
  const groups = {};
  for (const r of list) {
    const k = r[key] || 'Other';
    if (!groups[k]) groups[k] = { name: k, value: 0, count: 0 };
    groups[k].value += Number(r.amount) || 0;
    groups[k].count += 1;
  }
  return Object.values(groups).sort((a, b) => b.value - a.value);
}

// Monthly aggregation: group both lists by YYYY-MM and merge into one ordered series
export function monthlySeries(income, expenses, limit = 6) {
  const months = {};
  const add = (list, field) => {
    for (const r of list) {
      if (!r.date) continue;
      const k = r.date.slice(0, 7);
      months[k] ??= { month: k, income: 0, expense: 0 };
      months[k][field] += Number(r.amount) || 0;
    }
  };
  add(income, 'income');
  add(expenses, 'expense');
  return Object.keys(months).sort().slice(-limit).map((k) => ({
    ...months[k],
    label: format(parseISO(`${k}-01`), 'MMM yy'),
    balance: Math.round((months[k].income - months[k].expense) * 100) / 100,
  }));
}

export function listMonths(list) {
  return [...new Set(list.map((r) => r.date?.slice(0, 7)).filter(Boolean))].sort().reverse();
}

export function mergeTransactions(income, expenses) {
  const all = [
    ...income.map((r) => ({ ...r, type: 'income', label: r.source })),
    ...expenses.map((r) => ({ ...r, type: 'expense', label: r.category })),
  ];
  return all.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.created_date || '').localeCompare(a.created_date || ''));
}

// Linear search + filtering: one pass over the list, keep records that satisfy every condition
export function filterRecords(list, { query = '', filters = {}, month = '' }) {
  const q = query.trim().toLowerCase();
  const out = [];
  for (const r of list) {
    if (month && r.date?.slice(0, 7) !== month) continue;
    let ok = true;
    for (const [k, v] of Object.entries(filters)) {
      if (v && v !== 'all' && r[k] !== v) { ok = false; break; }
    }
    if (!ok) continue;
    if (q && ![r.source, r.category, r.situation, String(r.amount), r.date].some((v) => v && String(v).toLowerCase().includes(q))) continue;
    out.push(r);
  }
  return out;
}

export function sortRecords(list, key) {
  const cmp = {
    newest: (a, b) => b.date.localeCompare(a.date),
    oldest: (a, b) => a.date.localeCompare(b.date),
    amount_desc: (a, b) => b.amount - a.amount,
    amount_asc: (a, b) => a.amount - b.amount,
  };
  return [...list].sort(cmp[key] || cmp.newest);
}

// Financial health: Stable ≥ 20% saved, Watch 0–20%, Warning when expenses exceed income
export function healthStatus(income, expense) {
  const balance = Math.round((income - expense) * 100) / 100;
  const rate = income > 0 ? (balance / income) * 100 : 0;
  if (balance < 0) return { label: 'Warning', tone: 'negative', rate, balance };
  if (rate >= 20) return { label: 'Stable', tone: 'positive', rate, balance };
  return { label: 'Watch', tone: 'caution', rate, balance };
}

export const currentMonthKey = () => format(new Date(), 'yyyy-MM');

// Sum expenses per category for a given YYYY-MM month (traversal + dictionary accumulation)
export function spentByMonth(expenses, month) {
  const map = {};
  for (const r of expenses) {
    if (r.date && r.date.slice(0, 7) === month) {
      const c = r.category || 'Other';
      map[c] = (map[c] || 0) + (Number(r.amount) || 0);
    }
  }
  return map;
}

export function budgetColor(pct, over) {
  if (over) return '#EF4444';
  if (pct >= 80) return '#F59E0B';
  return '#10B981';
}