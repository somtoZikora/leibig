"use client"
import { Mail, Instagram, Twitter, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion } from 'framer-motion'
import { footerVariants, staggerContainer, staggerItem, buttonAnimationProps, transitions } from '@/lib/animations'

export default function Footer() {
  return (
   <motion.footer 
     className="w-full relative"
     variants={footerVariants}
     initial="initial"
     animate="animate"
     transition={transitions.smooth}
   >
  {/* Newsletter Section */}
  <motion.div 
    className="py-8 md:py-12"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={transitions.smooth}
  >
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <motion.div 
        className="bg-black text-white px-6 py-8 md:px-8 md:py-12 rounded-3xl shadow-2xl"
        whileHover={{ scale: 1.02 }}
        transition={transitions.spring}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...transitions.smooth }}
          >
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              BLEIBEN SIE ÜBER UNSERE
              <br />
              NEUESTEN ANGEBOTE
              <br />
              INFORMIERT
            </h2>
          </motion.div>
          <motion.div 
            className="flex flex-col gap-3 md:w-80"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, ...transitions.smooth }}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                className="pl-10 bg-white text-black border-0 rounded-full h-12"
              />
            </div>
            <motion.div {...buttonAnimationProps}>
              <Button className="bg-white text-black hover:bg-gray-100 rounded-full h-12 font-medium">
                Newsletter abonnieren
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </motion.div>

  {/* Main Footer Content */}
  <motion.div 
    className="bg-gray-100 py-8 md:py-12 pt-20 md:pt-36"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay: 0.2, ...transitions.smooth }}
  >
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <motion.div 
        className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Brand Section */}
        <motion.div 
          className="text-center md:text-left md:w-1/5"
          variants={staggerItem}
        >
          <motion.div 
            className="mb-4"
            whileHover={{ scale: 1.05 }}
            transition={transitions.spring}
          >
            <Image
              src="/images/Kirsten-Liebieg_Logo.png"
              alt="Kirsten Liebieg Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </motion.div>
          <p className="text-gray-600 text-sm mb-6">
            Wir haben die besten Weine für jeden Anlass
          </p>
          <div className="flex gap-3">
            {[
              { icon: <Twitter className="h-4 w-4 text-white" />, key: 'twitter' },
              { icon: <span className="text-white text-xs font-bold">f</span>, key: 'facebook' },
              { icon: <Instagram className="h-4 w-4 text-white" />, key: 'instagram' },
              { icon: <Github className="h-4 w-4 text-white" />, key: 'github' }
            ].map((social, index) => (
              <motion.div
                key={social.key}
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, ...transitions.spring }}
              >
                {social.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* UNTERNEHMEN */}
        <motion.div variants={staggerItem} className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">UNTERNEHMEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Über uns', 'Funktionen', 'Funktioniert', 'Karriere'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ...transitions.quick }}
                whileHover={{ x: 5 }}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* HILFE */}
        <motion.div variants={staggerItem} className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">HILFE</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Kundensupport', 'Lieferdetails', 'Allgemeine Geschäftsbedingungen', 'Datenschutzrichtlinie'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ...transitions.quick }}
                whileHover={{ x: 5 }}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={staggerItem} className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">FAQ</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Konto', 'Lieferungen verwalten', 'Bestellungen', 'Zahlungen'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ...transitions.quick }}
                whileHover={{ x: 5 }}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* RESSOURCEN */}
        <motion.div variants={staggerItem} className="text-center md:text-left md:w-1/5">
          <h4 className="font-bold text-sm mb-4 tracking-wider">RESSOURCEN</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            {['Kostenlose eBooks', 'Entwicklungstutorial', 'Wie man - Blog', 'Youtube-Playlist'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ...transitions.quick }}
                whileHover={{ x: 5 }}
              >
                <a href="#" className="hover:text-black transition-colors">{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between mt-12 pt-8 border-t border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, ...transitions.smooth }}
      >
        <motion.p 
          className="text-sm text-gray-600 mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, ...transitions.smooth }}
        >
          liebig © 2000-2023, Alle Rechte vorbehalten
        </motion.p>
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, ...transitions.smooth }}
        >
          {[
            { src: "/images/visa-logo.png", alt: "Visa" },
            { src: "/images/mastercard-logo.png", alt: "Mastercard" },
            { src: "/images/paypal-logo.png", alt: "PayPal" },
            { src: "/images/apple-pay-logo.png", alt: "Apple Pay" },
            { src: "/images/google-pay-logo.png", alt: "Google Pay" }
          ].map((logo, index) => (
            <motion.div
              key={logo.alt}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, ...transitions.spring }}
            >
              <Image src={logo.src} alt={logo.alt} width={57} height={43} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
</motion.footer>

  )
}
