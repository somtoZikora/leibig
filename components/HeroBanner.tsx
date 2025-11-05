"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send, Sparkles, Loader2, Search, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Carousel images and content
  const slides = [
    {
      id: 1,
      image: "/Startseite/Slider/Erste Slide/9_16.jpg",
      mobileImage: "/Startseite/Slider/Erste Slide/1_1.jpg",
      alt: "Wine collection display",
      showLogo: true,
      subline: "Entdecke charakterstarke Weine & prickelnde Sekte aus den Steillagen der Mosel. Direkt vom Weingut. Direkt zu dir.",
      cta: "Jetzt entdecken",
      ctaLink: "/shop"
    },
    {
      id: 2,
      image: "/Startseite/Slider/Zweite Slide - Bundles/16_9.jpg",
      mobileImage: "/Startseite/Slider/Zweite Slide - Bundles/1_1.jpg",
      alt: "Wine tasting scene",
      heading: "Starter Bundles",
      subline: "Dein Einstieg in die Welt der Moselweine.",
      cta: "Bundles shoppen",
      ctaLink: "/shop?category=bundles"
    },
    {
      id: 3,
      image: "/Startseite/Slider/Dritte Slide - Geschenke/9_16.jpg",
      mobileImage: "/Startseite/Slider/Dritte Slide - Geschenke/1_1.jpeg",
      alt: "Wine bottles arrangement",
      heading: "Geschenkideen",
      subline: "Genuss verschenken mit personalisierbaren Wein- & Sekt-Bundles.",
      cta: "Jetzt verschenken",
      ctaLink: "/shop?category=geschenke"
    },
    {
      id: 4,
      image: "/Startseite/Slider/Vinolin/16_9.jpg",
      mobileImage: "/Startseite/Slider/Vinolin/1_1.jpg",
      alt: "Wine vineyard view",
      heading: "Welcher Wein passt zu Deinem Moment?",
      subline: "Frag Vinolin: Dein digitaler Sommelier für die richtige Wahl.",
      isAISlide: true
    }
  ]

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying && !isHovered && !showSuggestions && !isSearching) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, isHovered, showSuggestions, isSearching, slides.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide])

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // AI-powered search suggestions
  const wineSuggestions = [
    "Rote Weine für besondere Anlässe",
    "Weißweine für den Sommer",
    "Champagner und Sekt",
    "Bio-Weine aus der Region",
    "Weine unter 20€",
    "Premium Weine für Kenner",
    "Weinpakete als Geschenk",
    "Trockene Weine",
    "Süße Dessertweine",
    "Weine für Anfänger"
  ]

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSuggestions(false)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log("AI Searching for:", searchQuery)
    // Here you would integrate with your actual AI search API

    setIsSearching(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Pause auto-play when user is typing
    setIsAutoPlaying(false)

    if (value.length > 1) {
      const filteredSuggestions = wineSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filteredSuggestions.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSearch()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.relative')?.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  return (
    <div
      className="relative h-[80vh] md:h-[500px] lg:h-[800px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop Image */}
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            fill
            className="object-cover hidden md:block"
            priority={currentSlide === 0}
            sizes="100vw"
          />
          {/* Mobile Image */}
          <Image
            src={slides[currentSlide].mobileImage}
            alt={slides[currentSlide].alt}
            fill
            className="object-cover md:hidden"
            priority={currentSlide === 0}
            sizes="100vw"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content - Show different content based on slide */}
        {currentSlide !== 3 ? (
          <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto text-center text-white">
              {/* Logo for Slide 1 */}
              {slides[currentSlide].showLogo && (
                <div className="mb-6">
                  <Image
                    src="/images/Kirsten-Liebieg_Logo.png"
                    alt="Kirsten Liebieg Logo"
                    width={400}
                    height={133}
                    className="mx-auto brightness-0 invert drop-shadow-2xl"
                  />
                </div>
              )}

              {/* Heading */}
              {slides[currentSlide].heading && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                  {slides[currentSlide].heading}
                </h1>
              )}

              {/* Subline */}
              <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-lg">
                {slides[currentSlide].subline}
              </p>

              {/* CTA Button */}
              {slides[currentSlide].cta && slides[currentSlide].ctaLink && (
                <Link href={slides[currentSlide].ctaLink}>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-[rgba(139,115,85,0.1)] text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {slides[currentSlide].cta}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            {/* Heading and Subline for AI Slide */}
            <div className="w-full max-w-3xl mx-auto text-center text-white mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                {slides[currentSlide].heading}
              </h1>
              <p className="text-lg md:text-xl mb-6 drop-shadow-lg">
                {slides[currentSlide].subline}
              </p>
            </div>

            <div className="w-full max-w-3xl mx-auto">
              {/* AI Search Container */}
              <div className="relative">
                {/* Main Search Box */}
                <div className="bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-md rounded-2xl px-6 py-5 shadow-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    {/* AI Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-700 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Wonach suchen Sie? Lassen Sie mich Ihnen helfen..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                        className="bg-transparent border-0 text-white placeholder:text-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-lg font-normal h-12"
                        disabled={isSearching}
                      />

                      {/* AI Processing Indicator */}
                      {isSearching && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {searchQuery && !isSearching && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSearch}
                          className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || isSearching}
                        className="bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800 text-white rounded-full h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                        AI-Empfehlungen
                      </div>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-3 hover:bg-amber-50 rounded-lg transition-colors duration-150 group"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
                            <span className="text-gray-700 group-hover:text-amber-800 font-medium">
                              {suggestion}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Status Text */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">
                  {isSearching ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      KI analysiert Ihre Anfrage...
                    </span>
                  ) : (
                    "Powered by AI • Finden Sie den perfekten Wein"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
