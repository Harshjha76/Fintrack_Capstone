import React from 'react';
import Panel from '@/components/common/Panel';

const ROWS = [
  { metric: 'Total income / expenses', how: 'Traverse every record and add up amount', sql: 'SELECT SUM(amount) FROM income;' },
  { metric: 'Net balance', how: 'Total income − total expenses', sql: '(SELECT SUM(amount) FROM income) - (SELECT SUM(amount) FROM expenses)' },
  { metric: 'Category-wise', how: 'Group expenses by category, sum, sort descending', sql: 'SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC;' },
  { metric: 'Situation-wise', how: 'Group expenses by situation with count and average', sql: 'SELECT situation, COUNT(*), SUM(amount), AVG(amount) FROM expenses GROUP BY situation;' },
  { metric: 'Monthly', how: 'Group by year + month, merge income and expense series', sql: 'SELECT YEAR(date), MONTH(date), SUM(amount) FROM expenses GROUP BY YEAR(date), MONTH(date);' },
  { metric: 'Health status', how: 'Stable ≥ 20% saved · Watch 0–20% · Warning if balance < 0', sql: 'savings_rate = balance / total_income × 100' },
];

export default function CalculationNotes() {
  return (
    <Panel title="How these numbers are calculated" subtitle="Transparent, database-driven formulas with the equivalent SQL">
      <div className="divide-y divide-border">
        {ROWS.map((r) => (
          <div key={r.metric} className="grid gap-2 py-3 md:grid-cols-12 md:gap-4">
            <div className="text-sm font-medium md:col-span-3">{r.metric}</div>
            <div className="text-sm text-muted-foreground md:col-span-4">{r.how}</div>
            <code className="overflow-x-auto whitespace-nowrap rounded-md bg-background px-3 py-2 font-mono text-xs text-primary md:col-span-5">{r.sql}</code>
          </div>
        ))}
      </div>
    </Panel>
  );
}