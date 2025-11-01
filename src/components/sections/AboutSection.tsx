'use client'

import Image from 'next/image'

import ScrollReveal from '@/components/ui/ScrollReveal'

export default function AboutSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {/* Top Section - About Prime Villa */}
          <ScrollReveal direction="up">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 items-center">
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <div className="relative w-full lg:w-[560px] aspect-[2/1] rounded-xl overflow-hidden">
                  <Image
                    src="/luxury-beachfront-villa-with-infinity-pool (1) 1.png"
                    alt="Prime Villa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 md:gap-6">
                <h2 className="font-display font-medium text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] leading-tight uppercase text-[#06272d]">
                  <span className="font-bold italic text-[#2b6c70]">Prime villa </span>- это
                  сочетание утончённого отдыха и современных технологий.
                </h2>
                <p className="text-sm md:text-base text-[#06272d] leading-relaxed">
                  Мы предлагаем роскошные виллы в самых живописных уголках мира и делаем процесс
                  бронирования максимально удобным.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom Section - Crypto Payment */}
          <ScrollReveal delay={200} direction="down">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 items-center lg:pl-16 xl:pl-32 2xl:pl-80">
              <div className="w-full lg:w-auto lg:flex-shrink-0 order-2 lg:order-1">
                <div className="relative w-full lg:w-[310px] aspect-[310/387] rounded-xl overflow-hidden">
                  <Image
                    src="/modern-cliffside-villa 1.png"
                    alt="Modern Villa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-10 order-1 lg:order-2">
                <div className="flex flex-col gap-4 md:gap-6">
                  <p className="text-base md:text-lg lg:text-xl text-[#2b6c70] leading-relaxed">
                    <span className="font-semibold">
                      Теперь вы можете арендовать виллу не только привычными способами, но и
                      оплатить проживание с помощью криптовалюты -{' '}
                    </span>
                    <span className="font-bold italic">Bitcoin, Ethereum или Tether</span>.
                  </p>

                  <div className="flex gap-4 md:gap-6 lg:gap-8">
                    <div className="relative w-9 h-9 md:w-12 md:h-12">
                      <Image
                        src="/Cryptocurrency-about.svg"
                        alt="Bitcoin"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="relative w-9 h-9 md:w-12 md:h-12">
                      <Image
                        src="/Cryptocurrency-1-about.svg"
                        alt="Ethereum"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="relative w-9 h-9 md:w-12 md:h-12">
                      <Image
                        src="/Cryptocurrency-2-about.svg"
                        alt="Tether"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-[#06272d] leading-relaxed">
                    Это просто, безопасно и отражает дух времени.
                  </p>
                </div>

                <p className="text-sm md:text-base text-[#06272d] leading-relaxed">
                  Добро пожаловать в современный формат путешествий с{' '}
                  <span className="font-bold italic text-[#2b6c70]">Prime Villa</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
