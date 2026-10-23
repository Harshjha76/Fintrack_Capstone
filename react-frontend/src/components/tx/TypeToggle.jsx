import React from 'react';
import { cn } from '@/lib/utils';

export default function TypeToggle({ value, onChange, disabled }) {
  const opts = [
    { v: 'expense', label: 'Expense', active: 'bg-destructive/15 text-destructive border-destructive/40' },
    { v: 'income', label: 'Income', active: 'bg-success/15 text-success border-success/40' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.v)}
          className={cn(
            'h-11 rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
            value === o.v ? o.active : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}