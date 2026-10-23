import React from 'react';
import { cn } from '@/lib/utils';

export default function Panel({ title, subtitle, action, className, children }) {
  return (
    <section className={cn('rounded-lg border border-border bg-card p-4 md:p-5', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold md:text-xl">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}