import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

const SektSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 items-stretch justify-center">
        {/* Left side - Image */}
        <div className="relative h-[500px] lg:min-h-full w-[500px] rounded-t-lg lg:rounded-t-none lg:rounded-l-lg overflow-hidden">
          <Image
            src="/Startseite/Sektwelt entdecken/Pinot Brut GIf.gif"
            alt="Champagne being poured"
            fill
            className="object-cover bg-red-500"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="bg-[#C9A961] p-8 lg:p-12 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg flex w-[700px] flex-col justify-center text-white">
          <div className="space-y-6">
            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              Prickelnd. Anders. Besser.
            </h2>

            {/* Body text */}
            <p className="text-base lg:text-lg leading-relaxed">
              In den anspruchsvollen Steillagen der Mosel beginnt die Reise unserer Sekte – handgelesen, traditionell vergoren und mit viel Geduld geschaffen. So entstehen prickelnde Begleiter für jeden Anlass. Ob Dinner, Hochzeit oder Geschenk: Hier findest du Sekt mit der unverkennbaren Handschrift von Kirsten-Liebieg.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/shop?category=sekte">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-[rgba(139,115,85,0.1)] text-lg px-8 py-6"
                >
                  Hol dir dein Prickeln
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SektSection
