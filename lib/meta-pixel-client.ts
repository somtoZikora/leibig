/**
 * Client-side helpers for Meta Pixel / Conversions API.
 * Use only in browser (e.g. in "use client" components).
 */

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

/**
 * Returns fbc, fbp, and eventSourceUrl for sending to the Meta Conversion API.
 * Improves event matching when sent with server-side events.
 */
export function getMetaConversionParams(): {
  fbc: string | undefined
  fbp: string | undefined
  eventSourceUrl: string | undefined
} {
  if (typeof window === 'undefined') {
    return { fbc: undefined, fbp: undefined, eventSourceUrl: undefined }
  }
  return {
    fbc: getCookie('_fbc'),
    fbp: getCookie('_fbp'),
    eventSourceUrl: window.location.href,
  }
}
