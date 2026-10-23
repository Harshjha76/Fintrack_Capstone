import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import { useBudgets } from '@/hooks/useFinance';
import { currentMonthKey, spentByMonth, formatINR, monthLabel, budgetColor } from '@/lib/finance';

export default function BudgetProgress({ expenses }) {
  const { data: budgets = [] } = useBudgets();
  const month = currentMonthKey();
  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === month), [budgets, month]);
  const spent = useMemo(() => spentByMonth(expenses, month), [expenses, month]);

  if (monthBudgets.length === 0) {
    return (
      <Panel title="Monthly Budgets" subtitle={monthLabel(month)}>
        <EmptyState
          icon
          title="No budgets set for this month"
          text="Set a monthly limit for each category and track what's left to spend."
          action={<Button asChild className="mt-2"><Link to="/budgets"><Target className="mr-1 h-4 w-4" />Set budgets</Link></Button>}
        />
      </Panel>
    );
  }

  const rows = [...monthBudgets].sort((a, b) => {
    const pa = (spent[a.category] || 0) / a.monthly_limit;
    const pb = (spent[b.category] || 0) / b.monthly_limit;
    return pb - pa;
  });

  return (
    <Panel
      title="Monthly Budgets"
      subtitle={`${monthLabel(month)} · ${monthBudgets.length} categories`}
      action={<Button variant="outline" asChild className="h-9"><Link to="/budgets">Manage</Link></Button>}
    >
      <div className="space-y-4">
        {rows.map((b) => {
          const used = spent[b.category] || 0;
          const pct = b.monthly_limit > 0 ? Math.min((used / b.monthly_limit) * 100, 100) : 0;
          const over = used > b.monthly_limit;
          const left = b.monthly_limit - used;
          return (
            <div key={b.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{b.category}</span>
                <span className={over ? 'text-destructive' : 'text-muted-foreground'}>
                  {over ? `${formatINR(Math.abs(left))} over` : `${formatINR(left)} left`}
                </span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-accent">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: budgetColor((used / b.monthly_limit) * 100, over) }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {formatINR(used)} of {formatINR(b.monthly_limit)} spent · {pct.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}