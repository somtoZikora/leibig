"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

interface ProductFilterProps {
  // Filter states
  selectedCategories: string[]
  priceRange: [number, number]
  selectedJahrgaenge: string[]
  selectedGeschmack: string[]
  selectedRebsorten: string[]

  // Filter handlers
  onCategoryChange: (categoryId: string, checked: boolean) => void
  onPriceRangeChange: (value: [number, number]) => void
  onJahrgangChange: (jahrgang: string, checked: boolean) => void
  onGeschmackChange: (geschmack: string, checked: boolean) => void
  onRebsorteChange: (rebsorte: string, checked: boolean) => void
  onClearFilters: () => void

  // Data
  categories: Array<{ _id: string; title: string }>
  availableJahrgaenge: string[]
  availableRebsorten: string[]

  // UI states
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
}

// Nach Geschmack (Taste Collection) options
const geschmackOptions = [
  { id: "Mineralisch & Tiefgründig", label: "Mineralisch & Tiefgründig" },
  { id: "Frisch & Lebendig", label: "Frisch & Lebendig" },
  { id: "Aromatisch & Charmant", label: "Aromatisch & Charmant" },
  { id: "Vollmundig & Komplex", label: "Vollmundig & Komplex" },
]

export default function ProductFilter({
  selectedCategories,
  priceRange,
  selectedJahrgaenge,
  selectedGeschmack,
  selectedRebsorten,
  onCategoryChange,
  onPriceRangeChange,
  onJahrgangChange,
  onGeschmackChange,
  onRebsorteChange,
  onClearFilters,
  categories,
  availableJahrgaenge,
  availableRebsorten,
  isFilterOpen,
  setIsFilterOpen,
}: ProductFilterProps) {
  // Convert arrays to option format
  const jahrgangOptions = availableJahrgaenge.map(j => ({ id: j, label: j }))
  const rebsorteOptions = availableRebsorten.map(r => ({ id: r, label: r }))
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    category: false,
    jahrgang: false,
    geschmack: false,
    rebsorte: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[section]
      // Close all sections first
      const allClosed = {
        price: false,
        category: false,
        jahrgang: false,
        geschmack: false,
        rebsorte: false,
      }
      // If the section was closed, open it. If it was open, keep all closed
      return {
        ...allClosed,
        [section]: !isCurrentlyExpanded
      }
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-black">Filter</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs text-gray-600 hover:text-black"
          >
            Alle löschen
          </Button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-bold text-black">Preis</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>
        
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-visible"
            >
              <div className="px-4 py-4">
                <Slider
                  value={priceRange}
                  onValueChange={onPriceRangeChange}
                  max={100}
                  min={0}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('category')}
        >
          <h3 className="font-bold text-black">Kategorie</h3>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between gap-2 py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => onCategoryChange(category._id, !selectedCategories.includes(category._id))}
                  >
                    <span className="text-gray-600 truncate flex-1">{category.title}</span>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedCategories.includes(category._id)
                        ? 'bg-black border-black'
                        : 'border-gray-300'
                    }`}>
                      {selectedCategories.includes(category._id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Jahrgang (Vintage/Year) */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('jahrgang')}
        >
          <h3 className="font-bold text-black">Jahrgang</h3>
          {expandedSections.jahrgang ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.jahrgang && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {jahrgangOptions.map((jahrgang) => (
                  <button
                    key={jahrgang.id}
                    onClick={() => onJahrgangChange(jahrgang.id, !selectedJahrgaenge.includes(jahrgang.id))}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors truncate ${
                      selectedJahrgaenge.includes(jahrgang.id)
                        ? 'bg-black text-white'
                        : 'bg-[rgba(139,115,85,0.1)] text-gray-700 hover:bg-[rgba(139,115,85,0.2)]'
                    }`}
                    title={jahrgang.label}
                  >
                    {jahrgang.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nach Geschmack (Taste Collection) */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('geschmack')}
        >
          <h3 className="font-bold text-black">Nach Geschmack</h3>
          {expandedSections.geschmack ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.geschmack && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {geschmackOptions.map((geschmack) => (
                  <div
                    key={geschmack.id}
                    className="flex items-center justify-between gap-2 py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => onGeschmackChange(geschmack.id, !selectedGeschmack.includes(geschmack.id))}
                  >
                    <span className="text-gray-600 truncate flex-1" title={geschmack.label}>{geschmack.label}</span>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedGeschmack.includes(geschmack.id)
                        ? 'bg-black border-black'
                        : 'border-gray-300'
                    }`}>
                      {selectedGeschmack.includes(geschmack.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rebsorte (Grape variety) */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('rebsorte')}
        >
          <h3 className="font-bold text-black">Rebsorte</h3>
          {expandedSections.rebsorte ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>

        <AnimatePresence>
          {expandedSections.rebsorte && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {rebsorteOptions.map((rebsorte) => (
                  <div
                    key={rebsorte.id}
                    className="flex items-center justify-between gap-2 py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => onRebsorteChange(rebsorte.id, !selectedRebsorten.includes(rebsorte.id))}
                  >
                    <span className="text-gray-600 truncate flex-1" title={rebsorte.label}>{rebsorte.label}</span>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedRebsorten.includes(rebsorte.id)
                        ? 'bg-black border-black'
                        : 'border-gray-300'
                    }`}>
                      {selectedRebsorten.includes(rebsorte.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[80vh] rounded-t-2xl p-0"
          >
            <SheetHeader className="flex flex-row items-center justify-between p-6 pb-0">
              <SheetTitle className="text-left">Filter</SheetTitle>
            </SheetHeader>
            <div className="p-6 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
