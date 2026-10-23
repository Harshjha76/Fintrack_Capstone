import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProfileChip() {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => base44.auth.me(), retry: false });
  const name = user?.full_name || user?.email || 'Student';
  const initials = name.split(/[\s@]/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  return (
    <div className="flex h-10 items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">{initials}</span>
      <span className="max-w-[140px] truncate text-sm">{name}</span>
    </div>
  );
}