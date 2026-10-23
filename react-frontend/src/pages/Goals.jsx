import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import GoalsManager from '@/components/goals/GoalsManager';

export default function Goals() {
  return (
    <div>
      <PageHeader eyebrow="Plan ahead" title="Savings Goals" subtitle="Set targets, track progress, and grow your savings" />
      <GoalsManager />
    </div>
  );
}