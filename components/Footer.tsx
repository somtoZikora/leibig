"use client"
import { Mail, Instagram, Twitter, Github, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setMessage({ type: 'error', text: 'Bitte geben Sie Ihre E-Mail-Adresse ein.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setEmail("") // Clear the email field on success
      } else {
        setMessage({ type: 'error', text: data.error || 'Ein Fehler ist aufgetreten.' })
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' })
    } finally {
      setIsLoading(false)
    }
  }

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
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 md:w-80">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                    className="pl-10 bg-white text-black border-0 rounded-full h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="bg-white text-black rounded-full h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full hover:bg-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Wird gesendet...' : 'Newsletter abonnieren'}
                  </Button>
                </div>
                {message && (
                  <div className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'} text-center`}>
                    {message.text}
                  </div>
                )}
              </form>
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
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="h-4 w-4 text-white" />, key: 'facebook', href: 'https://www.facebook.com/kirsten.liebieg' },
                  { icon: <Instagram className="h-4 w-4 text-white" />, key: 'instagram', href: 'https://www.instagram.com/kirsten.liebieg' },
                  { icon: <Youtube className="h-4 w-4 text-white" />, key: 'youtube', href: 'https://www.youtube.com/channel/UCMWljEfVL-nWyhmRyIW8COA' },
                ].map((social) => (
                  <Link href={social.href} target="_blank" key={social.key}>
                    <div
                      key={social.key}
                      className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
                    >
                      {social.icon}
                    </div>
                  </Link>
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
                  <a href="https://www.kirsten-liebieg.de/weingut/" target="_blank" className="hover:text-black transition-colors">Weingut</a>
                </li>
                <li>
                  <a href="https://www.kirsten-liebieg.de/impressum/" target="_blank" className="hover:text-black transition-colors">Impressum</a>
                </li>
                <li>
                  <a href="https://www.kirsten-liebieg.de/datenschutz/" target="_blank" className="hover:text-black transition-colors">Datenschutz</a>
                </li>
                <li>
                  <a href="https://www.kirsten-liebieg.de/eulle/" target="_blank" className="hover:text-black transition-colors">EULLE</a>
                </li>
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
                <li>
                  <a href="https://www.kirsten-liebieg.de/neuigkeiten/" target="_blank" className="hover:text-black transition-colors">Neuigkeiten</a>
                </li>
                <li ><a href="https://www.kirsten-liebieg.de/kontakt/" target="_blank" className="hover:text-black transition-colors">Kontakt</a></li>
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
              Kirsten Liebieg © {new Date().getFullYear()}, Alle Rechte vorbehalten
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
    </footer >

  )
}
