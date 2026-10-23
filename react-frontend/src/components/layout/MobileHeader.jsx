import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import NotificationsMenu from '@/components/notifications/NotificationsMenu';

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Link to="/" className="font-heading text-xl font-extrabold tracking-tight">FinTrack</Link>
      <div className="flex items-center gap-2">
        <NotificationsMenu />
        <Link to="/project" className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:text-foreground">
          <Code2 className="h-4 w-4" /> Code kit
        </Link>
      </div>
    </header>
  );
}