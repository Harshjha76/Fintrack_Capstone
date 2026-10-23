import React from 'react';
import { Link } from 'react-router-dom';
import Panel from '@/components/common/Panel';
import { useGoals } from '@/hooks/useFinance';
import { formatINR } from '@/lib/finance';

export default function GoalsSummary() {
  const { data: goals = [] } = useGoals();
  const totalSaved = goals.reduce((s, g) => s + (Number(g.saved_amount) || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (Number(g.target_amount) || 0), 0);
  const pct = totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0;

  return (
    <Panel
      title="Savings goals"
      subtitle={goals.length ? `${formatINR(totalSaved)} of ${formatINR(totalTarget)}` : 'Track what you are saving toward'}
      action={<Link to="/goals" className="text-sm text-primary hover:underline">Manage</Link>}
    >
      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals yet. Set one to start saving toward it.</p>
      ) : (
        <div className="space-y-3">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <ul className="space-y-2">
            {goals.slice(0, 3).map((g) => {
              const p = g.target_amount > 0 ? Math.min(100, (g.saved_amount / g.target_amount) * 100) : 0;
              return (
                <li key={g.id} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{g.name}</span>
                  <span className="shrink-0 text-muted-foreground">{formatINR(g.saved_amount)} / {formatINR(g.target_amount)} · {p.toFixed(0)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}