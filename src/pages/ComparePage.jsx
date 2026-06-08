import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line,
} from 'recharts';
import { useCompare } from '../context/CompareContext';

const CHART_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 shadow-xl border border-white/10">
      <p className="text-slate-300 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const { selected, removeHotel, clearAll } = useCompare();
  const navigate = useNavigate();

  if (selected.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-3">Select hotels to compare</h2>
        <p className="text-slate-400 mb-8">Go back to search and select at least 2 hotels to compare.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Search
        </button>
      </div>
    );
  }

  // Build chart data
  const getBestRate = (hotel) => {
    const rate = hotel.rooms?.reduce((min, room) => {
      const r = room.rates?.[0]?.net;
      return r && r < min ? r : min;
    }, Infinity);
    return rate !== Infinity ? parseFloat(rate) : 0;
  };

  const getCategory = (hotel) =>
    hotel.categoryCode ? parseInt(hotel.categoryCode.charAt(0)) : 0;

  const getReviewRate = (hotel) => hotel.reviews?.[0]?.rate || 0;

  // Price comparison bar data
  const priceData = selected.map((h, i) => ({
    name: h.name.length > 15 ? h.name.substring(0, 15) + '…' : h.name,
    'Best Rate (€)': getBestRate(h),
    fill: CHART_COLORS[i],
  }));

  // Radar chart data (normalize to 0-100)
  const radarData = [
    {
      metric: 'Stars',
      ...Object.fromEntries(selected.map(h => [h.name.substring(0, 10), (getCategory(h) / 5) * 100])),
    },
    {
      metric: 'Review',
      ...Object.fromEntries(selected.map(h => [h.name.substring(0, 10), (getReviewRate(h) / 5) * 100])),
    },
    {
      metric: 'Affordability',
      ...Object.fromEntries(selected.map(h => {
        const rate = getBestRate(h);
        return [h.name.substring(0, 10), rate > 0 ? Math.max(0, 100 - (rate / 10)) : 50];
      })),
    },
    {
      metric: 'Room Types',
      ...Object.fromEntries(selected.map(h => [h.name.substring(0, 10), Math.min(100, (h.rooms?.length || 0) * 10)])),
    },
  ];

  // Room rate trend (simulate multi-night pricing with slight variance)
  const lineData = Array.from({ length: 7 }, (_, i) => {
    const night = `Night ${i + 1}`;
    const obj = { night };
    selected.forEach((h, idx) => {
      const base = getBestRate(h);
      obj[h.name.substring(0, 12)] = parseFloat((base * (0.9 + Math.random() * 0.25)).toFixed(2));
    });
    return obj;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </button>
          <h1 className="font-display text-3xl font-bold text-white">Hotel Comparison</h1>
          <p className="text-slate-400 mt-1">Comparing {selected.length} hotels</p>
        </div>
        <button onClick={clearAll} className="btn-secondary text-sm !px-4 !py-2">
          Clear all
        </button>
      </div>

      {/* Hotel summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {selected.map((hotel, i) => (
          <div key={hotel.code} className="card p-4 relative" style={{ borderColor: `${CHART_COLORS[i]}40` }}>
            <div className="absolute top-3 right-3">
              <button
                onClick={() => removeHotel(hotel.code)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: CHART_COLORS[i] }} />
            <h3 className="font-display font-semibold text-white text-base leading-tight mb-1 pr-6">
              {hotel.name}
            </h3>
            <p className="text-slate-500 text-xs">{'★'.repeat(getCategory(hotel))}</p>
            <p className="text-brand-400 font-bold text-xl font-display mt-2">
              {getBestRate(hotel) > 0 ? `€${getBestRate(hotel).toFixed(0)}` : 'N/A'}
              <span className="text-slate-500 text-xs font-body font-normal">/night</span>
            </p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Price Comparison Bar Chart */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-1">Price Comparison</h2>
          <p className="text-slate-500 text-xs mb-5">Best available nightly rate (€)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={priceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Best Rate (€)" radius={[6, 6, 0, 0]}>
                {priceData.map((entry, i) => (
                  <rect key={i} fill={CHART_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-1">Overall Score</h2>
          <p className="text-slate-500 text-xs mb-5">Multi-dimensional comparison (0–100 scale)</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              {selected.map((h, i) => (
                <Radar
                  key={h.code}
                  name={h.name.substring(0, 12)}
                  dataKey={h.name.substring(0, 10)}
                  stroke={CHART_COLORS[i]}
                  fill={CHART_COLORS[i]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-night rate trend line chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-white mb-1">7-Night Rate Trend</h2>
          <p className="text-slate-500 text-xs mb-5">Simulated price variation across a 7-night stay</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="night" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
              {selected.map((h, i) => (
                <Line
                  key={h.code}
                  type="monotone"
                  dataKey={h.name.substring(0, 12)}
                  stroke={CHART_COLORS[i]}
                  strokeWidth={2.5}
                  dot={{ fill: CHART_COLORS[i], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature table */}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-slate-400 font-medium p-4 w-36">Feature</th>
              {selected.map((h, i) => (
                <th key={h.code} className="text-left p-4">
                  <span className="text-white font-display font-semibold text-base" style={{ color: CHART_COLORS[i] }}>
                    {h.name.substring(0, 20)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Best Rate', fn: h => getBestRate(h) > 0 ? `€${getBestRate(h).toFixed(0)}/night` : 'N/A' },
              { label: 'Stars', fn: h => '★'.repeat(getCategory(h)) || 'N/A' },
              { label: 'Review Score', fn: h => getReviewRate(h) ? `${getReviewRate(h).toFixed(1)} / 5` : 'N/A' },
              { label: 'Room Types', fn: h => h.rooms?.length || 0 },
              { label: 'Destination', fn: h => h.destinationName || h.zoneName || '—' },
            ].map(row => (
              <tr key={row.label} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="p-4 text-slate-500 font-medium">{row.label}</td>
                {selected.map(h => (
                  <td key={h.code} className="p-4 text-white">{row.fn(h)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
