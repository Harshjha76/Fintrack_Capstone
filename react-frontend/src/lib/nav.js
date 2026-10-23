import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, PieChart, Target, PiggyBank, Code2 } from 'lucide-react';

export const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/income', label: 'Income', icon: ArrowDownLeft },
  { to: '/expenses', label: 'Expenses', icon: ArrowUpRight },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/budgets', label: 'Budgets', icon: Target },
  { to: '/goals', label: 'Savings Goals', icon: PiggyBank },
  { to: '/project', label: 'Architecture & Code', icon: Code2 },
];