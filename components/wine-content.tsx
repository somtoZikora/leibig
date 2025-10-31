import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

const WineCntent = () => {
  return (
    <div className="text-center space-y-8 p-8 md:p-16 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
        Von der Steillage ins Glas: Präzise. Handgemacht. Unvervwechselbar.
      </h2>

      <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-base md:text-lg lg:text-xl">
        Bei Kirsten-Liebieg entstehen Weine dort, wo Maschinen aufgeben: Steillagen, reine Handarbeit
        und Tradition machen jede Flasche zum Unikat. Darum ist unser Wein ein Stück Mosel, das du dir
        jetzt nach Hause holen kannst.
      </p>

      <div className="pt-4">
        <Link href="/shop">
          <Button
            size="lg"
            className="bg-black text-white hover:bg-[rgba(139,115,85,0.8)] text-lg px-8 py-6"
          >
            Zum Sortiment
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default WineCntent