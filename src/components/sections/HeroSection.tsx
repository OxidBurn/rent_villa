'use client'

import SearchForm from '@/components/forms/SearchForm'
import type { SearchFormData } from '@/types/search'

export default function HeroSection() {
  const handleSearch = (_data: SearchFormData) => {
    // TODO: Implement search functionality
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 md:py-20 px-4 md:px-8">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/luxury-beachfront-villa-with-infinity-pool 1.png")',
        }}
      />

      <div className="relative z-10 w-full max-w-screen-2xl pt-24 md:pt-32 lg:pt-40">
        <div className="max-w-5xl px-4 md:px-8 lg:pl-24">
          <h1
            className="font-display font-medium leading-[1.1] uppercase text-[#06272d] mb-4 md:mb-6 whitespace-nowrap"
            style={{ fontSize: 'var(--font-size-hero-lg)' }}
          >
            <span className="block">Откройте для себя</span>
            <span className="block">
              <span className="font-bold italic text-[#d48e1e]">Prime villa</span> для
            </span>
            <span className="block">отдыха в разных</span>
            <span className="block">уголках мира</span>
          </h1>
          <p className="text-base md:text-lg text-[#06272d] font-normal">
            * Стоимость аренды от 700 EUR
          </p>
        </div>
      </div>

      <div className="relative z-10 flex justify-center w-full px-4">
        <SearchForm onSearch={handleSearch} />
      </div>
    </section>
  )
}
