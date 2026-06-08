import React, { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext(null);

const STORAGE_KEY = 'hotelier_compare';
const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [selected, setSelected] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever selections change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  const addHotel = (hotel) => {
    setSelected(prev => {
      if (prev.find(h => h.code === hotel.code)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, hotel];
    });
  };

  const removeHotel = (code) => {
    setSelected(prev => prev.filter(h => h.code !== code));
  };

  const toggleHotel = (hotel) => {
    if (selected.find(h => h.code === hotel.code)) {
      removeHotel(hotel.code);
    } else {
      addHotel(hotel);
    }
  };

  const clearAll = () => setSelected([]);

  const isSelected = (code) => selected.some(h => h.code === code);
  const canAdd = selected.length < MAX_COMPARE;

  return (
    <CompareContext.Provider value={{ selected, addHotel, removeHotel, toggleHotel, clearAll, isSelected, canAdd, MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
