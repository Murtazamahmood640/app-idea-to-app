import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-20 safe-area-top">
      <main className="mx-auto max-w-lg">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};
