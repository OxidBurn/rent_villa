import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import PopularVillas from '@/components/sections/PopularVillas';
import AboutSection from '@/components/sections/AboutSection';
import VillaCollections from '@/components/sections/VillaCollections';
import Destinations from '@/components/sections/Destinations';
import TravelWorld from '@/components/sections/TravelWorld';

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
  );
}
