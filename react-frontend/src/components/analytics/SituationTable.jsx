import React from 'react';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import { formatINR, SITUATION_COLORS } from '@/lib/finance';

export default function SituationTable({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Panel title="Situation-wise Analysis" subtitle="Why you spent: count, total, average and share">
      {data.length === 0 ? <EmptyState /> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Situation</th><th className="pb-3 text-right font-medium">Count</th>
                <th className="pb-3 text-right font-medium">Total</th><th className="pb-3 text-right font-medium">Average</th>
                <th className="w-28 pb-3 pl-4 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const pct = total ? (d.value / total) * 100 : 0;
                return (
                  <tr key={d.name} className="border-b border-border/60 last:border-0">
                    <td className="py-3"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: SITUATION_COLORS[d.name] }} />{d.name}</span></td>
                    <td className="py-3 text-right tabular-nums">{d.count}</td>
                    <td className="py-3 text-right tabular-nums">{formatINR(d.value)}</td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">{formatINR(d.value / d.count)}</td>
                    <td className="py-3 pl-4">
                      <div className="h-1.5 rounded-full bg-accent"><div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: SITUATION_COLORS[d.name] }} /></div>
                      <div className="mt-1 text-xs text-muted-foreground">{pct.toFixed(1)}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}