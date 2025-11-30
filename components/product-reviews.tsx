"use client"

import { useState } from "react"
import { PortableText } from "@portabletext/react"
import { type WineProduct, type ExpandedBundleProduct, isBundle } from "@/lib/sanity"

interface ProductReviewsProps {
  productId?: string
  product: WineProduct | ExpandedBundleProduct
}

export default function ProductReviews({ productId, product }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState("info")
  const isBundleProduct = isBundle(product)

  // Helper to check if a value is valid for rendering (not an empty object)
  const isValidValue = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'object' && Object.keys(value).length === 0) return false
    if (typeof value === 'string' && !value.trim()) return false
    return true
  }

  const tabs = [
    { id: "info", label: "Produktinformationen" },
    { id: "description", label: "Produktbeschreibung" },
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


      {/* Product Information Tab */}
      {activeTab === "info" && (
        <div className="py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {isBundleProduct ? (
              /* Bundle: Show information for each wine */
              product.bundleItems.map((item, index) => (
                <div key={item._key} className="border-b border-[rgba(139,115,85,0.2)] pb-8 last:border-b-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    {item.quantity}x {item.product.title}
                  </h3>

                  {/* Basic Info */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Grundinformationen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isValidValue(item.product.jahrgang) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Jahrgang:</span>
                          <span className="font-medium text-gray-900">{item.product.jahrgang}</span>
                        </div>
                      )}
                      {isValidValue(item.product.rebsorte) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Sorte:</span>
                          <span className="font-medium text-gray-900">{item.product.rebsorte}</span>
                        </div>
                      )}
                      {isValidValue(item.product.qualitaet) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Qualität:</span>
                          <span className="font-medium text-gray-900">{item.product.qualitaet}</span>
                        </div>
                      )}
                      {isValidValue(item.product.geschmack) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Geschmack:</span>
                          <span className="font-medium text-gray-900">{item.product.geschmack}</span>
                        </div>
                      )}
                      {isValidValue(item.product.alkohol) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Alkoholgehalt:</span>
                          <span className="font-medium text-gray-900">{item.product.alkohol} % vol.</span>
                        </div>
                      )}
                      {isValidValue(item.product.liter) && (
                        <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                          <span className="text-gray-600">Füllmenge:</span>
                          <span className="font-medium text-gray-900">{item.product.liter} L</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nutrition Facts */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Nährwerte pro 100ml</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isValidValue(item.product.brennwert) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Brennwert:</span>
                          <span className="font-medium text-gray-900">{item.product.brennwert} kcal</span>
                        </div>
                      )}
                      {isValidValue(item.product.kohlenhydrate) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Kohlenhydrate:</span>
                          <span className="font-medium text-gray-900">{item.product.kohlenhydrate} g</span>
                        </div>
                      )}
                      {isValidValue(item.product.zucker) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Zucker:</span>
                          <span className="font-medium text-gray-900">{item.product.zucker} g</span>
                        </div>
                      )}
                      {isValidValue(item.product.saeure) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Säure:</span>
                          <span className="font-medium text-gray-900">{item.product.saeure} g/L</span>
                        </div>
                      )}
                      {isValidValue(item.product.eiweiss) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Eiweiß:</span>
                          <span className="font-medium text-gray-900">{item.product.eiweiss} g</span>
                        </div>
                      )}
                      {isValidValue(item.product.fett) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Fett:</span>
                          <span className="font-medium text-gray-900">{item.product.fett} g</span>
                        </div>
                      )}
                      {isValidValue(item.product.salz) && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Salz:</span>
                          <span className="font-medium text-gray-900">{item.product.salz} g</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Producer Info */}
                  {(item.product.erzeuger || true) && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Erzeuger</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {item.product.erzeuger || "Weingut Liebieg, Familienweingut mit langer Tradition im Weinbau. Unsere Weine werden mit größter Sorgfalt und nach traditionellen Methoden hergestellt."}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              /* Regular Product: Show single product information */
              <>
                {/* Basic Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Grundinformationen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isValidValue(product.jahrgang) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Jahrgang:</span>
                        <span className="font-medium text-gray-900">{product.jahrgang}</span>
                      </div>
                    )}
                    {isValidValue(product.rebsorte) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Sorte:</span>
                        <span className="font-medium text-gray-900">{product.rebsorte}</span>
                      </div>
                    )}
                    {isValidValue(product.qualitaet) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Qualität:</span>
                        <span className="font-medium text-gray-900">{product.qualitaet}</span>
                      </div>
                    )}
                    {isValidValue(product.geschmack) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Geschmack:</span>
                        <span className="font-medium text-gray-900">{product.geschmack}</span>
                      </div>
                    )}
                    {isValidValue(product.alkohol) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Alkoholgehalt:</span>
                        <span className="font-medium text-gray-900">{product.alkohol} % vol.</span>
                      </div>
                    )}
                    {isValidValue(product.liter) && (
                      <div className="flex justify-between py-3 border-b border-[rgba(139,115,85,0.2)]">
                        <span className="text-gray-600">Füllmenge:</span>
                        <span className="font-medium text-gray-900">{product.liter} L</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Nährwerte pro 100ml</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isValidValue(product.brennwert) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Brennwert:</span>
                        <span className="font-medium text-gray-900">{product.brennwert} kcal</span>
                      </div>
                    )}
                    {isValidValue(product.kohlenhydrate) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Kohlenhydrate:</span>
                        <span className="font-medium text-gray-900">{product.kohlenhydrate} g</span>
                      </div>
                    )}
                    {isValidValue(product.zucker) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Zucker:</span>
                        <span className="font-medium text-gray-900">{product.zucker} g</span>
                      </div>
                    )}
                    {isValidValue(product.saeure) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Säure:</span>
                        <span className="font-medium text-gray-900">{product.saeure} g/L</span>
                      </div>
                    )}
                    {isValidValue(product.eiweiss) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Eiweiß:</span>
                        <span className="font-medium text-gray-900">{product.eiweiss} g</span>
                      </div>
                    )}
                    {isValidValue(product.fett) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Fett:</span>
                        <span className="font-medium text-gray-900">{product.fett} g</span>
                      </div>
                    )}
                    {isValidValue(product.salz) && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Salz:</span>
                        <span className="font-medium text-gray-900">{product.salz} g</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Producer Info */}
                {(product.erzeuger || true) && (
                  <div className="pt-4 border-t border-[rgba(139,115,85,0.2)]">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Erzeuger</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.erzeuger || "Weingut Liebieg, Familienweingut mit langer Tradition im Weinbau. Unsere Weine werden mit größter Sorgfalt und nach traditionellen Methoden hergestellt."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Description Tab */}
      {activeTab === "description" && (
        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Produktbeschreibung</h2>
            <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
              {product.description && product.description.length > 0 ? (
                <PortableText
                  value={product.description}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-4">{children}</p>,
                      h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-semibold mb-2">{children}</h3>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li className="mb-1">{children}</li>,
                      number: ({ children }) => <li className="mb-1">{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      underline: ({ children }) => <span className="underline">{children}</span>,
                      link: ({ value, children }) => {
                        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                        return (
                          <a
                            href={value?.href}
                            target={target}
                            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                            className="text-blue-600 hover:underline"
                          >
                            {children}
                          </a>
                        )
                      },
                    },
                  }}
                />
              ) : (
                <p>Keine Beschreibung verfügbar.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
