import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { monthlySeries, formatCompact } from '@/lib/finance';

export default function CashflowChart({ income, expenses, className }) {
  const data = useMemo(() => monthlySeries(income, expenses, 6), [income, expenses]);
  const legend = (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Income</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Expenses</span>
    </div>
  );
  return (
    <Panel title="Monthly Cashflow" subtitle="Income vs expenses · last 6 months" action={legend} className={className}>
      {data.length === 0 ? <EmptyState text="Add income or expenses to see your monthly cashflow." /> : (
        <div className="h-64 md:h-72">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#262930" vertical={false} />
              <XAxis dataKey="label" stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompact} width={56} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: '#10B981' }} />
              <Line type="monotone" dataKey="expense" name="Expenses" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3, fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}