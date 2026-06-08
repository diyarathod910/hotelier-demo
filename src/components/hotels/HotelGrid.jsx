import React, { useEffect, useRef } from 'react';
import HotelCard from './HotelCard';

function SkeletonCard() {
  return (
    <div className="card">
      <div className="h-44 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 shimmer rounded w-1/3" />
        <div className="h-5 shimmer rounded w-3/4" />
        <div className="h-3 shimmer rounded w-1/2" />
        <div className="pt-3 mt-3 border-t border-white/5 flex justify-between">
          <div className="h-7 shimmer rounded w-20" />
          <div className="h-5 shimmer rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function HotelGrid({ hotels, loading, loadingMore, error, hasMore, total, loadMore }) {
  const sentinelRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-slate-400 text-sm max-w-sm">{error}</p>
        <p className="text-slate-600 text-xs mt-2">Check your Hotelbeds API key and secret in .env</p>
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-white mb-2">No results yet</h3>
        <p className="text-slate-400 text-sm">Use the search filters above to find hotels.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">
          Showing <span className="text-white font-medium">{hotels.length}</span> of{' '}
          <span className="text-white font-medium">{total.toLocaleString()}</span> hotels
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hotels.map((hotel, i) => (
          <HotelCard
            key={hotel.code}
            hotel={hotel}
            style={{ animationDelay: `${(i % 20) * 40}ms`, animationFillMode: 'both' }}
          />
        ))}
        {loadingMore && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-4 mt-4" />}

      {!hasMore && hotels.length > 0 && (
        <p className="text-center text-slate-600 text-sm mt-8 py-4 border-t border-white/5">
          All {total.toLocaleString()} hotels loaded
        </p>
      )}
    </div>
  );
}
