import { useState, useEffect, useRef, useCallback } from 'react';
import { searchHotels } from '../lib/hotelbeds';

const PAGE_SIZE = 20;

export function useInfiniteHotels(filters) {
  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]         = useState(null);
  const [hasMore, setHasMore]     = useState(false);
  const [total, setTotal]         = useState(0);
  const pageRef                   = useRef(1);
  const filtersRef                = useRef(null);

  const fetchPage = useCallback(async (page, isNewSearch) => {
    if (!filters?.checkIn || !filters?.checkOut || !filters?.destinationCode) return;

    const from = (page - 1) * PAGE_SIZE + 1;
    const to   = page * PAGE_SIZE;

    isNewSearch ? setLoading(true) : setLoadingMore(true);
    setError(null);

    try {
      const data = await searchHotels({ ...filters, from, to });
      const incoming = data?.hotels?.hotels || [];
      const totalCount = data?.hotels?.total || 0;

      setTotal(totalCount);
      setHotels(prev => isNewSearch ? incoming : [...prev, ...incoming]);
      setHasMore(to < totalCount);
      pageRef.current = page;
    } catch (err) {
      setError(err.message || 'Failed to fetch hotels.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // New search when filters change
  useEffect(() => {
    const key = JSON.stringify(filters);
    if (!filters?.checkIn || !filters?.checkOut || !filters?.destinationCode) return;
    if (key === filtersRef.current) return;
    filtersRef.current = key;
    pageRef.current = 1;
    fetchPage(1, true);
  }, [filters, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPage(pageRef.current + 1, false);
    }
  }, [loadingMore, hasMore, fetchPage]);

  return { hotels, loading, loadingMore, error, hasMore, total, loadMore };
}
