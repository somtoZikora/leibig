"use client"

import type React from "react"
import { useState } from "react"
import { Search, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBannerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchBanner = ({ isOpen, onClose }: SearchBannerProps) => {
    const [searchQuery, setSearchQuery] = useState("")
      const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Search Modal */}
      <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 md:p-8 border border-white/20 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Title */}
        <h2 className="text-white text-xl md:text-2xl font-medium mb-6 text-center">Wonach suchen Sie?</h2>

        {/* Search Input */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="azeaz"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-3 bg-white border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50 rounded-lg"
              autoFocus
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-white text-black hover:bg-[rgba(139,115,85,0.1)] rounded-full h-12 w-12 p-0 flex-shrink-0 transition-all duration-200 hover:scale-105"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchBanner