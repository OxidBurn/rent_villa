'use client'

import CategoryCard from '@/components/cards/CategoryCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

const collectionColumns = [
  [
    {
      id: 'beachfront',
      title: 'Виллы на берегу моря',
      description: 'Менее чем в 50 м от пляжа.',
      image: '/michaela-rimakova-qag4XNmJtmk-unsplash 1.png',
      icon: '/water 1.svg',
      aspectRatio: 'aspect-[580/430]',
    },
    {
      id: 'unique',
      title: 'Уникальные виллы',
      description: 'Аренда виллы с неповторимым дизайном.',
      image: '/erik-mclean-x9QjqCCJLAA-unsplash 1.png',
      icon: '/bahai 1.svg',
      aspectRatio: 'aspect-[580/320]',
    },
  ],
  [
    {
      id: 'premium',
      title: 'Виллы премиум-класса',
      description: 'Самые роскошные варианты аренды.',
      image: '/ciudad-maderas-MXbM1NrRqtI-unsplash 1.png',
      icon: '/crown 1.svg',
      aspectRatio: 'aspect-[580/320]',
    },
    {
      id: 'chalet',
      title: 'Шале',
      description: 'Роскошные апартаменты в горах.',
      image: '/zhu-yunxiao-jxGRh8pdcEQ-unsplash 1.png',
      icon: '/mountains 1.svg',
      aspectRatio: 'aspect-[580/430]',
    },
  ],
]

export default function VillaCollections() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-display font-medium text-2xl md:text-3xl lg:text-4xl uppercase text-[#06272d] mb-2">
            От уединённых до премиальных -{' '}
            <span className="font-bold italic text-[#2b6c70]">найдите свою виллу</span>
          </h2>
          <p className="text-sm md:text-base text-[#06272d]">
            Насладитесь моментом — остальное мы возьмём на себя.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-5 mb-8 md:mb-12">
          {collectionColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex flex-col gap-8 md:gap-12 flex-1 w-full md:w-auto md:max-w-none"
            >
              {column.map((collection, itemIndex) => (
                <ScrollReveal
                  key={collection.id}
                  delay={columnIndex * 100 + itemIndex * 150}
                  direction={columnIndex % 2 === 0 ? 'up' : 'down'}
                >
                  <CategoryCard
                    title={collection.title}
                    description={collection.description}
                    image={collection.image}
                    icon={collection.icon}
                    aspectRatio={collection.aspectRatio}
                    onClick={() => {}}
                  />
                </ScrollReveal>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-[#cb8e38] to-[#d1b04b] text-white uppercase text-sm md:text-base font-normal hover:shadow-xl hover:scale-105 transition-all duration-300">
            Открыть все предложения
          </button>
        </div>
      </div>
    </section>
  )
}
