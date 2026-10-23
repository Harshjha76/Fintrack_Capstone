import React, { useState } from 'react';
import { RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DataActions() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await qc.invalidateQueries({ queryKey: ['income'] });
      await qc.invalidateQueries({ queryKey: ['expense'] });
      await qc.invalidateQueries({ queryKey: ['totals'] });
      await qc.invalidateQueries({ queryKey: ['budget'] });
      await qc.invalidateQueries({ queryKey: ['goal'] });
      await qc.invalidateQueries({ queryKey: ['notification'] });
      toast.success('Data refreshed');
    } finally {
      setRefreshing(false);
    }
  };

  const clearAll = async () => {
    setClearing(true);
    try {
      await Promise.all([
        base44.entities.Income.deleteMany({ created_by_id: user.id }),
        base44.entities.Expense.deleteMany({ created_by_id: user.id }),
      ]);
      await qc.invalidateQueries({ queryKey: ['income'] });
      await qc.invalidateQueries({ queryKey: ['expense'] });
      await qc.invalidateQueries({ queryKey: ['totals'] });
      toast.success('All income and expenses cleared');
    } catch {
      toast.error('Could not clear data. Try again.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing} className="h-9">
        {refreshing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
        Refresh
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={clearing} className="h-9 text-destructive hover:text-destructive">
            {clearing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1.5 h-4 w-4" />}
            Clear all
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all income and expenses?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes every income and expense record you have added. Budgets, goals and notifications are kept. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}