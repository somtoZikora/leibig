"use client"
import React from "react";

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const TopNav = () => {

   const [isVisible, setIsVisible] = React.useState(false)

  if (!isVisible) return null
  return (
   <div className="hidden md:block w-full bg-black text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="font-aleo text-sm font-medium">
            Melden Sie sich an und erhalten Sie 20 % Rabatt auf Ihre erste Bestellung.{" "}
            <span className="underline cursor-pointer hover:no-underline">Jetzt anmelden</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 text-white hover:bg-white/10 flex-shrink-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close banner</span>
        </Button>
      </div>
    </div>
  )
}

export default TopNav