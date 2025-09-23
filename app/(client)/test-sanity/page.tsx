"use client"

interface TestResult {
  success: boolean
  message?: string
  error?: {
    message?: string
    details?: unknown
  }
}

import React, { useState } from 'react'
import { testSanityConnection } from '@/lib/sanity'
import { Button } from '@/components/ui/button'

const TestSanityPage = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const result = await testSanityConnection()
      setTestResult(result)
    } catch (error: unknown) {
      setTestResult({ 
        success: false, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Sanity Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Project ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not set'}
            </div>
            <div>
              <strong>Dataset:</strong> {process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not set'}
            </div>
            <div>
              <strong>API Token:</strong> {process.env.SANITY_API_TOKEN ? 
                `${process.env.SANITY_API_TOKEN.substring(0, 10)}...` : 
                &apos;Not set&apos;
              }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          
          <Button 
            onClick={runTest} 
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 mb-4"
          >
            {isLoading ? 'Testing...' : 'Test Sanity Connection'}
          </Button>

          {testResult && (
            <div className={`p-4 rounded-lg ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ Success' : '❌ Failed'}
              </h3>
              
              {testResult.success ? (
                <p className="text-green-700 mt-2">{testResult.message}</p>
              ) : (
                <div className="text-red-700 mt-2">
                  <p><strong>Error:</strong> {testResult.error?.message || 'Unknown error'}</p>
                  {testResult.error?.details && (
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                      {JSON.stringify(testResult.error.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="text-yellow-800 font-semibold mb-2">📝 Debugging Steps:</h3>
          <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
            <li>Check if all environment variables are properly set</li>
            <li>Verify your Sanity API token has "Editor" or "Admin" permissions</li>
            <li>Make sure you restarted your development server after adding the token</li>
            <li>Confirm the token is for the correct project and dataset</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default TestSanityPage