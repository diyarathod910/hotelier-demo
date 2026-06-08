import React, { useState } from 'react';
import SearchFilters from '../components/hotels/SearchFilters';
import HotelGrid from '../components/hotels/HotelGrid';
import CompareBar from '../components/compare/CompareBar';
import { useInfiniteHotels } from '../hooks/useInfiniteHotels';

export default function HomePage() {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("hotelFilters");
    return saved ? JSON.parse(saved) : null;
  });
  const handleSearch = (newFilters) => {
    localStorage.setItem(
      "hotelFilters",
      JSON.stringify(newFilters)
    );

    setFilters(newFilters);
  };
  const { hotels, loading, loadingMore, error, hasMore, total, loadMore } = useInfiniteHotels(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
          Discover your<br />
          <span className="text-brand-400">perfect hotel</span>
        </h1>
        <p className="text-slate-400 mt-3 text-lg max-w-xl">
          Search 180,000+ hotels via Hotelbeds API. Select up to 4 to compare side by side.
        </p>
      </div>

      {/* Search filters */}
      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} loading={loading} />
      </div>

      {/* Results */}
      <HotelGrid
        hotels={hotels}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        total={total}
        loadMore={loadMore}
      />

      {/* Sticky compare bar */}
      <CompareBar />
    </div>
  );
}
