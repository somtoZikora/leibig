"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductOperations } from '@/lib/sanityAPI'
import { useSanitySync } from '@/lib/useSanitySync'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const AdminPanel = () => {
  const [productTitle, setProductTitle] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productStock, setProductStock] = useState('')
  
  const { createProduct, isLoading: productLoading } = useProductOperations()
  const { isSyncing, syncResult } = useSanitySync()

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productTitle.trim() || !productPrice || !productStock) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await createProduct({
        _type: 'product',
        title: productTitle,
        price: parseFloat(productPrice),
        stock: parseInt(productStock),
        rating: 4.5,
        variant: 'Weine',
        status: 'TOP-VERKÄUFER'
      })
      
      setProductTitle('')
      setProductPrice('')
      setProductStock('')
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-avenir">Admin Panel</h1>
          <p className="text-lg text-muted-foreground font-light">Backend Synchronization Dashboard</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <Badge variant={syncResult?.success ? 'default' : 'destructive'} className="font-medium">
              {syncResult?.success ? 'Connected' : 'Disconnected'}
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">
              Last sync: {syncResult ? new Date().toLocaleTimeString() : 'Never'}
            </span>
          </div>
          <Button onClick={() => {}} disabled={isSyncing} variant="outline" size="sm" className="font-medium">
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sync
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 font-avenir">
            <Plus className="h-5 w-5 text-primary" />
            <span className="font-semibold">Create New Product</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground font-light">
            Add a new product to your wine collection
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <Label htmlFor="productTitle" className="text-sm font-medium">Product Title</Label>
              <Input
                id="productTitle"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Enter product title..."
                className="mt-1 font-avenir"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="productPrice" className="text-sm font-medium">Price (EUR)</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="0.00"
                className="mt-1 font-avenir"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="productStock" className="text-sm font-medium">Stock Quantity</Label>
              <Input
                id="productStock"
                type="number"
                min="0"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                placeholder="0"
                className="mt-1 font-avenir"
                required
              />
            </div>
            
            <Button type="submit" className="w-full font-medium font-avenir" disabled={productLoading}>
              {productLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel