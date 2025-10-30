import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

const SektSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
        {/* Left side - Image */}
        <div className="relative h-[500px] lg:h-auto lg:min-h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1726884979037-b99073044196?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287"
            alt="Champagne being poured"
            fill
            className="object-cover rounded-l-lg"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="bg-[#C9A961] p-8 lg:p-12 rounded-r-lg flex flex-col justify-center text-white">
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
              <Link href="/shop?category=sekt">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6"
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
