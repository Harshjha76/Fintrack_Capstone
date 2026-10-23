import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/finance';

const PILL = {
  positive: 'bg-success/15 text-success ring-1 ring-inset ring-success/25',
  caution: 'bg-amber-400/15 text-amber-400 ring-1 ring-inset ring-amber-400/25',
  negative: 'bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/25',
};

const ICON_CHIP = {
  positive: 'bg-success/12 text-success',
  negative: 'bg-destructive/12 text-destructive',
  primary: 'bg-primary/12 text-primary',
};

function Metric({ label, value, icon: Icon, tone, caption, accent = 'positive' }) {
  return (
    <div className="group relative min-w-[72%] shrink-0 overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-border/60 md:min-w-0">
      <span className={cn('pointer-events-none absolute inset-x-0 top-0 h-px opacity-60', accent === 'positive' ? 'bg-gradient-to-r from-transparent via-success/40 to-transparent' : 'bg-gradient-to-r from-transparent via-destructive/40 to-transparent')} />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', ICON_CHIP[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className={cn('mt-4 font-heading text-2xl font-bold tabular-nums tracking-tight', tone === 'positive' ? 'text-success' : 'text-destructive')}>{value}</div>
      <span className="mt-3 inline-flex rounded-full border border-border/70 bg-background/40 px-2.5 py-0.5 text-xs text-muted-foreground">{caption}</span>
    </div>
  );
}

export default function MetricCards({ totals, loading }) {
  const { ti, te, incomeCount, expenseCount, health } = totals;
  const show = (v) => (loading ? '—' : formatINR(v));
  return (
    <div className="order-1 grid gap-4 md:grid-cols-3">
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:contents">
        <Metric label="Total Income" value={show(ti)} icon={TrendingUp} tone="positive" accent="positive" caption={`${incomeCount} entries`} />
        <Metric label="Total Expenses" value={show(te)} icon={TrendingDown} tone="negative" accent="negative" caption={`${expenseCount} entries`} />
      </div>
      <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-card p-5 md:order-none">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Net Balance</span>
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', ICON_CHIP.primary)}>
            <Wallet className="h-4 w-4" />
          </span>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <span className={cn('font-heading text-[28px] font-bold tabular-nums tracking-tight md:text-4xl', health.balance < 0 && 'text-destructive')}>{show(health.balance)}</span>
          {!loading && <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', PILL[health.tone])}>{health.label}</span>}
        </div>
        <p className="relative mt-3 text-xs text-muted-foreground">
          {incomeCount + expenseCount} transactions · savings rate {health.rate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}