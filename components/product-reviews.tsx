"use client"

import { useState } from "react"
import { type WineProduct } from "@/lib/sanity"

interface ProductReviewsProps {
  productId?: string
  product: WineProduct
}

export default function ProductReviews({ productId, product }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState("details")

  const tabs = [
    { id: "details", label: "Produktdetails" },
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
