import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { formatINR, currentMonthKey } from '@/lib/finance';

// Fire-and-forget: creates in-app notifications when a transaction is logged,
// and a budget-exceeded alert the moment an expense first pushes its category
// over the monthly limit.
export async function generateTxNotifications(record, type) {
  try {
    if (type === 'income') {
      await base44.entities.Notification.create({
        title: 'Income recorded',
        message: `${record.source || 'Income'} of ${formatINR(record.amount)} was added to your records.`,
        type: 'transaction',
        read: false,
      });
      return;
    }

    const situation = (record.situation || '').trim() || '—';
    await base44.entities.Notification.create({
      title: 'Expense recorded',
      message: `${record.category || 'Expense'} of ${formatINR(record.amount)} (${situation}) was logged.`,
      type: 'transaction',
      read: false,
    });

    // Budget-over check: alert only at the exact moment spending crosses the limit.
    const month = (record.date && record.date.slice(0, 7)) || currentMonthKey();
    const budgets = await base44.entities.Budget.filter({ category: record.category, month });
    const budget = budgets[0];
    if (!budget) return;

    const amount = Number(record.amount) || 0;
    const ownerId = record.created_by_id;
    const catExpenses = await base44.entities.Expense.filter(
      ownerId ? { category: record.category, created_by_id: ownerId } : { category: record.category }
    );
    const spent = catExpenses
      .filter((e) => e.date && e.date.slice(0, 7) === month)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const spentBefore = spent - amount;

    if (spent > budget.monthly_limit && spentBefore <= budget.monthly_limit) {
      const over = formatINR(spent - budget.monthly_limit);
      await base44.entities.Notification.create({
        title: 'Budget limit crossed',
        message: `You just went over your ${formatINR(budget.monthly_limit)} budget for ${record.category} this month — ${over} above the limit.`,
        type: 'budget',
        read: false,
      });
      toast.warning(`Over budget: ${record.category}`, {
        description: `${over} above your ${formatINR(budget.monthly_limit)} limit this month.`,
      });
    }
  } catch {
    /* notifications are best-effort; never block the transaction */
  }
}