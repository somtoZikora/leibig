
'use client'
import HeroBanner from '@/components/HeroBanner';
import SearchBanner from '@/components/SearchBanner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search } from "lucide-react"
import WineCntent from '@/components/wine-content';
import { WineSections } from '@/components/wine-sections';
import WineProcessSection from '@/components/wine-process';
import ProductStarterSets from '@/components/ProductStarterSets';
import BrowseByTaste from '@/components/browse-by-taste';
import OurStory from '@/components/our-story';
import CustomerTestimonials from '@/components/customer-testimonials';
export default function Home() {

  const [isSearchOpen, setIsSearchOpen] = useState(false)
 
  return (

    <>
   <main className="min-h-screen">
      <HeroBanner />

      <WineCntent/>

      <Button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-black text-white hover:bg-gray-800 rounded-full h-14 w-14 p-0 shadow-lg"
      >
        <Search className="h-6 w-6" />
      </Button>

      <SearchBanner isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} /> 
      <WineSections />
      <WineProcessSection />
        <ProductStarterSets  />
         <BrowseByTaste />
         <OurStory />
        <CustomerTestimonials />
    </main>
   
</>
    
  );
}
