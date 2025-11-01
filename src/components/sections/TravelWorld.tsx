'use client'

import Image from 'next/image'

import ScrollReveal from '@/components/ui/ScrollReveal'

const destinationColumns = [
  [
    {
      id: 'greece',
      name: 'Греция',
      description: 'Очарование древности и безмятежности.',
      image: '/hans-reniers-DELDTYAjPrg-unsplash 1.png',
      aspectRatio: 'aspect-[380/260]',
    },
    {
      id: 'france',
      name: 'Франция',
      description: 'Романтика, стиль и безупречный вкус жизни.',
      image: '/jad-limcaco-NT1mJPgni6A-unsplash 1.png',
      aspectRatio: 'aspect-[380/340]',
    },
  ],
  [
    {
      id: 'indonesia',
      name: 'Индонезия',
      description: 'Баланс природы, роскоши и спокойствия.',
      image: '/jeremy-bishop-QUwLZNchflk-unsplash 1.png',
      aspectRatio: 'aspect-[380/340]',
    },
    {
      id: 'thailand',
      name: 'Таиланд',
      description: 'Тропический рай с восточным шармом.',
      image: '/humphrey-m-TejFa7VW5e4-unsplash 1.png',
      aspectRatio: 'aspect-[380/260]',
    },
  ],
  [
    {
      id: 'italy',
      name: 'Италия',
      description: 'Искусство жить красиво.',
      image: '/braden-collum-75XHJzEIeUc-unsplash 1.png',
      aspectRatio: 'aspect-[380/260]',
    },
    {
      id: 'mexico',
      name: 'Мексика',
      description: 'След древних цивилизаций.',
      image: '/pyro-jenka-7g4afdiVhF8-unsplash 1.png',
      aspectRatio: 'aspect-[380/340]',
    },
  ],
]

export default function TravelWorld() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-display font-medium text-2xl md:text-3xl lg:text-4xl uppercase text-[#06272d] mb-2">
            <span className="font-bold italic text-[#2b6c70]">Мир</span> наших путешествий
          </h2>
          <p className="text-sm md:text-base text-[#06272d]">
            От лазурных берегов до экзотических островов — выберите своё направление.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-5 lg:gap-5">
          {destinationColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-8 md:gap-12 flex-1">
              {column.map((destination, itemIndex) => (
                <ScrollReveal
                  key={destination.id}
                  delay={columnIndex * 100 + itemIndex * 150}
                  direction={columnIndex % 2 === 0 ? 'up' : 'down'}
                >
                  <div className="flex flex-col gap-3 md:gap-4 group/travel cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                    <div
                      className={`relative w-full ${destination.aspectRatio} rounded-xl overflow-hidden shadow-lg group-hover/travel:shadow-2xl transition-shadow duration-300`}
                    >
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/travel:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/travel:opacity-100 transition-opacity duration-300" />
                      <button
                        onClick={() => {}}
                        className="absolute bottom-3 right-3 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/[0.14] backdrop-blur-md flex items-center justify-center hover:bg-white/30 hover:scale-110 hover:rotate-12 transition-all duration-300"
                        aria-label={`View ${destination.name}`}
                      >
                        <Image src="/arrow-right 1.svg" alt="" width={24} height={24} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 md:gap-2">
                      <h3 className="font-display font-medium text-xl md:text-2xl lg:text-3xl uppercase text-[#06272d]">
                        {destination.name}
                      </h3>
                      <p className="text-sm md:text-base text-[#2b6c70]">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
