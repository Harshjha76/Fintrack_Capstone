import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveTx } from '@/hooks/useFinance';
import { generateTxNotifications } from '@/lib/notifications';
import { CATEGORIES, INCOME_SOURCES, today } from '@/lib/finance';
import { validateTx } from '@/lib/validation';
import TypeToggle from './TypeToggle';
import SituationPicker from './SituationPicker';
import ReceiptInput from './ReceiptInput';
import FormField from './FormField';

const empty = () => ({ amount: '', date: today(), source: '', category: '', situation: 'Necessary', receipt_uri: '' });
const fromRecord = (r) => ({ amount: String(r.amount), date: r.date, source: r.source || '', category: r.category || '', situation: r.situation || 'Necessary', receipt_uri: r.receipt_uri || '' });

export default function TransactionForm({ initialType = 'expense', record = null, onDone }) {
  const [type, setType] = useState(initialType);
  const [values, setValues] = useState(record ? fromRecord(record) : empty());
  const [errors, setErrors] = useState({});
  const save = useSaveTx();
  const set = (k) => (v) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateTx(type, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const amount = Math.round(Number(values.amount) * 100) / 100;
    const data = type === 'income'
      ? { amount, source: values.source, date: values.date }
      : { amount, category: values.category, situation: values.situation, date: values.date, receipt_uri: values.receipt_uri || '' };
    let created;
    try {
      created = await save.mutateAsync({ type, id: record?.id, data });
    } catch {
      toast.error('Could not save. Please try again.');
      return;
    }
    toast.success(record ? 'Changes saved' : `${type === 'income' ? 'Income' : 'Expense'} of ₹${amount} recorded`);
    if (!record) {
      setValues(empty()); setErrors({});
      generateTxNotifications(created || { ...data, source: values.source, category: values.category, situation: values.situation }, type);
    }
    onDone?.();
  };

  const options = type === 'income' ? INCOME_SOURCES : CATEGORIES;
  const field = type === 'income' ? 'source' : 'category';

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <TypeToggle value={type} onChange={(t) => { setType(t); setErrors({}); }} disabled={!!record} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Amount (₹)" error={errors.amount}>
          <Input type="number" inputMode="decimal" step="0.01" min="0" placeholder="0.00" value={values.amount} onChange={(e) => set('amount')(e.target.value)} className="h-11 text-base md:text-sm" />
        </FormField>
        <FormField label="Date" error={errors.date}>
          <Input type="date" max={today()} value={values.date} onChange={(e) => set('date')(e.target.value)} className="h-11 text-base md:text-sm" />
        </FormField>
      </div>
      <FormField label={type === 'income' ? 'Source' : 'Category'} error={errors[field]}>
        <Select value={values[field]} onValueChange={set(field)}>
          <SelectTrigger className="h-11"><SelectValue placeholder={`Select ${field}`} /></SelectTrigger>
          <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      </FormField>
      {type === 'expense' && (
        <FormField label="Situation" error={errors.situation}>
          <SituationPicker value={values.situation} onChange={set('situation')} />
        </FormField>
      )}
      {type === 'expense' && (
        <div className="space-y-1.5">
          <div className="text-sm font-medium">Receipt (optional)</div>
          <ReceiptInput value={values.receipt_uri} onChange={set('receipt_uri')} />
        </div>
      )}
      <Button type="submit" disabled={save.isPending} className="h-11 w-full">
        {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {record ? 'Save changes' : `Add ${type}`}
      </Button>
    </form>
  );
}