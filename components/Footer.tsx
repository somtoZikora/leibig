import { Mail, Instagram, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Footer() {
  return (
   <footer className="w-full">
  {/* Newsletter Section */}
  <div className="px-4 py-8 md:py-12">
    <div className="max-w-7xl mx-auto">
      <div className="bg-black text-white px-6 py-8 md:px-8 md:py-12 rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              BLEIBEN SIE ÜBER UNSERE
              <br />
              NEUESTEN ANGEBOTE
              <br />
              INFORMIERT
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:w-80">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                className="pl-10 bg-white text-black border-0 rounded-full h-12"
              />
            </div>
            <Button className="bg-white text-black hover:bg-gray-100 rounded-full h-12 font-medium">
              Newsletter abonnieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Main Footer Content */}
  <div className="bg-gray-100 px-4 py-8 md:py-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="md:col-span-1">
          <div className="mb-4">
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
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">f</span>
            </div>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* UNTERNEHMEN */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wider">UNTERNEHMEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Über uns</a></li>
            <li><a href="#" className="hover:text-black">Funktionen</a></li>
            <li><a href="#" className="hover:text-black">Funktioniert</a></li>
            <li><a href="#" className="hover:text-black">Karriere</a></li>
          </ul>
        </div>

        {/* HILFE */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wider">HILFE</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Kundensupport</a></li>
            <li><a href="#" className="hover:text-black">Lieferdetails</a></li>
            <li><a href="#" className="hover:text-black">Allgemeine Geschäftsbedingungen</a></li>
            <li><a href="#" className="hover:text-black">Datenschutzrichtlinie</a></li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wider">FAQ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Konto</a></li>
            <li><a href="#" className="hover:text-black">Lieferungen verwalten</a></li>
            <li><a href="#" className="hover:text-black">Bestellungen</a></li>
            <li><a href="#" className="hover:text-black">Zahlungen</a></li>
          </ul>
        </div>

        {/* RESSOURCEN */}
        <div>
          <h4 className="font-bold text-sm mb-4 tracking-wider">RESSOURCEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Kostenlose eBooks</a></li>
            <li><a href="#" className="hover:text-black">Entwicklungstutorial</a></li>
            <li><a href="#" className="hover:text-black">Wie man - Blog</a></li>
            <li><a href="#" className="hover:text-black">Youtube-Playlist</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-12 pt-8 border-t border-gray-300">
        <p className="text-sm text-gray-600 mb-4 md:mb-0">
          Kirsten Liebieg © 2000-2023, Alle Rechte vorbehalten
        </p>
        <div className="flex items-center gap-3">
          <Image src="/images/visa-logo.png" alt="Visa" width={57} height={43} />
          <Image src="/images/mastercard-logo.png" alt="Mastercard" width={57} height={43} />
          <Image src="/images/paypal-logo.png" alt="PayPal" width={57} height={43} />
          <Image src="/images/apple-pay-logo.png" alt="Apple Pay" width={57} height={43} />
          <Image src="/images/google-pay-logo.png" alt="Google Pay" width={57} height={43} />
        </div>
      </div>
    </div>
  </div>
</footer>

  )
}
