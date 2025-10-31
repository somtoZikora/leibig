import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { MessageSquare, Sparkles } from 'lucide-react'

const VinolinBanner = () => {
  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="#" className="block">
          <div className="bg-gradient-to-r from-amber-600 to-red-700 rounded-2xl p-8 md:p-12 text-white hover:shadow-xl transition-shadow">
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
                className="bg-white text-amber-700 hover:bg-[rgba(139,115,85,0.1)] font-bold text-lg px-8 py-6 flex items-center gap-2 flex-shrink-0"
              >
                <MessageSquare className="w-5 h-5" />
                Direkt zum Chat
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default VinolinBanner
