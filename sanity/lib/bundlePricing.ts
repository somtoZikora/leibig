// Pure helpers for bundle pricing in the Studio (validation + editor helper).
// All amounts are gross EUR. Work in integer cents to avoid float drift.

export const toCents = (value: number) => Math.round(value * 100)

export const formatEuro = (value: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)

export type BundleItemValue = {
  _key?: string
  product?: { _ref?: string }
  quantity?: number
  bundlePrice?: number
}

const hasBundlePrice = (item: BundleItemValue) =>
  typeof item.bundlePrice === 'number' && !Number.isNaN(item.bundlePrice)

/**
 * Validates explicit per-bottle bundle prices against the bundle price.
 * Returns an error message, or true when valid / not used.
 */
export function validateBundlePrices(
  items: BundleItemValue[] | undefined,
  bundlePrice: number | undefined
): true | string {
  if (!items?.length) return true
  const withPrice = items.filter(hasBundlePrice)
  if (withPrice.length === 0) return true

  if (withPrice.length !== items.length) {
    return `„Preis pro Flasche im Paket“ ist nur bei ${withPrice.length} von ${items.length} Weinen gesetzt. Entweder bei allen Weinen ausfüllen oder bei allen leer lassen.`
  }

  // Same rule as splitBundlePrice: explicit prices are only used if all are > 0.
  if (items.some(item => (item.bundlePrice as number) <= 0)) {
    return '„Preis pro Flasche im Paket“ muss bei allen Weinen größer als 0 € sein.'
  }

  const sumCents = items.reduce(
    (sum, item) => sum + toCents(item.bundlePrice as number) * (item.quantity ?? 0),
    0
  )
  if (typeof bundlePrice !== 'number') {
    return `Summe der Paketpreise ${formatEuro(sumCents / 100)} – bitte zuerst den Paketpreis angeben.`
  }
  if (sumCents !== toCents(bundlePrice)) {
    return `Summe der Paketpreise ${formatEuro(sumCents / 100)} ≠ Paketpreis ${formatEuro(bundlePrice)}`
  }
  return true
}
