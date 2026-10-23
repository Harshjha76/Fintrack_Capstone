import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data yet', text, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {text && <p className="max-w-xs text-xs text-muted-foreground">{text}</p>}
      {action}
    </div>
  );
}