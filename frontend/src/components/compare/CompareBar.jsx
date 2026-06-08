import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';

export default function CompareBar() {
  const { selected, removeHotel, clearAll, MAX_COMPARE } = useCompare();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="glass rounded-2xl border border-brand-500/30 p-4 shadow-2xl shadow-black/50 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-sm font-medium text-white">
                  {selected.length} / {MAX_COMPARE} selected
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selected.map(hotel => (
                  <div
                    key={hotel.code}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm text-white"
                  >
                    <span className="truncate max-w-[120px]">{hotel.name}</span>
                    <button
                      onClick={() => removeHotel(hotel.code)}
                      className="text-slate-400 hover:text-white transition-colors ml-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: MAX_COMPARE - selected.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="px-3 py-1 rounded-lg border border-dashed border-white/10 text-sm text-slate-600"
                  >
                    + Add hotel
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={clearAll} className="btn-secondary !px-4 !py-2 text-sm">
                Clear
              </button>
              <button
                onClick={() => navigate('/compare')}
                disabled={selected.length < 2}
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
