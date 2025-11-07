
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
import SektSection from '@/components/sekt-section';
import BrowseByTaste from '@/components/browse-by-taste';
import VinolinBanner from '@/components/vinolin-banner';
import GeschenkBundles from '@/components/geschenk-bundles';
import OurStory from '@/components/our-story';
import CustomerTestimonials from '@/components/customer-testimonials';
import FeaturesSection from '@/components/features-section';
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, buttonAnimationProps, transitions } from '@/lib/animations'
export default function Home() {

  const [isSearchOpen, setIsSearchOpen] = useState(false)
 
  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden pt-16 md:pt-32 lg:pt-40">
        <HeroBanner />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={staggerItem}>
            <WineCntent/>
          </motion.div>

          <motion.div variants={staggerItem}>
            <ProductStarterSets />
          </motion.div>

          <motion.div variants={staggerItem}>
            <WineProcessSection />
          </motion.div>

          <motion.div variants={staggerItem}>
            <WineSections />
          </motion.div>

          <motion.div variants={staggerItem}>
            <SektSection />
          </motion.div>

          <motion.div variants={staggerItem}>
            <BrowseByTaste />
          </motion.div>

          <motion.div variants={staggerItem}>
            <VinolinBanner />
          </motion.div>

          <motion.div variants={staggerItem}>
            <GeschenkBundles />
          </motion.div>

          <motion.div variants={staggerItem}>
            <OurStory />
          </motion.div>

          <motion.div variants={staggerItem}>
            <CustomerTestimonials />
          </motion.div>

          <motion.div variants={staggerItem}>
            <FeaturesSection />
          </motion.div>
        </motion.div>

        <motion.div
          {...buttonAnimationProps}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, ...transitions.spring }}
        >
          <Button
            onClick={() => setIsSearchOpen(true)}
            className="fixed bottom-6 right-4 z-40 bg-black text-white rounded-full h-14 w-14 p-0 shadow-lg hover:bg-[rgba(139,115,85,0.8)]"
          >
            <Search className="h-6 w-6" />
          </Button>
        </motion.div>

        <SearchBanner isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </>
  );
}
