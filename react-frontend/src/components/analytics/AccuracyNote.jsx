import React from 'react';
import Panel from '@/components/common/Panel';
import { ShieldCheck, Calculator, Lock, RefreshCw } from 'lucide-react';

const SECTIONS = [
  {
    icon: Calculator,
    title: 'Calculation correctness',
    points: [
      'Every total is a single pass over stored records summing amount — O(n), no estimation or sampling.',
      'Currency values are rounded to 2 decimals (Math.round(x × 100) / 100) to avoid float drift.',
      'Net balance = total income − total expenses; savings rate = balance ÷ total income × 100.',
      'Grouping (category / situation / month) is deterministic and sorted by descending total.',
      'Health status: Stable ≥ 20% saved, Watch 0–20%, Warning when balance < 0.',
    ],
  },
  {
    icon: Lock,
    title: 'Data validation & integrity',
    points: [
      'Amount must be > 0 (min 0.01) — negative or empty values are rejected before save.',
      'Category, situation and source are constrained to fixed enum lists.',
      'Dates are validated and required, so monthly grouping never misplaces a record.',
      'Row-Level Security scopes every record to the signed-in user — no cross-user data leakage.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Live & consistent',
    points: [
      'Charts and tables read the same source records, so totals always match across views.',
      'Queries are re-run after every create / update / delete via React Query cache invalidation.',
      'Receipts are stored privately and referenced by URI, never inlined into totals.',
    ],
  },
];

export default function AccuracyNote() {
  return (
    <Panel
      title="Accuracy & data integrity"
      subtitle="How FinTrack keeps every number exact and trustworthy"
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified formulas
        </span>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-lg border border-border bg-background/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="font-heading text-sm font-semibold">{s.title}</h3>
              </div>
              <ul className="space-y-2">
                {s.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}