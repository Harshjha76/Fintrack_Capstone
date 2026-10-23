import React from 'react';
import { cn } from '@/lib/utils';
import { SITUATIONS, SITUATION_COLORS } from '@/lib/finance';

export default function SituationPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SITUATIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors',
            value === s ? 'border-primary bg-primary/15 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: SITUATION_COLORS[s] }} />
          {s}
        </button>
      ))}
    </div>
  );
}