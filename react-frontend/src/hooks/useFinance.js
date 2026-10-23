import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const ENTITY = { income: 'Income', expense: 'Expense' };

export function useRecords(type) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [type, user?.id],
    enabled: !!user,
    queryFn: () => base44.entities[ENTITY[type]].filter({ created_by_id: user.id }, '-date', 1000),
  });
}

export function useFinanceData() {
  const inc = useRecords('income');
  const exp = useRecords('expense');
  return {
    income: inc.data || [],
    expenses: exp.data || [],
    isLoading: inc.isLoading || exp.isLoading,
    isError: inc.isError || exp.isError,
  };
}

// Accurate totals + counts from the server (SUM / COUNT), independent of the
// 1000-row list cap used for charts and recent activity.
export function useTotals() {
  const { user } = useAuth();
  const enabled = !!user;
  const inc = useQuery({
    queryKey: ['totals', 'income', user?.id],
    enabled,
    queryFn: async () => {
      const agg = await base44.entities.Income.aggregate({ query: { created_by_id: user.id }, sum: 'amount' });
      const row = (agg.rows || [])[0] || {};
      return { count: row.count ?? 0, sum: Number(row.sum_amount) || 0 };
    },
  });
  const exp = useQuery({
    queryKey: ['totals', 'expense', user?.id],
    enabled,
    queryFn: async () => {
      const agg = await base44.entities.Expense.aggregate({ query: { created_by_id: user.id }, sum: 'amount' });
      const row = (agg.rows || [])[0] || {};
      return { count: row.count ?? 0, sum: Number(row.sum_amount) || 0 };
    },
  });
  return {
    ti: inc.data?.sum ?? 0,
    te: exp.data?.sum ?? 0,
    incomeCount: inc.data?.count ?? 0,
    expenseCount: exp.data?.count ?? 0,
    isLoading: inc.isLoading || exp.isLoading,
    isError: inc.isError || exp.isError,
  };
}

export function useSaveTx() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id, data }) =>
      id ? base44.entities[ENTITY[type]].update(id, data) : base44.entities[ENTITY[type]].create(data),
    onSuccess: (_, { type }) => {
      qc.invalidateQueries({ queryKey: [type] });
      qc.invalidateQueries({ queryKey: ['totals', type] });
    },
  });
}

export function useDeleteTx() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }) => base44.entities[ENTITY[type]].delete(id),
    onSuccess: (_, { type }) => {
      qc.invalidateQueries({ queryKey: [type] });
      qc.invalidateQueries({ queryKey: ['totals', type] });
    },
  });
}

export function useBudgets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['budget', user?.id],
    enabled: !!user,
    queryFn: () => base44.entities.Budget.filter({ created_by_id: user.id }, '-updated_date', 1000),
  });
}

export function useSaveBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => (id ? base44.entities.Budget.update(id, data) : base44.entities.Budget.create(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget'] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => base44.entities.Budget.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget'] }),
  });
}

export function useGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['goal', user?.id],
    enabled: !!user,
    queryFn: () => base44.entities.SavingsGoal.filter({ created_by_id: user.id }, '-updated_date', 200),
  });
}

export function useSaveGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => (id ? base44.entities.SavingsGoal.update(id, data) : base44.entities.SavingsGoal.create(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goal'] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => base44.entities.SavingsGoal.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goal'] }),
  });
}