import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { formatCompact } from '@/lib/finance';

export default function TrendLineChart({ data, className }) {
  return (
    <Panel title="Spending Trend" subtitle="Monthly expense flow over time" className={className}>
      {data.length === 0 ? <EmptyState /> : (
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="trendExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#262930" vertical={false} />
              <XAxis dataKey="label" stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompact} width={56} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="expense"
                name="Spending"
                stroke="#EF4444"
                strokeWidth={2.5}
                fill="url(#trendExpense)"
                dot={{ r: 3, fill: '#EF4444', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}