"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ClerkProvider } from "@clerk/nextjs"
import { deDE } from "@clerk/localizations"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "./(client)/globals.css"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global app error:", error)
  }, [error])

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={deDE}
    >
      <html lang="de">
        <body>
          <Header />
          <main className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-gray-50">
            <div className="max-w-xl w-full text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-2">500</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Ein Fehler ist aufgetreten</h1>
              <p className="text-gray-600 mb-8">
                Beim Laden der Seite ist etwas schiefgelaufen. Bitte versuchen Sie es erneut.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Erneut versuchen
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Zur Startseite
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
