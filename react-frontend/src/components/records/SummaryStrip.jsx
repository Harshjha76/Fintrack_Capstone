import React from 'react';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/finance';

export default function SummaryStrip({ total, count, tone }) {
  const stats = [
    { label: 'Filtered total', value: formatINR(total), cls: tone === 'income' ? 'text-success' : 'text-destructive' },
    { label: 'Records', value: count },
    { label: 'Average per entry', value: formatINR(count ? total / count : 0) },
  ];
  return (
    <div className="mb-5 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-card">
      {stats.map((s) => (
        <div key={s.label} className="p-3 md:p-4">
          <div className="text-xs text-muted-foreground">{s.label}</div>
          <div className={cn('mt-1 truncate font-heading text-base font-bold tabular-nums md:text-xl', s.cls)}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}