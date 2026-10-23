import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Check, Loader2, Trash2, CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import Panel from '@/components/common/Panel';
import { useBudgets, useRecords, useSaveBudget, useDeleteBudget } from '@/hooks/useFinance';
import { CATEGORIES, currentMonthKey, spentByMonth, formatINR, monthLabel } from '@/lib/finance';
import { generateBudgetICS, downloadICS } from '@/lib/calendar';

export default function BudgetsManager() {
  const { data: budgets = [] } = useBudgets();
  const { data: expenses = [] } = useRecords('expense');
  const save = useSaveBudget();
  const del = useDeleteBudget();
  const [month, setMonth] = useState(currentMonthKey);
  const [limits, setLimits] = useState({});

  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === month), [budgets, month]);
  const byCat = useMemo(() => Object.fromEntries(monthBudgets.map((b) => [b.category, b])), [monthBudgets]);
  const spent = useMemo(() => spentByMonth(expenses, month), [expenses, month]);

  useEffect(() => {
    const m = {};
    CATEGORIES.forEach((c) => { m[c] = byCat[c] ? String(byCat[c].monthly_limit) : ''; });
    setLimits(m);
  }, [month, monthBudgets.length]);

  const saveOne = async (category) => {
    const raw = String(limits[category] || '').trim();
    const n = Number(raw);
    if (!raw || !Number.isFinite(n) || n <= 0) { toast.error('Enter a positive amount'); return; }
    if (n > 10000000) { toast.error('Limit is too large'); return; }
    try {
      await save.mutateAsync({ id: byCat[category]?.id, data: { category, monthly_limit: Math.round(n * 100) / 100, month } });
    } catch { toast.error('Could not save budget'); return; }
    toast.success(`Budget for ${category} saved`);
  };

  const removeOne = async (category) => {
    const existing = byCat[category];
    if (!existing) return;
    try { await del.mutateAsync(existing.id); } catch { toast.error('Could not remove budget'); return; }
    setLimits((p) => ({ ...p, [category]: '' }));
    toast.success('Budget removed');
  };

  const syncToCalendar = () => {
    if (!monthBudgets.length) { toast.error('Set at least one budget for this month first'); return; }
    downloadICS(generateBudgetICS(monthBudgets), `FinTrack-budgets-${month}.ics`);
    toast.success('Calendar file ready — import it into Google Calendar');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Spending limits"
        title="Monthly Budgets"
        subtitle="Set a limit per category for any month, then watch the dashboard track what's left"
        actions={
          <Button variant="outline" onClick={syncToCalendar} className="h-11">
            <CalendarPlus className="mr-1 h-4 w-4" /> Sync to Google Calendar
          </Button>
        }
      />
      <div className="mb-5 flex items-center gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="budget-month">Month</label>
        <Input id="budget-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-11 w-44 bg-card" />
        <span className="text-sm text-muted-foreground">{monthLabel(month)}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const used = spent[c] || 0;
          const existing = byCat[c];
          const pct = existing && existing.monthly_limit > 0 ? Math.min((used / existing.monthly_limit) * 100, 100) : 0;
          const over = existing && used > existing.monthly_limit;
          return (
            <Panel key={c} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold">{c}</h3>
                {existing && <span className="text-xs text-muted-foreground">Spent {formatINR(used)} of {formatINR(existing.monthly_limit)}</span>}
              </div>
              {existing && (
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-accent">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: over ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#10B981' }} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="Limit"
                    value={limits[c] || ''}
                    onChange={(e) => setLimits((p) => ({ ...p, [c]: e.target.value }))}
                    className="h-10 pl-7"
                  />
                </div>
                <Button size="icon" onClick={() => saveOne(c)} disabled={save.isPending} aria-label={`Save ${c} budget`} className="h-10 w-10">
                  {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
                {existing && (
                  <Button size="icon" variant="ghost" onClick={() => removeOne(c)} disabled={del.isPending} aria-label={`Remove ${c} budget`} className="h-10 w-10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}