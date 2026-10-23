import React from 'react';
import { cn } from '@/lib/utils';
import { formatINR, DISCRETIONARY } from '@/lib/finance';

export default function InsightCards({ health, te, byCategory, bySituation }) {
  const discretionary = bySituation.filter((s) => DISCRETIONARY.includes(s.name)).reduce((a, s) => a + s.value, 0);
  const share = te ? (discretionary / te) * 100 : 0;
  const cards = [
    { label: 'Savings rate', value: `${health.rate.toFixed(1)}%`, note: `Balance ${formatINR(health.balance)} · ${health.label}`, cls: health.balance < 0 ? 'text-destructive' : 'text-success' },
    { label: 'Top spending category', value: byCategory[0]?.name || '—', note: byCategory[0] ? `${formatINR(byCategory[0].value)} across ${byCategory[0].count} entries` : 'No expenses' },
    { label: 'Top situation', value: bySituation[0]?.name || '—', note: bySituation[0] ? `${te ? ((bySituation[0].value / te) * 100).toFixed(1) : 0}% of all spending` : 'No expenses' },
    { label: 'Optional spending', value: `${share.toFixed(1)}%`, note: 'Casual + Entertainment + Time Pass', cls: share > 30 ? 'text-amber-400' : '' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-card p-4 md:p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
          <div className={cn('mt-2 truncate font-heading text-xl font-bold md:text-2xl', c.cls)}>{c.value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{c.note}</div>
        </div>
      ))}
    </div>
  );
}