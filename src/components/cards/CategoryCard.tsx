'use client'

import Image from 'next/image'

interface CategoryCardProps {
  title: string
  description: string
  image: string
  icon: string
  aspectRatio?: string
  onClick?: () => void
}

export default function CategoryCard({
  title,
  description,
  image,
  icon,
  aspectRatio = 'aspect-[4/3]',
  onClick,
}: CategoryCardProps) {
  return (
    <div className="flex flex-col gap-4 h-full group/card cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div
        className={`relative w-full ${aspectRatio} rounded-xl overflow-hidden shadow-lg group-hover/card:shadow-2xl transition-shadow duration-300`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        <button
          onClick={onClick}
          className="absolute bottom-3 right-3 px-6 md:px-7 py-2 md:py-3 rounded-xl bg-white/[0.14] backdrop-blur-md text-white uppercase text-sm hover:bg-white/30 hover:scale-105 transition-all duration-300"
        >
          Открыть подборку
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3.5">
          <Image src={icon} alt="" width={24} height={24} />
          <h3 className="font-display font-medium text-xl md:text-2xl lg:text-3xl uppercase text-[#06272d]">
            {title}
          </h3>
        </div>
        <p className="text-sm md:text-base text-[#2b6c70]">{description}</p>
      </div>
    </div>
  )
}
