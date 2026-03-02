'use client';

import { GetMeResponse } from '@/lib/api/types';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { RecentProjects } from '@/components/recent-projects';
import { MeDashboardSkeleton } from '@/components/me-dashboard-skeleton';
import { useAuthStatus } from '@/hooks/use-auth';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function MeDashboard() {
  const { user, isLoading } = useAuthStatus();
  const { refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cast user.profile to GetMeResponse for type safety
  const meData = user?.profile as GetMeResponse | undefined;

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
    );
  }

  // Handle missing data
  if (!meData) {
    return (
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <p className='text-muted-foreground'>No data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data with proper mapping
  const chartData = meData.chart?.map(item => ({
    date: item.date,
    projects: item.count,
  })) || [];

  // Prepare projects data from user.projects
  const projectsData = meData.user?.projects || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='@container/main flex flex-1 flex-col gap-2'
    >
      <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
        <SectionCards stats={meData.stats} />
        <div className='px-4 lg:px-6'>
          <RecentProjects projects={projectsData} />
        </div>
        <div className='px-4 lg:px-6'>
          <ChartAreaInteractive
            chartData={chartData}
            title='Activity Overview'
            description='Your activity over time'
          />
        </div>
      </div>
    </motion.div>
  );
}
