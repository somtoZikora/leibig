
'use client'
import HeroBanner from '@/components/HeroBanner';
import SearchBanner from '@/components/SearchBanner';
import { useState } from 'react';
import WineCntent from '@/components/wine-content';
import { WineSections } from '@/components/wine-sections';
import WineProcessSection from '@/components/wine-process';
import ProductStarterSets from '@/components/ProductStarterSets';
import SektSection from '@/components/sekt-section';
import BrowseByTaste from '@/components/browse-by-taste';
import VinolinBanner from '@/components/vinolin-banner';
import GeschenkBundles from '@/components/geschenk-bundles';
import OurStory from '@/components/our-story';
import VideoTestimonials from '@/components/video-testimonials';
import FeaturesSection from '@/components/features-section';
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
export default function Home() {

  const [isSearchOpen, setIsSearchOpen] = useState(false)
 
  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden">
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
            <VideoTestimonials />
          </motion.div>

          <motion.div variants={staggerItem}>
            <FeaturesSection />
          </motion.div>
        </motion.div>

        <SearchBanner isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </>
  );
}
