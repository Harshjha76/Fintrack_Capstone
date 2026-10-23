import React from 'react';
import { formatINR } from '@/lib/finance';

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl">
      {label && <div className="mb-1 text-muted-foreground">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          <span>{p.name}</span>
          <span className="ml-auto pl-4 font-medium tabular-nums">{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
}