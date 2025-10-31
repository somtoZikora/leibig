import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

const GeschenkBundles = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <span className="text-6xl font-bold text-orange-600">Gift</span>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
              LIMITED TIME
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
              Unsere Geschenk-Bundles
            </h2>

            <p className="text-xl md:text-2xl text-gray-700">
              Freude, die bleibt
            </p>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Überrasche deine Liebsten mit sorgfältig zusammengestellten Wein- und Sekt-Bundles. Perfekt verpackt, mit Liebe ausgewählt – ein Geschenk, das von Herzen kommt und lange in Erinnerung bleibt.
            </p>

            <div className="pt-4">
              <Link href="/shop?category=geschenke">
                <Button
                  size="lg"
                  className="bg-black text-white text-lg px-8 py-6 hover:bg-[rgba(139,115,85,0.8)]"
                >
                  Jetzt verschenken
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GeschenkBundles
