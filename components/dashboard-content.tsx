'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStatus } from '@/hooks/use-auth';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { MeDashboardSkeleton } from '@/components/me-dashboard-skeleton';
import { FamilyWalletButton } from '@/components/wallet/FamilyWalletButton';
import {
  FamilyWalletDrawer,
  DrawerView,
} from '@/components/wallet/FamilyWalletDrawer';
import { GetMeResponse } from '@/lib/api/types';

export function DashboardContent() {
  const { user, isLoading } = useAuthStatus();
  const { refreshUser } = useAuth();
  const [familyDrawerOpen, setFamilyDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<DrawerView>('main');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger refreshUser on mount to ensure latest data
  useEffect(() => {
    const refreshData = async () => {
      if (!isRefreshing && !isLoading) {
        try {
          setIsRefreshing(true);
          setError(null);
          await refreshUser();
        } catch (err) {
          setError('Failed to load latest data');
          console.error('Refresh user failed:', err);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshData();
  }, [refreshUser, isLoading, isRefreshing]);

  // Show skeleton while loading or refreshing
  if (isLoading || isRefreshing) {
    return <MeDashboardSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar user={{ name: '', email: '', image: '' }} variant='inset' />
        <SidebarInset className='bg-white'>
          <SiteHeader />
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                <div className='px-4 lg:px-6'>
                  <div className='bg-destructive/10 border-destructive/20 rounded-lg border p-4 text-center'>
                    <p className='text-destructive'>{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className='mt-2 text-primary underline'
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const meData = user?.profile as GetMeResponse | undefined;
  const { name = '', email = '', profile, image: userImage = '' } = user || {};
  const userData = {
    name: name || '',
    email,
    image: profile?.image || userImage,
  };

  // Handle missing data
  if (!meData) {
    return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar user={userData} variant='inset' />
        <SidebarInset className='bg-white'>
          <SiteHeader />
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                <div className='px-4 lg:px-6'>
                  <div className='bg-muted/50 rounded-lg p-4 text-center'>
                    <p className='text-muted-foreground'>No data available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Prepare chart data from real session data
  const chartData = meData?.chart?.map(item => ({
    date: item.date,
    projects: item.count,
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar user={userData} variant='inset' />
        <SidebarInset className='bg-white'>
          <SiteHeader />
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                <SectionCards stats={meData?.stats} />
                <div className='px-4 lg:px-6'>
                  <ChartAreaInteractive
                    chartData={chartData}
                    title='Activity Overview'
                    description='Your activity over time'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Family Wallet Components */}
          <FamilyWalletButton
            onOpenDrawer={view => {
              if (view) setDrawerView(view);
              setFamilyDrawerOpen(true);
            }}
          />
          <FamilyWalletDrawer
            open={familyDrawerOpen}
            initialView={drawerView}
            onOpenChange={setFamilyDrawerOpen}
          />
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  );
}
