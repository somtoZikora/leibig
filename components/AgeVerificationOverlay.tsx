'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AgeVerificationOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const AGE_VERIFICATION_KEY = 'age_verified';

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (!hasVerified) {
      setIsVisible(true);
      // Prevent scrolling when overlay is visible
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    } else {
      // Redirect to Google
      window.location.href = 'https://www.google.de';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center justify-center max-w-2xl px-6 text-center">
            {/* Logo */}
            <div className="mb-12">
              <Image
                src="/images/Kirsten-Liebieg_Logo.png"
                alt="Kirsten Liebieg Logo"
                width={300}
                height={100}
                className="h-auto w-64 md:w-80"
                priority
              />
            </div>

            {/* Message */}
            <div className="mb-12 space-y-2">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                Sie müssen
              </h2>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                über 18 Jahre
              </h2>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                alt sein.
              </h2>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
              <button
                onClick={() => handleVerify(true)}
                className="bg-[#8B7355] hover:bg-[#6F5B44] text-white px-8 py-3 text-sm md:text-base font-medium transition-colors duration-200 rounded-md"
              >
                Ja, ich bin volljährig
              </button>
              <button
                onClick={() => handleVerify(false)}
                className="bg-[#8B7355] hover:bg-[#6F5B44] text-white px-8 py-3 text-sm md:text-base font-medium transition-colors duration-200 rounded-md"
              >
                Nein, ich bin nicht volljährig
              </button>
            </div>

            {/* Legal text */}
            <div className="text-sm md:text-base text-gray-600 max-w-xl space-y-4 font-light leading-relaxed">
              <p>
                Als Hersteller eines alkoholhaltigen Getränks wissen wir um unsere
                Verantwortung gegenüber der Gesellschaft und den Menschen, die unsere
                Produkte genießen. Der Schutz Minderjähriger ist uns dabei besonders wichtig.
              </p>
              <p>
                Unsere Website richtet sich ausschließlich an Erwachsene, die das gesetzlich
                vorgeschriebene Mindestalter für den Konsum alkoholhaltiger Getränke erreicht haben.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
