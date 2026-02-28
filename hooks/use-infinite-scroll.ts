'use client';

import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  rootMargin?: string;
}

/**
 * Triggers onLoadMore when the sentinel element enters the viewport (or within rootMargin of it).
 * Pass the sentinel DOM element (e.g. from a callback ref + state) so the observer attaches after mount.
 */
export function useInfiniteScroll(
  sentinel: HTMLElement | null,
  options: UseInfiniteScrollOptions
): void {
  const {
    onLoadMore,
    hasMore,
    loading,
    rootMargin = '0px 0px 400px 0px',
  } = options;

  useEffect(() => {
    if (!sentinel) {
      console.log(
        '[useInfiniteScroll] No sentinel element yet, skipping observer'
      );
      return;
    }

    console.log('[useInfiniteScroll] Observer attached to sentinel', {
      hasMore,
      loading,
      rootMargin,
    });

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        const isIntersecting = !!entry?.isIntersecting;
        console.log('[useInfiniteScroll] Observer callback', {
          isIntersecting,
          hasMore,
          loading,
        });

        if (!entry?.isIntersecting) return;
        if (!hasMore) {
          console.log('[useInfiniteScroll] Skipped: hasMore is false');
          return;
        }
        if (loading) {
          console.log('[useInfiniteScroll] Skipped: already loading');
          return;
        }
        console.log('[useInfiniteScroll] Calling onLoadMore()');
        onLoadMore();
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      console.log('[useInfiniteScroll] Observer disconnected');
      observer.disconnect();
    };
  }, [sentinel, onLoadMore, hasMore, loading, rootMargin]);
}
