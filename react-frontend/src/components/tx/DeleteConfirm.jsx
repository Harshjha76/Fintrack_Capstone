import React from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteTx } from '@/hooks/useFinance';
import { formatDate, formatINR } from '@/lib/finance';

export default function DeleteConfirm({ target, onClose }) {
  const del = useDeleteTx();
  const r = target?.record;

  const run = async () => {
    try {
      await del.mutateAsync({ type: target.type, id: r.id });
    } catch {
      toast.error('Delete failed. Please try again.');
      return;
    }
    toast.success('Record deleted');
    onClose();
  };

  return (
    <AlertDialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading">Delete this {target?.type}?</AlertDialogTitle>
          <AlertDialogDescription>
            {r && `${formatINR(r.amount)} · ${r.source || r.category} on ${formatDate(r.date)} will be permanently removed. This cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={run} disabled={del.isPending}>
            {del.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}