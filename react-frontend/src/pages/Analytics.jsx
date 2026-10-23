import React, { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import DonutChart from '@/components/charts/DonutChart';
import InsightCards from '@/components/analytics/InsightCards';
import MonthlyBarChart from '@/components/analytics/MonthlyBarChart';
import TrendLineChart from '@/components/analytics/TrendLineChart';
import CategoryBarChart from '@/components/analytics/CategoryBarChart';
import SituationTable from '@/components/analytics/SituationTable';
import CalculationNotes from '@/components/analytics/CalculationNotes';
import AccuracyNote from '@/components/analytics/AccuracyNote';
import { useFinanceData } from '@/hooks/useFinance';
import { groupSum, healthStatus, listMonths, monthLabel, monthlySeries, sumAmounts, SITUATION_COLORS } from '@/lib/finance';

export default function Analytics() {
  const { income, expenses, isLoading } = useFinanceData();
  const [month, setMonth] = useState('all');
  const months = useMemo(() => listMonths([...income, ...expenses]), [income, expenses]);

  const a = useMemo(() => {
    const inScope = (r) => month === 'all' || r.date?.startsWith(month);
    const inc = income.filter(inScope);
    const exp = expenses.filter(inScope);
    const ti = sumAmounts(inc);
    const te = sumAmounts(exp);
    return { te, health: healthStatus(ti, te), byCategory: groupSum(exp, 'category'), bySituation: groupSum(exp, 'situation') };
  }, [income, expenses, month]);
  const monthly = useMemo(() => monthlySeries(income, expenses, 12), [income, expenses]);

  return (
    <div>
      <PageHeader
        eyebrow="Financial analysis"
        title="Analytics"
        subtitle="Category, situation and monthly analysis in one place"
        actions={
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="h-11 w-48 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              {months.map((m) => <SelectItem key={m} value={m}>{monthLabel(m)}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />
      {isLoading ? <div className="h-96 animate-pulse rounded-lg bg-card" /> : (
        <div className="flex flex-col gap-5">
          <InsightCards health={a.health} te={a.te} byCategory={a.byCategory} bySituation={a.bySituation} />
          <div className="grid gap-5 lg:grid-cols-12">
            <MonthlyBarChart data={monthly} className="lg:col-span-7" />
            <Panel title="Situation Split" subtitle={month === 'all' ? 'All time' : monthLabel(month)} className="lg:col-span-5">
              {a.bySituation.length ? <DonutChart data={a.bySituation} colorFor={(n) => SITUATION_COLORS[n]} /> : <EmptyState />}
            </Panel>
          </div>
          <TrendLineChart data={monthly} />
          <div className="grid gap-5 lg:grid-cols-2">
            <CategoryBarChart data={a.byCategory} />
            <SituationTable data={a.bySituation} />
          </div>
          <CalculationNotes />
          <AccuracyNote />
        </div>
      )}
    </div>
  );
}