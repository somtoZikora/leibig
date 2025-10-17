'use client'

import { useEffect, useState } from 'react'
import { DataService, isUsingMockData } from '@/lib/dataService'
import { WineProduct } from '@/lib/sanity'
import { Button } from '@/components/ui/button'

export default function TestMockPage() {
  const [products, setProducts] = useState<WineProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testMockData = async () => {
      try {
        const starterSets = await DataService.getStarterSets()
        const topSellers = await DataService.getTopSellers(4, 0)
        
        setProducts([...starterSets, ...topSellers])
      } catch (error) {
        console.error('Error testing mock data:', error)
      } finally {
        setLoading(false)
      }
    }

    testMockData()
  }, [])

  return (
    <div className="container mx-auto p-8 pt-0 md:pt-[200px]">
      <h1 className="text-3xl font-bold mb-6">Mock Data Test Page</h1>
      
      <div className="mb-6 p-4 bg-blue-100 rounded-lg">
        <p className="font-semibold">
          Current Mode: {isUsingMockData ? '🍷 Mock Data' : '📊 Real Data'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          To toggle: Set NEXT_PUBLIC_USE_MOCK_DATA=true/false in .env.local
        </p>
        <div className="mt-2">
          <Button 
            onClick={() => window.location.reload()}
            className="mr-2"
          >
            Refresh Page
          </Button>
          <span className="text-sm text-gray-500">
            (Refresh after changing environment variable)
          </span>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Products ({products.length} total)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-gray-600">€{product.price}</p>
                <p className="text-sm text-gray-500">
                  Status: {product.status || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Variant: {product.variant || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Rating: {product.rating}/5
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
