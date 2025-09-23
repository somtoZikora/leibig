import { NextRequest, NextResponse } from 'next/server'
// import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Server-side Sanity client
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
})

export async function GET() {
  try {
    console.log('🔄 Testing Sanity connection from API route...')
    
    // Check environment variables
    const envCheck = {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      tokenAvailable: !!process.env.SANITY_API_TOKEN,
      tokenPreview: process.env.SANITY_API_TOKEN?.substring(0, 15) + '...'
    }
    
    console.log('Environment check:', envCheck)
    
    // Test write operation with a simple document
    const testDoc = {
      _type: 'product',
      title: 'API-TEST-' + Date.now(),
      price: 1,
      rating: 5,
      stock: 1,
      status: 'TOP-VERKÄUFER' as const
    }
    
    console.log('📝 Creating test document...')
    const result = await sanityWriteClient.create(testDoc)
    console.log('✅ Test document created:', result._id)
    
    // Clean up
    await sanityWriteClient.delete(result._id)
    console.log('🗑️ Test document cleaned up')
    
    return NextResponse.json({
      success: true,
      message: 'Sanity connection working from API route',
      environment: envCheck,
      testResult: {
        created: result._id,
        cleaned: true
      }
    })
    
  } catch (error: unknown) {
    console.error('❌ API Test Error:', error)
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: error instanceof Error && 'statusCode' in error ? (error as { statusCode: unknown }).statusCode : undefined,
      type: error instanceof Error && 'type' in error ? (error as { type: unknown }).type : undefined,
      description: error instanceof Error && 'description' in error ? (error as { description: unknown }).description : undefined
    }
    
    return NextResponse.json({
      success: false,
      error: errorDetails,
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        tokenAvailable: !!process.env.SANITY_API_TOKEN,
        tokenPreview: process.env.SANITY_API_TOKEN?.substring(0, 15) + '...'
      }
    }, { status: 500 })
  }
}