'use client'

import { useState } from 'react'

import Image from 'next/image'

import DestinationCard from '@/components/cards/DestinationCard'
import type { Destination } from '@/types/destination'

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Бали',
    description: '',
    image: '/vacation-tree-holiday-maldives-islands 1.png',
    villaCount: 580,
  },
  {
    id: '2',
    name: 'Мальдивы',
    description: '',
    image: '/vacation-tree-holiday-maldives-islands 1-1.png',
    villaCount: 30,
  },
  {
    id: '3',
    name: 'Пхукет',
    description: '',
    image: '/vacation-tree-holiday-maldives-islands 1-2.png',
    villaCount: 110,
  },
  {
    id: '4',
    name: 'Коста-Рика',
    description: '',
    image: '/vacation-tree-holiday-maldives-islands 1-3.png',
    villaCount: 20,
  },
]

export default function Destinations() {
  const [_currentIndex, _setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    _setCurrentIndex((prev) => (prev > 0 ? prev - 1 : destinations.length - 1))
  }

  const handleNext = () => {
    _setCurrentIndex((prev) => (prev < destinations.length - 1 ? prev + 1 : 0))
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="max-w-3xl">
            <h2 className="font-display font-medium text-2xl md:text-3xl lg:text-4xl uppercase text-[#06272d] mb-2">
              <span className="font-bold italic text-[#d48e1e]">Рекомендуемые</span> направления для
              вас
            </h2>
            <p className="text-sm md:text-base text-[#06272d]">
              Откройте для себя лучшие уголки мира.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Previous destination"
            >
              <Image src="/angle-left 1.svg" alt="" width={24} height={24} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Next destination"
            >
              <Image src="/angle-right 1.svg" alt="" width={24} height={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={() => {
                // TODO: Handle destination click
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
