import React from 'react';
import { useCompare } from '../../context/CompareContext';

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= count ? 'text-brand-400' : 'text-slate-700'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function HotelCard({ hotel, style }) {
  const { toggleHotel, isSelected, canAdd } = useCompare();
  const selected = isSelected(hotel.code);

  // Extract best rate from rooms
  const bestRate = hotel.rooms?.reduce((min, room) => {
    const rate = room.rates?.[0]?.net;
    return rate && rate < min ? rate : min;
  }, Infinity);

  const hasRate = bestRate !== Infinity;
  const category = hotel.categoryCode ? parseInt(hotel.categoryCode.charAt(0)) : 0;

  // Use hotel image or a placeholder gradient
  const imageUrl = hotel.images?.[0]?.path
    ? `https://photos.hotelbeds.com/giata/${hotel.images[0].path}`
    : null;

  return (
    <div
      style={style}
      className={`card group relative flex flex-col animate-fade-up ${
        selected ? 'ring-2 ring-brand-500 border-brand-500/50' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
            }}
          >
            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Star badge */}
        {category > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <StarRating count={category} />
          </div>
        )}

        {/* Compare toggle */}
        <button
          onClick={() => toggleHotel(hotel)}
          disabled={!selected && !canAdd}
          title={!selected && !canAdd ? 'Max 4 hotels to compare' : selected ? 'Remove from compare' : 'Add to compare'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
            ${selected
              ? 'bg-brand-500 text-white'
              : canAdd
                ? 'bg-black/50 backdrop-blur-sm text-slate-300 hover:bg-brand-500/80 hover:text-white'
                : 'bg-black/30 text-slate-600 cursor-not-allowed'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            {hotel.destinationName || hotel.zoneName || 'Hotel'}
          </p>
          <h3 className="font-display font-semibold text-white text-lg leading-tight line-clamp-2 mb-2">
            {hotel.name}
          </h3>

          {hotel.address?.content && (
            <p className="text-slate-500 text-xs line-clamp-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hotel.address.content}
            </p>
          )}
        </div>

        {/* Rate */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          {hasRate ? (
            <div>
              <p className="text-xs text-slate-500">From</p>
              <p className="text-brand-400 font-bold text-xl font-display">
                €{parseFloat(bestRate).toFixed(0)}
                <span className="text-slate-500 text-xs font-normal font-body"> /night</span>
              </p>
            </div>
          ) : (
            <p className="text-slate-600 text-sm">Rate unavailable</p>
          )}

          <div className="text-right">
            {hotel.reviews?.[0] && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">
                  {hotel.reviews[0].rate?.toFixed(1)}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            )}
            <p className="text-xs text-slate-600">
              {hotel.rooms?.length || 0} room types
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
