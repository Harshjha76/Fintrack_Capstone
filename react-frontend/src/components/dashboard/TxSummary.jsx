import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatINR, formatDate } from '@/lib/finance';

export function TxIcon({ type }) {
  const Icon = type === 'income' ? ArrowDownLeft : ArrowUpRight;
  return (
    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', type === 'income' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive')}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function TxAmount({ tx, className }) {
  return (
    <span className={cn('font-semibold tabular-nums', tx.type === 'income' ? 'text-success' : 'text-destructive', className)}>
      {tx.type === 'income' ? '+' : '−'}{formatINR(tx.amount)}
    </span>
  );
}

export default function TxSummary({ tx }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <TxIcon type={tx.type} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{tx.label}</div>
        <div className="text-xs text-muted-foreground">{formatDate(tx.date)}{tx.situation ? ` · ${tx.situation}` : ''}</div>
      </div>
      <TxAmount tx={tx} className="text-sm" />
    </div>
  );
}