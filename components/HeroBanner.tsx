"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Send, Sparkles, Loader2, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { heroVariants, textReveal, buttonAnimationProps, transitions } from '@/lib/animations'

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
  
  // Carousel images
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Wine bottles in shop interior"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
      alt: "Vineyard landscape"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Wine cellar with bottles"
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
    <motion.div 
      className="relative h-[400px] md:h-[500px] lg:h-[800px] overflow-hidden"
      variants={heroVariants}
      initial="initial"
      animate="animate"
      transition={transitions.smooth}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].alt}
              fill
              className="object-cover"
              priority={currentSlide === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0, duration: 0 }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
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
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Content - Only show AI prompt on last slide */}
        {currentSlide === 2 && (
          <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, ...transitions.smooth }}
            >
              {/* AI Search Container */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, ...transitions.spring }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Main Search Box */}
                <div className="bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-md rounded-2xl px-6 py-5 shadow-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    {/* AI Icon */}
                    <motion.div 
                      className="flex-shrink-0"
                      animate={{ rotate: isSearching ? 360 : 0 }}
                      transition={{ duration: 0, repeat: isSearching ? Infinity : 0, ease: "linear" }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-red-700 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>

                    {/* Search Input */}
                    <motion.div 
                      className="flex-1 relative"
                      variants={textReveal}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 1.2, ...transitions.smooth }}
                    >
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
                      <AnimatePresence>
                        {isSearching && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2"
                          >
                            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {searchQuery && !isSearching && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div {...buttonAnimationProps}>
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
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                          AI-Empfehlungen
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-3 hover:bg-amber-50 rounded-lg transition-colors duration-150 group"
                          >
                            <div className="flex items-center gap-3">
                              <Search className="h-4 w-4 text-amber-600 group-hover:text-amber-700" />
                              <span className="text-gray-700 group-hover:text-amber-800 font-medium">
                                {suggestion}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* AI Status Text */}
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
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
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
