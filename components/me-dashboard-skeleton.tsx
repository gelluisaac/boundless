'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package2, Users, Star, Trophy } from 'lucide-react';

export function MeDashboardSkeleton() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-2'>
      <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
        {/* Stats Cards Skeleton */}
        <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
          {[Package2, Users, Star, Trophy].map((Icon, index) => (
            <Card key={index} className='bg-background border-border/10 animate-pulse'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='h-4 w-24 rounded bg-muted/50' />
                  <div className='h-5 w-5 rounded bg-muted/50' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='h-8 w-16 rounded bg-muted/50' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects Skeleton */}
        <div className='px-4 lg:px-6'>
          <Card className='bg-background border-border/10'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <div className='h-5 w-5 rounded bg-muted/50' />
                <div className='h-6 w-32 rounded bg-muted/50' />
              </div>
              <div className='h-4 w-48 rounded bg-muted/50' />
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-center space-x-3 p-3 border border-border/10 rounded'>
                    <div className='h-8 w-8 rounded bg-muted/50' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 w-3/4 rounded bg-muted/50' />
                      <div className='h-3 w-1/2 rounded bg-muted/50' />
                    </div>
                    <div className='h-6 w-16 rounded bg-muted/50' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Skeleton */}
        <div className='px-4 lg:px-6'>
          <Card className='bg-background border-border/10'>
            <CardHeader>
              <div className='h-6 w-40 rounded bg-muted/50' />
              <div className='h-4 w-56 rounded bg-muted/50' />
            </CardHeader>
            <CardContent>
              <div className='h-[250px] w-full rounded bg-muted/50' />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
