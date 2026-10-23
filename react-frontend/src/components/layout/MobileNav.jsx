import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV } from '@/lib/nav';
import { useTxDialog } from '@/components/tx/TxDialogContext';

function Item({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn('flex h-full flex-col items-center justify-center gap-1 text-xs', isActive ? 'text-foreground' : 'text-muted-foreground')}
    >
      {({ isActive }) => (<><Icon className={cn('h-5 w-5', isActive && 'text-primary')} />{label}</>)}
    </NavLink>
  );
}

export default function MobileNav() {
  const { openNew } = useTxDialog();
  const items = NAV.slice(0, 4);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sidebar pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid h-16 grid-cols-5 items-center">
        <Item {...items[0]} />
        <Item {...items[1]} />
        <div className="flex justify-center">
          <button
            onClick={() => openNew('expense')}
            aria-label="Add transaction"
            className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <Item {...items[2]} />
        <Item {...items[3]} />
      </div>
    </nav>
  );
}