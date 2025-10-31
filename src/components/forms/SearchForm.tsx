'use client';

import { SearchFormData } from '@/types/search';
import { useState } from 'react';

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleSubmit = () => {
    onSearch({ checkIn, checkOut, adults, children });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '21.10.25';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl p-4 md:p-6 rounded-2xl bg-white/[0.14] backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        <div className="flex-1 md:max-w-52 h-14 md:h-16 px-3 md:px-4 bg-white/50 rounded-xl flex items-center gap-3 md:gap-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="15" rx="2" stroke="#2b6c70" strokeWidth="2"/>
            <path d="M3 10H21" stroke="#2b6c70" strokeWidth="2"/>
            <path d="M8 3V7" stroke="#2b6c70" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 3V7" stroke="#2b6c70" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs uppercase text-[#06272d] font-normal">Дата заезда</p>
            <p className="text-base md:text-lg font-semibold text-[#2b6c70] underline truncate">{formatDate(checkIn)}</p>
          </div>
        </div>

        <div className="flex-1 md:max-w-52 h-14 md:h-16 px-3 md:px-4 bg-white/50 rounded-xl flex items-center gap-3 md:gap-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="15" rx="2" stroke="#2b6c70" strokeWidth="2"/>
            <path d="M3 10H21" stroke="#2b6c70" strokeWidth="2"/>
            <path d="M9 14L11 16L15 12" stroke="#2b6c70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs uppercase text-[#06272d] font-normal">Дата выезда</p>
            <p className="text-base md:text-lg font-semibold text-[#2b6c70] underline truncate">{formatDate(checkOut)}</p>
          </div>
        </div>

        <div className="flex-1 h-14 md:h-16 px-3 md:px-4 bg-white/50 rounded-xl flex items-center gap-3 md:gap-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#2b6c70" strokeWidth="2"/>
            <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="#2b6c70" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs uppercase text-[#06272d] font-normal">Гости</p>
            <div className="flex gap-2 md:gap-4 text-sm md:text-lg text-[#2b6c70]">
              <p className="truncate">
                <span className="font-semibold underline">{adults}</span>
                <span className="font-normal"> Взрослые</span>
              </p>
              <p className="truncate">
                <span className="font-semibold underline">{children}</span>
                <span className="font-normal"> Дети</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="h-14 md:h-16 px-5 md:px-6 rounded-xl bg-white text-[#2b6c70] uppercase text-sm font-normal hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        Поиск
      </button>
    </div>
  );
}
