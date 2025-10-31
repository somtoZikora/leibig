"use client"
import { Mail, Instagram, Twitter, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
   <footer
     className="w-full relative"
   >
    {/* Newsletter Section - 50% Overlap */}
    <div
      className="relative -mb-20 md:-mb-24 z-10"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div
          className="bg-black text-white px-6 py-8 md:px-8 md:py-12 rounded-3xl shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div
              className="flex-1"
            >
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                BLEIBEN SIE ÜBER UNSERE
                <br />
                NEUESTEN ANGEBOTE
                <br />
                INFORMIERT
              </h2>
            </div>
            <div
              className="flex flex-col gap-3 md:w-80"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  className="pl-10 bg-white text-black border-0 rounded-full h-12"
                />
              </div>
              <div>
                <Button className="bg-white text-black rounded-full h-12 font-medium hover:bg-[rgba(139,115,85,0.1)]">
                  Newsletter abonnieren
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  {/* Main Footer Content */}
  <div
    className="bg-[rgba(139,115,85,0.1)] py-8 md:py-12"
  >
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
      <div
        className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6"
      >
        {/* Brand Section */}
        <div
          className="text-center md:text-left md:w-1/5"
        >
          <div
            className="mb-4"
          >
            <Image
              src="/images/Kirsten-Liebieg_Logo.png"
              alt="Kirsten Liebieg Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Wir haben die besten Weine für jeden Anlass
          </p>
          <div className="flex gap-3">
            {[
              { icon: <Twitter className="h-4 w-4 text-white" />, key: 'twitter' },
              { icon: <span className="text-white text-xs font-bold">f</span>, key: 'facebook' },
              { icon: <Instagram className="h-4 w-4 text-white" />, key: 'instagram' },
              { icon: <Github className="h-4 w-4 text-white" />, key: 'github' }
            ].map((social) => (
              <div
                key={social.key}
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>

        {/* UNTERNEHMEN */}
        <div className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">UNTERNEHMEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <Link href="/ueber-uns" className="hover:text-black transition-colors">Über uns</Link>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">Funktionen</a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">Funktioniert</a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">Karriere</a>
            </li>
          </ul>
        </div>

        {/* HILFE */}
        <div className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">HILFE</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Kundensupport', 'Lieferdetails', 'Allgemeine Geschäftsbedingungen', 'Datenschutzrichtlinie'].map((item) => (
              <li
                key={item}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">FAQ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Konto', 'Lieferungen verwalten', 'Bestellungen', 'Zahlungen'].map((item) => (
              <li
                key={item}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* RESSOURCEN */}
        <div className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">RESSOURCEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Kostenlose eBooks', 'Entwicklungstutorial', 'Wie man - Blog', 'Youtube-Playlist'].map((item) => (
              <li
                key={item}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between mt-12 pt-8 border-t border-gray-300"
      >
        <p
          className="text-sm text-gray-600 mb-4 md:mb-0"
        >
          liebig © 2000-2023, Alle Rechte vorbehalten
        </p>
        <div
          className="flex items-center gap-3"
        >
          {[
            { src: "/images/visa-logo.png", alt: "Visa" },
            { src: "/images/mastercard-logo.png", alt: "Mastercard" },
            { src: "/images/paypal-logo.png", alt: "PayPal" },
            { src: "/images/apple-pay-logo.png", alt: "Apple Pay" },
            { src: "/images/google-pay-logo.png", alt: "Google Pay" }
          ].map((logo) => (
            <div
              key={logo.alt}
            >
              <Image src={logo.src} alt={logo.alt} width={57} height={43} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</footer>

  )
}
