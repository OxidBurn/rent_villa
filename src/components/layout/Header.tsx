'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 py-5 md:px-8 lg:px-12 transition-all duration-300 ${
      isScrolled ? 'bg-white/[0.14] backdrop-blur-md' : ''
    }`}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="url(#waterGradient)"/>
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cb8e38" />
                  <stop offset="100%" stopColor="#d1b04b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display font-semibold italic text-2xl lg:text-3xl uppercase bg-gradient-to-r from-[#cb8e38] to-[#d1b04b] bg-clip-text text-transparent hidden sm:inline">
            Prime villa
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-12">
          <div className="relative">
            <button
              onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
              className={`flex items-center gap-3 px-4 lg:px-5 py-3 rounded-xl bg-white/[0.14] backdrop-blur-md uppercase text-sm font-normal hover:bg-white/20 transition-all ${
                isScrolled ? 'text-[#06272d]' : 'text-white'
              }`}
            >
              <span className="hidden lg:inline">Направления</span>
              <span className="lg:hidden">Направ.</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <Link href="/about" className={`uppercase text-sm font-normal hover:opacity-80 transition-all ${
            isScrolled ? 'text-[#06272d]' : 'text-white'
          }`}>
            О нас
          </Link>
          <Link href="/contacts" className={`uppercase text-sm font-normal hover:opacity-80 transition-all ${
            isScrolled ? 'text-[#06272d]' : 'text-white'
          }`}>
            Контакты
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:gap-4">
          <div className={`px-3 lg:px-4 py-3 rounded-xl bg-white/[0.14] backdrop-blur-md uppercase text-sm font-normal transition-colors ${
            isScrolled ? 'text-[#06272d]' : 'text-white'
          }`}>
            RU
          </div>
          <Link
            href="/booking"
            className="px-4 lg:px-5 py-3 rounded-xl bg-gradient-to-r from-[#cb8e38] to-[#d1b04b] text-white uppercase text-sm font-normal hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span className="hidden sm:inline">Бронируй сейчас</span>
            <span className="sm:hidden">Бронь</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
