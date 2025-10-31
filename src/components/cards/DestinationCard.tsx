import Image from 'next/image';
import { Destination } from '@/types/destination';

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
}

export default function DestinationCard({ destination, onClick }: DestinationCardProps) {
  return (
    <div className="flex flex-col gap-4 group/dest cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg group-hover/dest:shadow-2xl transition-shadow duration-300">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-500 group-hover/dest:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/dest:opacity-100 transition-opacity duration-300" />
        <button
          onClick={onClick}
          className="absolute bottom-3 right-3 px-6 md:px-7 py-2 md:py-3 rounded-xl bg-white/[0.14] backdrop-blur-md text-white uppercase text-sm hover:bg-white/30 hover:scale-105 transition-all duration-300"
        >
          Все виллы
        </button>
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        <h3 className="font-display font-medium text-xl md:text-2xl lg:text-3xl uppercase text-[#06272d]">
          {destination.name}
        </h3>
        <div className="flex items-center gap-2">
          <Image src="/house-flood 1.svg" alt="" width={24} height={24} />
          <p className="text-base md:text-lg text-[#2b6c70]">
            {destination.villaCount}+ Вилл
          </p>
        </div>
      </div>
    </div>
  );
}
