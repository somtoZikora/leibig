'use client'
import React from 'react'
import { Button } from './ui/button'
import { MessageSquare, Sparkles } from 'lucide-react'

const VinolinBanner = () => {
  const handleOpenVinolin = () => {
    // Trigger Vinolin chat widget by setting the hash
    window.location.hash = '#open_vinolin'
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          onClick={handleOpenVinolin}
          className="cursor-pointer bg-gradient-to-r from-[#C9A961] to-[#C9A940] rounded-2xl p-8 md:p-12 text-white hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left content */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Vinolin - Dein KI Sommelier</h3>
                <p className="text-lg text-white/90">Frag mich alles über Wein. Ich helfe dir bei der perfekten Auswahl!</p>
              </div>
            </div>

            {/* Right CTA */}
            <Button
              size="lg"
              className="bg-gray-200 text-[#C9A961] hover:bg-[rgba(139,115,85,0.1)] font-bold text-lg px-8 py-6 flex items-center gap-2 flex-shrink-0"
            >
              <MessageSquare className="w-5 h-5" />
              Direkt zum Chat
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VinolinBanner
