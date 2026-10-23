import React from 'react';
import { Smartphone, Server, Database, Layers, Calculator, BarChart3, ArrowDown } from 'lucide-react';
import Panel from '@/components/common/Panel';

const LAYERS = [
  { icon: Smartphone, title: 'FlutterFlow Frontend', kit: 'FlutterFlow screens call the REST API through API Calls', live: 'The React web interface you are using now' },
  { icon: Server, title: 'Python / Flask Backend', kit: 'app.py routes + validators.py: validation, CRUD, error handling', live: 'Platform backend API with the same validation rules' },
  { icon: Database, title: 'MySQL / DBMS', kit: 'Fin_Track database: income & expenses tables, AUTO_INCREMENT keys, CHECK & ENUM constraints', live: 'Built-in database with Income and Expense tables' },
  { icon: Layers, title: 'Data Processing & Data Structures', kit: 'processing.py: lists of dicts, linear search, dictionary-based monthly merge', live: 'Record arrays: traversal, linear search, filtering, sorting' },
  { icon: Calculator, title: 'Financial Analysis', kit: 'SUM · COUNT · GROUP BY · ORDER BY queries, balance and savings rate', live: 'The same aggregations computed from stored records' },
  { icon: BarChart3, title: 'Charts / Dashboard', kit: 'FlutterFlow charts bound to /api/dashboard and /api/analytics/*', live: 'Dashboard and Analytics pages' },
];

export default function ArchitectureFlow() {
  return (
    <Panel title="System Architecture" subtitle="Six layers, top to bottom">
      <div className="mb-3 hidden grid-cols-12 gap-4 px-4 text-xs uppercase tracking-wider text-muted-foreground md:grid">
        <div className="col-span-4">Layer</div><div className="col-span-4">Code kit (submission)</div><div className="col-span-4">This live demo</div>
      </div>
      {LAYERS.map((l, i) => (
        <div key={l.title}>
          <div className="grid gap-3 rounded-lg border border-border bg-background p-4 md:grid-cols-12 md:gap-4">
            <div className="flex items-center gap-3 md:col-span-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><l.icon className="h-4 w-4" /></span>
              <span className="font-heading font-semibold">{l.title}</span>
            </div>
            <p className="text-sm text-muted-foreground md:col-span-4"><span className="text-foreground md:hidden">Code kit: </span>{l.kit}</p>
            <p className="text-sm text-muted-foreground md:col-span-4"><span className="text-foreground md:hidden">Live demo: </span>{l.live}</p>
          </div>
          {i < LAYERS.length - 1 && <div className="flex justify-center py-1.5"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>}
        </div>
      ))}
    </Panel>
  );
}