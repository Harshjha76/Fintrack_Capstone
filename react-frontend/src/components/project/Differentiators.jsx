import React from 'react';
import Panel from '@/components/common/Panel';

const FOCUS = [
  { title: 'Why you spend, not just what', text: 'Every expense is tagged by situation — Necessary, Casual, Emergency, Entertainment, Time Pass or Other — so students see where, when and why their money goes, not only what it was.' },
  { title: 'Built for college students', text: 'Hostel rent, books, tuition, mobile recharge, pocket money, scholarships and stipends — categories and income sources match student life, not generic adult finance.' },
  { title: 'Academic-year view', text: 'Month-by-month cash flow lets you track spending across a semester or academic year, not just a calendar year.' },
  { title: 'Savings goals', text: 'Set a target and deadline per goal, track progress with progress bars, and add money as you save toward what matters.' },
  { title: 'Receipt capture', text: 'Attach a photo to any expense so you keep proof of payments — stored privately to your account, viewable from the record.' },
  { title: 'AI spending insights', text: 'A weekly smart summary flags unusual spending, predicts whether next month may fall short, and suggests student-friendly savings tips.' },
  { title: 'Transparent calculations', text: 'Every total comes from stored records, and the formulas and SQL are shown on the Analytics page.' },
  { title: 'Simple financial health', text: 'One clear status (Stable, Watch or Warning) based on your savings rate — practical, simple, easy to use.' },
];

const SYLLABUS = [
  { area: 'Python', items: 'Backend logic, validation, CRUD, calculations, searching/filtering, database connection' },
  { area: 'DBMS / MySQL', items: 'Permanent storage, tables, primary keys, constraints, parameterized SQL, aggregation' },
  { area: 'Data Structures', items: 'Lists of records for temporary processing; dictionaries for grouping and monthly merge' },
  { area: 'Algorithms', items: 'CRUD, linear search, traversal, filtering, sorting, aggregation, grouping, balance calculation' },
];

export default function Differentiators() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="FinTrack's Focus" subtitle="What this project focuses on. It is not a claim to be better than other finance apps.">
        <ul className="space-y-3">
          {FOCUS.map((f) => (
            <li key={f.title} className="border-l-2 border-primary pl-3">
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.text}</div>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Syllabus Mapping" subtitle="Where each subject shows up in the system. No AI/ML is used.">
        <div className="space-y-3">
          {SYLLABUS.map((s) => (
            <div key={s.area} className="rounded-lg border border-border bg-background p-3">
              <div className="font-heading text-sm font-semibold text-primary">{s.area}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.items}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}