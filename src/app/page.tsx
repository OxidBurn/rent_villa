import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import AboutSection from '@/components/sections/AboutSection'
import Destinations from '@/components/sections/Destinations'
import HeroSection from '@/components/sections/HeroSection'
import PopularVillas from '@/components/sections/PopularVillas'
import TravelWorld from '@/components/sections/TravelWorld'
import VillaCollections from '@/components/sections/VillaCollections'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <PopularVillas />
        <VillaCollections />
        <Destinations />
        <TravelWorld />
      </main>
      <Footer />
    </div>
  )
}
