import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { formatCompact } from '@/lib/finance';

export default function MonthlyBarChart({ data, className }) {
  return (
    <Panel title="Monthly Analysis" subtitle="Income, expenses and net balance per month" className={className}>
      {data.length === 0 ? <EmptyState /> : (
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#262930" vertical={false} />
              <XAxis dataKey="label" stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompact} width={56} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#262930', opacity: 0.4 }} />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line type="monotone" dataKey="balance" name="Net balance" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366F1' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}