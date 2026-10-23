import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import ChartTooltip from '@/components/charts/ChartTooltip';
import { formatCompact, CHART_PALETTE } from '@/lib/finance';

export default function CategoryBarChart({ data }) {
  return (
    <Panel title="Category-wise Spending" subtitle="Sorted by total amount">
      {data.length === 0 ? <EmptyState /> : (
        <div style={{ height: Math.max(200, data.length * 40) }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis type="number" stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompact} />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} fontSize={12} width={112} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#262930', opacity: 0.4 }} />
              <Bar dataKey="value" name="Spent" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {data.map((d, i) => <Cell key={d.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}