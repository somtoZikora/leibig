"use client"

import { Search } from 'lucide-react'
import SearchDialog from './SearchDialog'
import { useEffect, useState } from 'react'

export default function MobileSearchDialog() {
  const [isOpen, setIsOpen] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg focus:outline-none md:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      <SearchDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
