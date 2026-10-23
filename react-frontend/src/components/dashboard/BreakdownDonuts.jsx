import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import DonutChart from '@/components/charts/DonutChart';
import { groupSum, SITUATION_COLORS, CHART_PALETTE } from '@/lib/finance';

const trigger = 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground';

export default function BreakdownDonuts({ expenses, className }) {
  const bySituation = useMemo(() => groupSum(expenses, 'situation'), [expenses]);
  const byCategory = useMemo(() => groupSum(expenses, 'category'), [expenses]);
  return (
    <Panel title="Expense Breakdown" subtitle="Where the money goes" className={className}>
      {expenses.length === 0 ? <EmptyState text="No expenses recorded yet." /> : (
        <Tabs defaultValue="situation">
          <TabsList className="mb-5 border border-border bg-background">
            <TabsTrigger value="situation" className={trigger}>Situation</TabsTrigger>
            <TabsTrigger value="category" className={trigger}>Category</TabsTrigger>
          </TabsList>
          <TabsContent value="situation">
            <DonutChart data={bySituation} colorFor={(n) => SITUATION_COLORS[n]} />
          </TabsContent>
          <TabsContent value="category">
            <DonutChart data={byCategory} colorFor={(_, i) => CHART_PALETTE[i % CHART_PALETTE.length]} />
          </TabsContent>
        </Tabs>
      )}
    </Panel>
  );
}