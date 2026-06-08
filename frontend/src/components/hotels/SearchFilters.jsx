import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DESTINATIONS = [
  { code: 'LON', name: 'London, UK' },
  { code: 'NYC', name: 'New York, USA' },
  { code: 'PMI', name: 'Palma de Mallorca, Spain' },
  { code: 'BCN', name: 'Barcelona, Spain' },
  { code: 'PAR', name: 'Paris, France' },
  { code: 'ROM', name: 'Rome, Italy' },
  { code: 'DXB', name: 'Dubai, UAE' },
  { code: 'BKK', name: 'Bangkok, Thailand' },
  { code: 'SIN', name: 'Singapore' },
  { code: 'TYO', name: 'Tokyo, Japan' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export default function SearchFilters({ onSearch, loading }) {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({
    destinationCode: 'LON',
    checkIn: today,
    checkOut: tomorrow,
    adults: 2,
    rooms: 1,
    minRate: '',
    maxRate: '',
    minCategory: '',
  });

  const set = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...filters,
      minRate: filters.minRate ? Number(filters.minRate) : undefined,
      maxRate: filters.maxRate ? Number(filters.maxRate) : undefined,
      minCategory: filters.minCategory ? Number(filters.minCategory) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <h2 className="font-display text-lg font-semibold text-white">Search Hotels</h2>
        {isAdmin && (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-medium border border-purple-500/30">
            Admin Mode
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Destination</label>
          <select
            value={filters.destinationCode}
            onChange={e => set('destinationCode', e.target.value)}
            className="input-field"
          >
            {DESTINATIONS.map(d => (
              <option key={d.code} value={d.code} className="bg-slate-900">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Check-in</label>
          <input
            type="date"
            required
            min={today}
            value={filters.checkIn}
            onChange={e => set('checkIn', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Check-out</label>
          <input
            type="date"
            required
            min={filters.checkIn || today}
            value={filters.checkOut}
            onChange={e => set('checkOut', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Adults */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Guests</label>
          <select
            value={filters.adults}
            onChange={e => set('adults', Number(e.target.value))}
            className="input-field"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n} className="bg-slate-900">{n} {n === 1 ? 'Adult' : 'Adults'}</option>
            ))}
          </select>
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Rooms</label>
          <select
            value={filters.rooms}
            onChange={e => set('rooms', Number(e.target.value))}
            className="input-field"
          >
            {[1,2,3,4].map(n => (
              <option key={n} value={n} className="bg-slate-900">{n} {n === 1 ? 'Room' : 'Rooms'}</option>
            ))}
          </select>
        </div>

        {/* Min stars */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Min Stars</label>
          <select
            value={filters.minCategory}
            onChange={e => set('minCategory', e.target.value)}
            className="input-field"
          >
            <option value="" className="bg-slate-900">Any</option>
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n} className="bg-slate-900">{'★'.repeat(n)}</option>
            ))}
          </select>
        </div>

        {/* Admin-only: price range */}
        {isAdmin && (
          <>
            <div>
              <label className="block text-xs font-medium text-purple-400 mb-1.5 uppercase tracking-wide">Min Rate (€)</label>
              <input
                type="number"
                min="0"
                value={filters.minRate}
                onChange={e => set('minRate', e.target.value)}
                placeholder="0"
                className="input-field border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-400 mb-1.5 uppercase tracking-wide">Max Rate (€)</label>
              <input
                type="number"
                min="0"
                value={filters.maxRate}
                onChange={e => set('maxRate', e.target.value)}
                placeholder="1000"
                className="input-field border-purple-500/30 focus:border-purple-500"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Hotels
            </>
          )}
        </button>
      </div>
    </form>
  );
}
