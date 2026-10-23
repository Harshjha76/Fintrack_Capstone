import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Panel from '@/components/common/Panel';
import { formatINR, formatDate } from '@/lib/finance';

export default function GoalCard({ goal, onContribute, onDelete, saving }) {
  const pct = goal.target_amount > 0 ? Math.min(100, (goal.saved_amount / goal.target_amount) * 100) : 0;
  const done = pct >= 100;
  const [amt, setAmt] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = Number(amt);
    if (!(n > 0)) return;
    onContribute(n);
    setAmt('');
  };

  return (
    <Panel>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-heading text-base font-semibold">{goal.name}</div>
          {goal.deadline && <div className="text-xs text-muted-foreground">By {formatDate(goal.deadline)}</div>}
        </div>
        <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete goal" className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-muted-foreground">{formatINR(goal.saved_amount)} saved</span>
          <span className="font-medium">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${done ? 'bg-success' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Target {formatINR(goal.target_amount)}</div>
      </div>
      {done ? (
        <div className="mt-3 rounded-md bg-success/15 px-3 py-2 text-sm text-success">Goal reached 🎉</div>
      ) : (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <Input type="number" inputMode="decimal" min="1" step="0.01" placeholder="Add ₹" value={amt} onChange={(e) => setAmt(e.target.value)} className="h-10" />
          <Button type="submit" disabled={saving} className="h-10">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}</Button>
        </form>
      )}
    </Panel>
  );
}