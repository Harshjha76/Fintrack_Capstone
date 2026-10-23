import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Panel from '@/components/common/Panel';
import EmptyState from '@/components/common/EmptyState';
import { useGoals, useSaveGoal, useDeleteGoal } from '@/hooks/useFinance';
import GoalCard from './GoalCard';

export default function GoalsManager() {
  const { data: goals = [], isLoading } = useGoals();
  const save = useSaveGoal();
  const del = useDeleteGoal();
  const [draft, setDraft] = useState({ name: '', target_amount: '', deadline: '' });

  const add = async (e) => {
    e.preventDefault();
    const target = Math.round(Number(draft.target_amount) * 100) / 100;
    if (!draft.name.trim() || !(target > 0)) return;
    await save.mutateAsync({ data: { name: draft.name.trim(), target_amount: target, saved_amount: 0, deadline: draft.deadline || undefined } });
    setDraft({ name: '', target_amount: '', deadline: '' });
  };

  const contribute = async (goal, amount) => {
    const next = Math.max(0, Math.round((Number(goal.saved_amount) + Number(amount)) * 100) / 100);
    await save.mutateAsync({ id: goal.id, data: { saved_amount: next } });
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel title="New savings goal" subtitle="Set a target and an optional deadline">
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-4">
          <Input placeholder="Goal name" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} className="h-11 sm:col-span-2" />
          <Input type="number" inputMode="decimal" min="1" step="0.01" placeholder="Target ₹" value={draft.target_amount} onChange={(e) => setDraft((p) => ({ ...p, target_amount: e.target.value }))} className="h-11" />
          <Input type="date" value={draft.deadline} onChange={(e) => setDraft((p) => ({ ...p, deadline: e.target.value }))} className="h-11" />
          <Button type="submit" disabled={save.isPending} className="h-11 sm:col-span-4">
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add goal
          </Button>
        </form>
      </Panel>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-lg bg-card" />
      ) : goals.length === 0 ? (
        <div className="rounded-lg border border-border bg-card">
          <EmptyState title="No goals yet" text="Set your first savings goal to start tracking progress." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onContribute={(amt) => contribute(g, amt)} onDelete={() => del.mutate(g.id)} saving={save.isPending} />
          ))}
        </div>
      )}
    </div>
  );
}