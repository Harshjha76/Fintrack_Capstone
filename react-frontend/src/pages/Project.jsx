import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import ArchitectureFlow from '@/components/project/ArchitectureFlow';
import Differentiators from '@/components/project/Differentiators';
import CodeKit from '@/components/project/CodeKit';

export default function Project() {
  return (
    <div>
      <PageHeader
        eyebrow="B.Tech Capstone"
        title="Architecture & Code Kit"
        subtitle="How FinTrack is built, and the Flask + MySQL files for your submission"
      />
      <div className="flex flex-col gap-5">
        <ArchitectureFlow />
        <Differentiators />
        <CodeKit />
      </div>
    </div>
  );
}