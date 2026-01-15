'use client'

import { useState, useEffect } from 'react'
import CookieConsentLib from 'react-cookie-consent'
import { Button } from '@/components/ui/button'

/**
 * Update Google Analytics consent mode
 */
function updateGoogleConsent(granted: boolean) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    })
  }
}

/**
 * GDPR-compliant cookie consent banner
 */
export default function CookieConsent() {
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Set default consent to denied (GDPR requirement)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      })
    }
  }, [])

  if (!mounted) return null

  const handleAccept = () => {
    updateGoogleConsent(true)
  }

  const handleDecline = () => {
    updateGoogleConsent(false)
  }

  return (
    <CookieConsentLib
      location="bottom"
      buttonText="Alle akzeptieren"
      declineButtonText="Nur notwendige"
      cookieName="kirsten-liebieg-cookie-consent"
      style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(139, 115, 85, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      buttonStyle={{
        background: 'rgba(139, 115, 85, 1)',
        color: 'white',
        fontSize: '14px',
        padding: '10px 24px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        marginLeft: '12px',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: 'rgba(139, 115, 85, 1)',
        fontSize: '14px',
        padding: '10px 24px',
        borderRadius: '6px',
        border: '1px solid rgba(139, 115, 85, 0.3)',
        cursor: 'pointer',
        fontWeight: '500',
        marginLeft: '12px',
      }}
      expires={365}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      contentStyle={{
        flex: '1 1 auto',
        margin: '0',
        maxWidth: '900px',
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <svg
              className="w-6 h-6 text-[rgba(139,115,85,1)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Ihre Privatsphäre ist uns wichtig
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
              Einige Cookies sind notwendig für den Betrieb der Website, während andere uns helfen, die Website und Ihr Erlebnis zu verbessern.
            </p>

            {showDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-2">
                <div>
                  <strong className="text-gray-900">Notwendige Cookies:</strong> Diese Cookies sind für die Grundfunktionen der Website erforderlich
                  (z.B. Warenkorb, Anmeldung). Sie können nicht deaktiviert werden.
                </div>
                <div>
                  <strong className="text-gray-900">Analyse-Cookies:</strong> Helfen uns zu verstehen, wie Besucher mit der Website interagieren
                  (Google Analytics, Meta Pixel). Diese Daten werden anonymisiert und dienen der Verbesserung unseres Angebots.
                </div>
                <div>
                  <strong className="text-gray-900">Marketing-Cookies:</strong> Werden verwendet, um Ihnen relevante Werbung anzuzeigen
                  (Meta/Facebook). Sie können diese ablehnen.
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-[rgba(139,115,85,1)] hover:underline mt-2 font-medium"
            >
              {showDetails ? 'Weniger anzeigen' : 'Mehr erfahren'}
            </button>
          </div>
        </div>
      </div>
    </CookieConsentLib>
  )
}
