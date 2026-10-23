import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/common/EmptyState';
import { useNotifications, useMarkRead, useMarkAllRead, useClearNotifications } from '@/hooks/useNotifications';

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
      {count > 9 ? '9+' : count}
    </span>
  );
}

function Feed({ onClose }) {
  const { data: notes = [] } = useNotifications();
  const unread = notes.filter((n) => !n.read);
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const clear = useClearNotifications();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-1 pb-3">
        <span className="text-sm text-muted-foreground">{notes.length} notifications · {unread.length} unread</span>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" disabled={!unread.length} onClick={() => markAll.mutate(unread.map((n) => n.id))} className="h-9 text-muted-foreground">
            <CheckCheck className="mr-1 h-4 w-4" />Mark all
          </Button>
          <Button size="sm" variant="ghost" disabled={!notes.length} onClick={() => clear.mutate(notes.map((n) => n.id))} className="h-9 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {notes.length === 0 ? (
          <EmptyState title="No notifications yet" text="You'll be notified here when you log transactions or miss a budget goal." />
        ) : (
          <ul className="space-y-1">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => !n.read && markRead.mutate({ id: n.id, read: true })}
                  className={cn('flex w-full gap-3 rounded-lg px-3 py-3 text-left transition-colors', n.read ? 'opacity-60' : 'bg-accent/60')}
                >
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : n.type === 'budget' ? 'bg-destructive' : 'bg-primary')} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{n.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{n.created_date ? formatDistanceToNow(new Date(n.created_date), { addSuffix: true }) : ''}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{n.message}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function NotificationsMenu({ className }) {
  const { data: notes = [] } = useNotifications();
  const unread = notes.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const trigger = (
    <Button variant="outline" size="icon" aria-label="Notifications" className={cn('relative h-10 w-10', className)}>
      <Bell className="h-4 w-4" />
      <Badge count={unread} />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="border-border bg-card">
          <DrawerHeader className="text-left">
            <DialogTitle className="font-heading text-lg">Notifications</DialogTitle>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-hidden px-4 pb-8">
            <Feed />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-border bg-card p-5 sm:max-w-md">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-heading text-lg">Notifications</DialogTitle>
        </DialogHeader>
        <div className="h-[60vh]">
          <Feed onClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}