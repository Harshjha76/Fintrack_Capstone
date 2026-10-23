import React from 'react';
import { NavLink } from 'react-router-dom';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV } from '@/lib/nav';

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-border bg-sidebar px-4 py-6 md:flex">
      <div className="mb-10 px-2">
        <div className="font-heading text-2xl font-extrabold tracking-tight">FinTrack</div>
        <div className="mt-1 text-xs text-muted-foreground">Student Finance System</div>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'group flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors',
              isActive ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg border border-border p-3 text-xs leading-relaxed text-muted-foreground">
        <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
          <Database className="h-3.5 w-3.5 text-success" /> Live database
        </div>
        Every figure is calculated from stored records. Nothing is hard-coded.
      </div>
    </aside>
  );
}