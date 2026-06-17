'use client';

import { Menu } from 'lucide-react';

import { Sidebar } from '@/components/layout/sidebar';
import { adminNav } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/stores/use-ui-store';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar items={adminNav} title="Admin Panel" />

      {/* Main Content */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16',
        )}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="shrink-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-lg font-semibold md:text-xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Additional header actions can be added here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
