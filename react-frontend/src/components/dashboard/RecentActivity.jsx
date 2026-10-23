import React, { useMemo } from 'react';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import SituationTag from '@/components/common/SituationTag';
import { useTxDialog } from '@/components/tx/TxDialogContext';
import { mergeTransactions, formatDate } from '@/lib/finance';
import { TxAmount } from './TxSummary';
import SwipeRow from './SwipeRow';

export default function RecentActivity({ income, expenses, loading }) {
  const { openEdit } = useTxDialog();
  const rows = useMemo(() => mergeTransactions(income, expenses).slice(0, 8), [income, expenses]);

  return (
    <Panel title="Recent Activity" subtitle="Latest 8 transactions · click a row to edit">
      {loading ? <div className="h-48 animate-pulse rounded-lg bg-accent" /> : rows.length === 0 ? (
        <EmptyState text="Your latest income and expenses will appear here." />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Source / Category</th>
                  <th className="pb-3 font-medium">Situation</th><th className="pb-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((tx) => (
                  <tr key={tx.id} onClick={() => openEdit(tx.type, tx)} className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50">
                    <td className="whitespace-nowrap py-3 text-muted-foreground">{formatDate(tx.date)}</td>
                    <td className="py-3">{tx.label}</td>
                    <td className="py-3"><SituationTag tx={tx} /></td>
                    <td className="py-3 text-right"><TxAmount tx={tx} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 md:hidden">
            {rows.slice(0, 5).map((tx) => <SwipeRow key={tx.id} tx={tx} />)}
            <p className="pt-1 text-xs text-muted-foreground">Swipe left on a row to edit or delete</p>
          </div>
        </>
      )}
    </Panel>
  );
}