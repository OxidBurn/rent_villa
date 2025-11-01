import Image from 'next/image'

import IconText from '@/components/ui/IconText'
import type { Villa } from '@/types/villa'

interface VillaCardProps {
  villa: Villa
  onClick?: () => void
}

const categoryConfig = {
  unique: {
    label: 'Уникальные',
    icon: '/bahai 1.svg',
    bgColor: 'bg-[#06272d]',
    textColor: 'text-white',
  },
  beachfront: {
    label: 'Берег моря',
    icon: '/water 1.svg',
    bgColor: 'bg-[#bbdce5]',
    textColor: 'text-[#06272d]',
  },
  premium: {
    label: 'Премиум класс',
    icon: '/crown 1.svg',
    bgColor: 'bg-[#fee2ad]',
    textColor: 'text-[#06272d]',
  },
  chalet: {
    label: 'Шале',
    icon: '/mountains 1.svg',
    bgColor: 'bg-gray-200',
    textColor: 'text-[#06272d]',
  },
}

export default function VillaCard({ villa, onClick }: VillaCardProps) {
  const config = categoryConfig[villa.category]

  return (
    <div className="flex flex-col gap-4 w-full group/villa cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="flex flex-col gap-2 relative">
        <div
          className={`${config.bgColor} ${config.textColor} flex items-center gap-2 px-3 py-1 rounded-full w-fit uppercase text-sm md:text-base transition-transform duration-300 group-hover/villa:scale-105`}
        >
          <Image src={config.icon} alt="" width={16} height={16} />
          <span>{config.label}</span>
        </div>

        <div
          className={`relative w-full ${villa.aspectRatio || 'aspect-[4/3]'} rounded-xl overflow-hidden shadow-lg group-hover/villa:shadow-2xl transition-shadow duration-300`}
        >
          <Image
            src={villa.image}
            alt={villa.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/villa:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/villa:opacity-100 transition-opacity duration-300" />
          <button
            onClick={onClick}
            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-6 md:px-7 py-2 md:py-3 rounded-xl bg-white/[0.14] backdrop-blur-md text-white uppercase text-sm hover:bg-white/30 hover:scale-105 transition-all duration-300"
          >
            Подробнее
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src="/marker 1.svg" alt="" width={24} height={24} />
          <p className="text-base md:text-lg text-[#2b6c70] underline">{villa.location}</p>
        </div>

        <div className="flex flex-col gap-1 md:gap-2">
          <h3 className="font-display font-medium text-xl md:text-2xl lg:text-3xl uppercase text-[#06272d]">
            {villa.title}
          </h3>
          <p className="text-sm md:text-base text-[#06272d] leading-relaxed">{villa.description}</p>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6">
          <IconText icon="/user 1.svg" text=" Гостей" highlighted={`До ${villa.maxGuests}`} />
          <IconText icon="/bed-alt 1.svg" text=" Спальни" highlighted={`${villa.bedrooms}`} />
          <IconText icon="/bath 1.svg" text=" Ванных комнат" highlighted={`${villa.bathrooms}`} />
        </div>
      </div>
    </div>
  )
}
