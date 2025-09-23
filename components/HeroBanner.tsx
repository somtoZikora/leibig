"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Handle search logic here
      console.log("Searching for:", searchQuery)
    }
  }
  
  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[150vh] overflow-hidden">
      <Image src="/images/banner_image.jpg" alt="Wine glasses hero background" fill className="object-cover" priority />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto ">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-9 py-4 shadow-2xl p-2 h-[140px]">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Wonach suchen Sie?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent border-0 text-white placeholder:text-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base font-normal"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
                onClick={() => setSearchQuery("")}
              >
               <Image 
                src="/icons/icone_voctor.png" 
                alt="Search icon" 
                width={50} 
                height={50} 

                />
              </Button>
            </div>
            {/* </CHANGE> */}
          </div>
        </div>
      </div>
    </div>
  )
}
