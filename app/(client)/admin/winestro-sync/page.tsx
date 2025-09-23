"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SyncResult {
  success: boolean
  message: string
  stats?: any
  data?: any
}

export default function WinestroSyncAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<SyncResult | null>(null)
  const [productId, setProductId] = useState('')

  const handleApiCall = async (action: string, options?: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/winestro-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, options })
      })

      const result: SyncResult = await response.json()
      setLastResult(result)
      toast[result.success ? 'success' : 'error'](result.message)
      return result
    } catch (error: any) {
      const errorResult = { success: false, message: `Error: ${error.message}` }
      setLastResult(errorResult)
      toast.error(errorResult.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Winestro Sync Admin</h1>
          <p className="text-gray-600">Sync products from Winestro API to Sanity</p>
        </div>

        {/* Test Connection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Connection</h2>
          <Button onClick={() => handleApiCall('test-connection')} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Test API Connection
          </Button>
        </Card>

        {/* Sync Products */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sync All Products</h2>
          <Button onClick={() => handleApiCall('sync-products', { limit: 50 })} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sync Products
          </Button>
        </Card>

        {/* Single Product Sync */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sync Single Product</h2>
          <div className="flex gap-2">
            <Input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Winestro Product ID"
            />
            <Button 
              onClick={() => handleApiCall('sync-single-product', { productId })} 
              disabled={isLoading || !productId}
            >
              Sync
            </Button>
          </div>
        </Card>

        {/* Results */}
        {lastResult && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h2 className="text-xl font-semibold">Last Result</h2>
            </div>
            <p className="mb-4">{lastResult.message}</p>
            {lastResult.stats && (
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {JSON.stringify(lastResult.stats, null, 2)}
              </pre>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}