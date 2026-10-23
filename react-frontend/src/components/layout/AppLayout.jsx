import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TxDialogProvider } from '@/components/tx/TxDialogContext';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';

export default function AppLayout() {
  return (
    <TxDialogProvider>
      <div className="min-h-screen overflow-x-hidden bg-background">
        <Sidebar />
        <div className="md:pl-[240px]">
          <MobileHeader />
          <main className="mx-auto max-w-[1440px] px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
      <Toaster theme="dark" position="top-center" richColors />
    </TxDialogProvider>
  );
}