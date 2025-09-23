"use client"

import { useState } from "react"
import { Star, MoreHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { urlFor, type WineProduct } from "@/lib/sanity"

// Update the import path to the correct location if needed
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Or, if the file is in 'components/ui/dropdown-menu.tsx' relative to your project root:

interface Review {
  id: string
  author: string
  rating: number
  content: string
  date: string
  verified: boolean
}

interface ProductReviewsProps {
  productId?: string
  reviews?: Review[]
 product: WineProduct
}


const mockReviews: Review[] = [
  {
    id: "1",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
  {
    id: "2",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
  {
    id: "3",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
  {
    id: "4",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
  {
    id: "5",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
  {
    id: "6",
    author: "Samantha D.",
    rating: 4.5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus vel velit vestibulum facilisis sed sed dui. Nulla porta arcu ut nunc sollicitudin ut.",
    date: "14. August 2023",
    verified: true,
  },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <StarRating rating={review.rating} />
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{review.author}</h4>
            {review.verified && (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Melden</DropdownMenuItem>
            <DropdownMenuItem>Hilfreich</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>

      <p className="text-xs text-gray-500">Veröffentlicht am {review.date}</p>
    </div>
  )
}

export default function ProductReviews({ productId,
  reviews = mockReviews,
  product,}: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState("reviews")
  const [sortBy, setSortBy] = useState("newest")

  const tabs = [
    { id: "details", label: "Produktdetails" },
    { id: "reviews", label: "Bewertungen & Rezensionen" },
    { id: "faq", label: "Häufig gestellte Fragen" },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Reviews Content */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Alle Bewertungen</h2>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <span className="text-sm">Neueste</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>Neueste</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>Älteste</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("highest")}>Höchste Bewertung</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("lowest")}>Niedrigste Bewertung</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-black text-white hover:bg-gray-800">Eine Bewertung schreiben</Button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-8">
            <Button variant="outline" className="px-8 bg-transparent">
              Weitere Bewertungen laden
            </Button>
          </div>
        </div>
      )}

      {/* Other Tab Contents */}
      {activeTab === "details" && (
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-4">Produktdetails</h2>
          <p className="text-gray-600">{product.description || "Keine Beschreibung vorhanden."}</p>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="py-8">
          <h2 className="text-2xl font-bold mb-4">Häufig gestellte Fragen</h2>
          <p className="text-gray-600">FAQ-Inhalte werden hier angezeigt...</p>
        </div>
      )}
    </div>
  )
}
