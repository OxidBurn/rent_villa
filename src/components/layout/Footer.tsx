import Image from 'next/image'

const villaCollections = [
  'Виллы на берегу моря',
  'Виллы премиум-класса',
  'Уникальные виллы',
  'Шале',
]

const destinations = ['Греция', 'Индонезия', 'Италия', 'Франция', 'Таиланд', 'Мексика']

const navigation = ['О нас', 'Контакты', 'Надежность и безопасность', 'Правила и условия']

export default function Footer() {
  return (
    <footer className="w-full py-8 md:py-12 lg:py-16">
      <div className="px-4 md:px-8 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Image
                src="/water 1.svg"
                alt=""
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
              />
              <h2 className="font-display font-semibold italic text-2xl md:text-3xl lg:text-[3rem] uppercase bg-gradient-to-r from-[#cb8e38] to-[#d1b04b] bg-clip-text text-transparent">
                Prime Villa
              </h2>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-8 lg:gap-16 px-0 md:px-8 lg:px-12">
                <div className="flex items-start gap-2 md:gap-3">
                  <Image src="/marker 1.svg" alt="" width={24} height={24} className="shrink-0" />
                  <div className="text-sm md:text-base lg:text-lg text-[#06272d]">
                    <p>One Pacific Place | Admiralty | Hong Kong</p>
                    <p>88 Queensway, 75H8+35</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/phone-call 1.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <p className="text-sm md:text-base lg:text-lg text-[#06272d] whitespace-nowrap">
                    +852 55162286 | +852 55162286
                  </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Image src="/envelope 1.svg" alt="" width={24} height={24} className="shrink-0" />
                  <p className="text-sm md:text-base lg:text-lg text-[#06272d]">
                    support@primevilla.com
                  </p>
                </div>
              </div>

              <div className="bg-[#eff4f5] rounded-xl md:rounded-2xl px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
                  <div className="flex flex-col gap-3 md:gap-4">
                    <h3 className="font-display font-medium text-lg md:text-xl lg:text-2xl uppercase text-[#06272d]">
                      Коллекции вилл
                    </h3>
                    <ul className="flex flex-col gap-2 md:gap-3">
                      {villaCollections.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-xs md:text-sm text-[#2b6c70] uppercase hover:text-[#06272d] transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 md:gap-4">
                    <h3 className="font-display font-medium text-lg md:text-xl lg:text-2xl uppercase text-[#06272d]">
                      Направления
                    </h3>
                    <ul className="flex flex-col gap-2 md:gap-3">
                      {destinations.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-xs md:text-sm text-[#2b6c70] uppercase hover:text-[#06272d] transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 md:gap-4">
                    <h3 className="font-display font-medium text-lg md:text-xl lg:text-2xl uppercase text-[#06272d]">
                      Навигация
                    </h3>
                    <ul className="flex flex-col gap-2 md:gap-3">
                      {navigation.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-xs md:text-sm text-[#2b6c70] uppercase hover:text-[#06272d] transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col gap-3 md:gap-4">
                      <h3 className="font-display font-medium text-lg md:text-xl lg:text-2xl uppercase text-[#06272d]">
                        Оплата
                      </h3>
                      <div className="flex flex-col gap-1 md:gap-2">
                        <p className="text-xs md:text-sm font-semibold text-[#06272d] uppercase">
                          Современно, удобно и безопасно
                        </p>
                        <p className="text-xs md:text-sm font-semibold text-[#2b6c70]">
                          Мы принимаем Bitcoin, Ethereum и другие популярные валюты.
                        </p>
                      </div>
                      <div className="flex gap-3 md:gap-4">
                        <Image
                          src="/Cryptocurrency-footer.svg"
                          alt="Bitcoin"
                          width={44}
                          height={44}
                          className="w-9 h-9 md:w-11 md:h-11"
                        />
                        <Image
                          src="/Cryptocurrency-1-footer.svg"
                          alt="Ethereum"
                          width={44}
                          height={44}
                          className="w-9 h-9 md:w-11 md:h-11"
                        />
                        <Image
                          src="/Cryptocurrency-2-footer.svg"
                          alt="Tether"
                          width={44}
                          height={44}
                          className="w-9 h-9 md:w-11 md:h-11"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-4">
                      <p className="text-xs md:text-sm font-semibold text-[#06272d] uppercase">
                        Классический способ оплаты
                      </p>
                      <div className="flex gap-3 md:gap-4">
                        <Image
                          src="/Logotypes-footer.svg"
                          alt="Mastercard"
                          width={62}
                          height={44}
                          className="h-9 md:h-11 w-auto"
                        />
                        <Image
                          src="/Logotypes-1-footer.svg"
                          alt="Visa"
                          width={90}
                          height={44}
                          className="h-9 md:h-11 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm md:text-base text-[#06272d] text-center">
            Copyright © 2008-2025 By Prime Villa. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
