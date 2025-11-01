'use client'

import { useState } from 'react'

import Image from 'next/image'

import VillaCard from '@/components/cards/VillaCard'
import type { Villa } from '@/types/villa'

const popularVillas: Villa[] = [
  {
    id: '1',
    title: 'La Palmeraie Asian House',
    location: 'Багамы',
    description: 'На побережье Багам — утончённая роскошь в окружении тропического покоя.',
    image: '/image 1.png',
    category: 'unique',
    maxGuests: 56,
    bedrooms: 33,
    bathrooms: 15,
    aspectRatio: 'aspect-[560/372]',
  },
  {
    id: '2',
    title: "Villa Poseidon's Perch",
    location: 'Ойл Нат Бэй, Вирджин Горда',
    description:
      'Роскошный "водный дворец" на вершине хребта, откуда открываются захватывающие бирюзовые виды на Атлантический океан.',
    image: '/image 2.png',
    category: 'beachfront',
    maxGuests: 24,
    bedrooms: 10,
    bathrooms: 7,
    aspectRatio: 'aspect-square',
  },
  {
    id: '3',
    title: 'Arnalaya Beach House',
    location: 'Чангу, Бали',
    description:
      'Это божественная резиденция современного дизайна, раскинувшаяся на побережье в окружении тропического великолепия, где утонченная роскошь сочетается с беззаботным ритмом океанских волн.',
    image: '/image 3.png',
    category: 'premium',
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 15,
    aspectRatio: 'aspect-[560/374]',
  },
]

export default function PopularVillas() {
  const [_currentIndex, _setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    _setCurrentIndex((prev) => (prev > 0 ? prev - 1 : popularVillas.length - 1))
  }

  const handleNext = () => {
    _setCurrentIndex((prev) => (prev < popularVillas.length - 1 ? prev + 1 : 0))
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="max-w-3xl">
            <h2 className="font-display font-medium text-2xl md:text-3xl lg:text-4xl uppercase text-[#06272d] mb-2">
              Наши самые{' '}
              <span className="font-bold italic text-[#d48e1e]">востребованные виллы</span>
            </h2>
            <p className="text-sm md:text-base text-[#06272d]">
              Выбор гостей, ценящих комфорт и стиль.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-[#eff4f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Previous villa"
            >
              <Image src="/angle-left 1.svg" alt="" width={24} height={24} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-[#eff4f5] flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Next villa"
            >
              <Image src="/angle-right 1.svg" alt="" width={24} height={24} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-8 lg:-mx-12">
          <div className="flex gap-5 px-4 md:px-8 lg:px-12 pb-4">
            {popularVillas.map((villa) => (
              <div key={villa.id} className="flex-shrink-0 w-5/6 sm:w-3/5 md:w-1/2 lg:w-2/5">
                <VillaCard villa={villa} onClick={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
