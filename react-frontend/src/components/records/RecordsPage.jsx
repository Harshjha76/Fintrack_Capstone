import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { useTxDialog } from '@/components/tx/TxDialogContext';
import { useRecords } from '@/hooks/useFinance';
import { filterRecords, sortRecords, sumAmounts, listMonths } from '@/lib/finance';
import RecordsFilters from './RecordsFilters';
import RecordsTable from './RecordsTable';
import SummaryStrip from './SummaryStrip';

const INITIAL = { query: '', source: 'all', category: 'all', situation: 'all', month: 'all', sort: 'newest' };

export default function RecordsPage({ type }) {
  const isIncome = type === 'income';
  const { data: records = [], isLoading } = useRecords(type);
  const { openNew, openEdit, confirmDelete } = useTxDialog();
  const [state, setState] = useState(INITIAL);

  const months = useMemo(() => listMonths(records), [records]);
  const visible = useMemo(() => {
    const filters = isIncome ? { source: state.source } : { category: state.category, situation: state.situation };
    const found = filterRecords(records, { query: state.query, filters, month: state.month === 'all' ? '' : state.month });
    return sortRecords(found, state.sort);
  }, [records, state, isIncome]);
  const active = JSON.stringify({ ...state, sort: 'newest' }) !== JSON.stringify(INITIAL);
  const noun = isIncome ? 'income' : 'expense';

  return (
    <div>
      <PageHeader
        eyebrow={isIncome ? 'Money in' : 'Money out'}
        title={isIncome ? 'Income' : 'Expenses'}
        subtitle={isIncome ? 'Pocket money, scholarships, stipends and more' : 'Every expense, classified by category and situation'}
        actions={<Button onClick={() => openNew(type)} className="h-11"><Plus className="mr-1 h-4 w-4" />Add {noun}</Button>}
      />
      <SummaryStrip total={sumAmounts(visible)} count={visible.length} tone={type} />
      <RecordsFilters type={type} state={state} setState={setState} months={months} active={active} onClear={() => setState(INITIAL)} />
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-card" />
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-border bg-card">
          {records.length === 0 ? (
            <EmptyState title={`No ${noun} yet`} text={`Record your first ${noun} to get started.`} action={<Button onClick={() => openNew(type)} className="mt-2">Add {noun}</Button>} />
          ) : (
            <EmptyState title="No matching records" text="Try a different search or clear the filters." action={<Button variant="outline" onClick={() => setState(INITIAL)} className="mt-2">Clear filters</Button>} />
          )}
        </div>
      ) : (
        <RecordsTable type={type} rows={visible} onEdit={(r) => openEdit(type, r)} onDelete={(r) => confirmDelete(type, r)} />
      )}
    </div>
  );
}