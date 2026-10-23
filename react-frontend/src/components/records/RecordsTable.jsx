import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SituationTag from '@/components/common/SituationTag';
import { TxAmount } from '@/components/dashboard/TxSummary';
import TxSummary from '@/components/dashboard/TxSummary';
import { formatDate } from '@/lib/finance';
import ReceiptThumb from '@/components/records/ReceiptThumb';

function Actions({ onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit" className="h-10 w-10 text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete" className="h-10 w-10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

export default function RecordsTable({ type, rows, onEdit, onDelete }) {
  const txs = rows.map((r) => ({ ...r, type, label: r.source || r.category }));
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">{type === 'income' ? 'Source' : 'Category'}</th>
              {type === 'expense' && <th className="px-5 py-3 font-medium">Situation</th>}
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((tx) => (
              <tr key={tx.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                <td className="whitespace-nowrap px-5 py-2 text-muted-foreground">{formatDate(tx.date)}</td>
                <td className="px-5 py-2">{tx.label}</td>
                {type === 'expense' && <td className="px-5 py-2"><div className="flex items-center gap-2"><SituationTag tx={tx} />{tx.receipt_uri && <ReceiptThumb uri={tx.receipt_uri} />}</div></td>}
                <td className="px-5 py-2 text-right"><TxAmount tx={tx} /></td>
                <td className="px-5 py-2"><Actions onEdit={() => onEdit(tx)} onDelete={() => onDelete(tx)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {txs.map((tx) => (
          <div key={tx.id} className="flex items-center gap-2 rounded-lg border border-border bg-card py-2 pl-4 pr-1">
            <TxSummary tx={tx} />
            {type === 'expense' && tx.receipt_uri && <ReceiptThumb uri={tx.receipt_uri} />}
            <Actions onEdit={() => onEdit(tx)} onDelete={() => onDelete(tx)} />
          </div>
        ))}
      </div>
    </>
  );
}