import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import Panel from '@/components/common/Panel';
import MetricCards from '@/components/dashboard/MetricCards';
import CashflowChart from '@/components/dashboard/CashflowChart';
import BreakdownDonuts from '@/components/dashboard/BreakdownDonuts';
import RecentActivity from '@/components/dashboard/RecentActivity';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import GoalsSummary from '@/components/dashboard/GoalsSummary';
import AiInsights from '@/components/dashboard/AiInsights';
import DataActions from '@/components/dashboard/DataActions';
import ProfileChip from '@/components/dashboard/ProfileChip';
import NotificationsMenu from '@/components/notifications/NotificationsMenu';
import TransactionForm from '@/components/tx/TransactionForm';
import { useTxDialog } from '@/components/tx/TxDialogContext';
import { useFinanceData, useTotals } from '@/hooks/useFinance';
import { healthStatus } from '@/lib/finance';
import { AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { income, expenses, isLoading, isError } = useFinanceData();
  const { ti, te, incomeCount, expenseCount, isLoading: totalsLoading } = useTotals();
  const { openNew } = useTxDialog();
  const health = healthStatus(ti, te);
  const totals = { ti, te, incomeCount, expenseCount, health, loading: totalsLoading };

  return (
    <div>
      <PageHeader
        eyebrow="FinTrack Academic Portal"
        title="Dashboard"
        subtitle="Your financial health at a glance"
        actions={<>
          <NotificationsMenu className="hidden md:inline-flex" />
          <ProfileChip />
          <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Link to="/login"><LogIn className="mr-1 h-3.5 w-3.5" />Log in</Link>
          </Button>
          <Button asChild size="sm" className="h-8 px-3 text-xs">
            <Link to="/register"><UserPlus className="mr-1 h-3.5 w-3.5" />Sign up</Link>
          </Button>
          <Button onClick={() => openNew('expense')} className="h-10"><Plus className="mr-1 h-4 w-4" /><span className="hidden sm:inline">Transaction</span><span className="sm:hidden">Add</span></Button>
        </>}
      />
      <div className="flex flex-col gap-5">
        {isError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Couldn't load your data. Tap Refresh to try again.
          </div>
        )}
        <DataActions />
        <MetricCards totals={totals} loading={isLoading} />
        <div className="order-3 grid gap-5 lg:order-2 lg:grid-cols-12">
          <CashflowChart income={income} expenses={expenses} className="lg:col-span-7" />
          <BreakdownDonuts expenses={expenses} className="lg:col-span-5" />
        </div>
        <div className="order-2 grid gap-5 lg:order-3 lg:grid-cols-2">
          <RecentActivity income={income} expenses={expenses} loading={isLoading} />
          <Panel title="Quick Log" subtitle="Saved instantly to the database" className="hidden md:block">
            <TransactionForm initialType="expense" />
          </Panel>
        </div>
        <BudgetProgress expenses={expenses} />
        <div className="grid gap-5 lg:grid-cols-2">
          <GoalsSummary />
          <AiInsights income={income} expenses={expenses} />
        </div>
      </div>
    </div>
  );
}