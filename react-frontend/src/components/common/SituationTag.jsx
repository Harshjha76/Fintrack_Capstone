import React from 'react';
import { SITUATION_COLORS } from '@/lib/finance';

export default function SituationTag({ tx }) {
  if (tx.type === 'income' || (!tx.situation && tx.source)) {
    return <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">Income</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: SITUATION_COLORS[tx.situation] }} />
      {tx.situation}
    </span>
  );
}