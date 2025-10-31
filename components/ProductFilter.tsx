"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

interface ProductFilterProps {
  // Filter states
  searchTerm: string
  selectedStatuses: string[]
  selectedVariants: string[]
  selectedCategories: string[]
  priceRange: [number, number]
  selectedJahrgaenge: string[]
  selectedGeschmack: string[]
  selectedRebsorten: string[]

  // Filter handlers
  onSearchChange: (value: string) => void
  onStatusChange: (statusId: string, checked: boolean) => void
  onVariantChange: (variantId: string, checked: boolean) => void
  onCategoryChange: (categoryId: string, checked: boolean) => void
  onPriceRangeChange: (value: [number, number]) => void
  onJahrgangChange: (jahrgang: string, checked: boolean) => void
  onGeschmackChange: (geschmack: string, checked: boolean) => void
  onRebsorteChange: (rebsorte: string, checked: boolean) => void
  onApplyFilters: () => void
  onClearFilters: () => void

  // Data
  categories: Array<{ _id: string; title: string }>

  // UI states
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
}

// Static filter options
const statusOptions = [
  { id: "TOP-VERKÄUFER", label: "Top-Verkäufer" },
  { id: "STARTERSETS", label: "Startersets" },
]

const variantOptions = [
  { id: "Neuheiten", label: "Neuheiten" },
  { id: "Weine", label: "Weine" },
]

const packageOptions = [
  { id: "2", label: "2 Pakete" },
  { id: "3", label: "3 Pakete" },
  { id: "6", label: "6er-Pack" },
  { id: "medium", label: "Mittel" },
  { id: "single", label: "Einzelstücke" },
]

const occasionOptions = [
  { id: "casual", label: "Lässig" },
  { id: "formal", label: "Formal" },
  { id: "party", label: "Party" },
  { id: "wedding", label: "Hochzeit" },
]

// Jahrgang (Vintage/Year) options
const jahrgangOptions = [
  { id: "2023", label: "2023" },
  { id: "2022", label: "2022" },
  { id: "2021", label: "2021" },
  { id: "2020", label: "2020" },
  { id: "2019", label: "2019" },
  { id: "2018", label: "2018" },
]

// Geschmack (Taste) options
const geschmackOptions = [
  { id: "Trocken", label: "Trocken" },
  { id: "Halbtrocken", label: "Halbtrocken" },
  { id: "Feinherb", label: "Feinherb" },
  { id: "Frucht und Edelsüß", label: "Frucht und Edelsüß" },
]

// Rebsorte (Grape variety) options
const rebsorteOptions = [
  { id: "Riesling", label: "Riesling" },
  { id: "Spätburgunder", label: "Spätburgunder" },
  { id: "Grauburgunder", label: "Grauburgunder" },
  { id: "Weißburgunder", label: "Weißburgunder" },
  { id: "Müller-Thurgau", label: "Müller-Thurgau" },
]

export default function ProductFilter({
  searchTerm,
  selectedStatuses,
  selectedVariants,
  selectedCategories,
  priceRange,
  selectedJahrgaenge,
  selectedGeschmack,
  selectedRebsorten,
  onSearchChange,
  onStatusChange,
  onVariantChange,
  onCategoryChange,
  onPriceRangeChange,
  onJahrgangChange,
  onGeschmackChange,
  onRebsorteChange,
  onApplyFilters,
  onClearFilters,
  categories,
  isFilterOpen,
  setIsFilterOpen,
}: ProductFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    packages: true,
    occasion: true,
    jahrgang: true,
    geschmack: true,
    rebsorte: true,
  })

  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  const handleOccasionSelect = (occasionId: string) => {
    setSelectedOccasions(prev => 
      prev.includes(occasionId) 
        ? prev.filter(id => id !== occasionId)
        : [...prev, occasionId]
    )
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

      {/* Product Type Filter */}
      <div>
        <h3 className="font-bold text-black mb-3">Produkttyp</h3>
        <div className="space-y-2">
          {variantOptions.map((variant) => (
            <div 
              key={variant.id} 
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
              onClick={() => onVariantChange(variant.id, !selectedVariants.includes(variant.id))}
            >
              <span className="text-gray-600">{variant.label}</span>
              <span className="text-gray-400">›</span>
            </div>
          ))}
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
                  max={500} 
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

      {/* Packages */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('packages')}
        >
          <h3 className="font-bold text-black">Pakete</h3>
          {expandedSections.packages ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>
        
        <AnimatePresence>
          {expandedSections.packages && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {packageOptions.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      selectedPackages.includes(pkg.id)
                        ? 'bg-black text-white'
                        : 'bg-[rgba(139,115,85,0.1)] text-gray-700 hover:bg-[rgba(139,115,85,0.2)]'
                    }`}
                  >
                    {pkg.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Occasion */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('occasion')}
        >
          <h3 className="font-bold text-black">Anlass</h3>
          {expandedSections.occasion ? (
            <ChevronUp className="h-4 w-4 text-black" />
          ) : (
            <ChevronDown className="h-4 w-4 text-black" />
          )}
        </div>
        
        <AnimatePresence>
          {expandedSections.occasion && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {occasionOptions.map((occasion) => (
                  <div 
                    key={occasion.id} 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => handleOccasionSelect(occasion.id)}
                  >
                    <span className="text-gray-600">{occasion.label}</span>
                    <span className="text-gray-400">›</span>
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
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      selectedJahrgaenge.includes(jahrgang.id)
                        ? 'bg-black text-white'
                        : 'bg-[rgba(139,115,85,0.1)] text-gray-700 hover:bg-[rgba(139,115,85,0.2)]'
                    }`}
                  >
                    {jahrgang.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Geschmack (Taste) */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => toggleSection('geschmack')}
        >
          <h3 className="font-bold text-black">Geschmack</h3>
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
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => onGeschmackChange(geschmack.id, !selectedGeschmack.includes(geschmack.id))}
                  >
                    <span className="text-gray-600">{geschmack.label}</span>
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
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-[rgba(139,115,85,0.05)] rounded"
                    onClick={() => onRebsorteChange(rebsorte.id, !selectedRebsorten.includes(rebsorte.id))}
                  >
                    <span className="text-gray-600">{rebsorte.label}</span>
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

      {/* Apply Filter Button - Mobile Only */}
      <div className="md:hidden pt-4">
        <Button
          className="w-full bg-black text-white hover:bg-[rgba(139,115,85,0.8)] rounded-full"
          onClick={() => {
            onApplyFilters()
            setIsFilterOpen(false)
          }}
        >
          Filter anwenden
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
          <FilterContent />
          {/* Apply Filter Button - Desktop */}
          <div className="pt-4">
            <Button
              className="w-full bg-black text-white hover:bg-[rgba(139,115,85,0.8)] rounded-full"
              onClick={onApplyFilters}
            >
              Filter anwenden
            </Button>
          </div>
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
