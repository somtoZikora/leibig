/**
 * Bundle price splitting for Winestro orders
 *
 * Winestro has no notion of bundles: each bundle is expanded into its component
 * wines, and Winestro would price them at catalog price. To make the order in
 * Winestro match what the customer paid, every component position carries a
 * per-bottle special price (Winestro newOrder param `artikel_sonderpreis[x]`).
 *
 * Pure module (no I/O) so it can be tested in isolation. All money is handled
 * in integer cents internally.
 */

export interface BundleComponentInput {
  winestroId: string
  /** Bottles of this wine in ONE bundle */
  quantity: number
  /** Catalog price per bottle of the component product (gross EUR) */
  productPrice?: number | null
  /** Optional per-bottle price within the bundle, maintained in Sanity (gross EUR) */
  bundlePrice?: number | null
}

export interface PricedBundlePosition {
  winestroId: string
  /** Total bottles for this position (already multiplied by order quantity) */
  quantity: number
  /** Special price per bottle in cents */
  unitPriceCents: number
}

export type BundleSplitResult =
  | { ok: true; source: 'bundlePrice' | 'proportional'; positions: PricedBundlePosition[] }
  | { ok: false; reason: string }

export const toCents = (amount: number): number => Math.round(amount * 100)

export const formatCents = (cents: number): string => (cents / 100).toFixed(2)

/**
 * Split a bundle price into per-bottle special prices for its components.
 *
 * 1. If every component has a bundlePrice and Σ(bundlePrice × qty) equals the
 *    bundle price to the cent, those prices are used as-is.
 * 2. Otherwise prices are split proportionally to the catalog prices with the
 *    exact factor bundlePrice / Σ(productPrice × qty), rounded to the cent.
 *    The rounding remainder goes onto a position whose bottle count divides it
 *    evenly; if none exists, one bottle is split off into its own position.
 *
 * The split is computed for ONE bundle, then bottle counts are multiplied by
 * the order quantity (the price per bottle stays the same), so every copy of
 * the bundle sums to exactly the bundle price.
 */
export function splitBundlePrice(
  bundlePrice: number,
  components: BundleComponentInput[],
  orderQuantity: number
): BundleSplitResult {
  if (!Number.isFinite(bundlePrice) || bundlePrice <= 0) {
    return { ok: false, reason: `invalid bundle price ${bundlePrice}` }
  }
  if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
    return { ok: false, reason: `invalid order quantity ${orderQuantity}` }
  }
  if (components.length === 0 || components.some(c => !Number.isInteger(c.quantity) || c.quantity < 1)) {
    return { ok: false, reason: 'bundle has no components or invalid component quantities' }
  }

  const bundleCents = toCents(bundlePrice)
  const scale = (positions: Array<{ winestroId: string; quantity: number; unitPriceCents: number }>) =>
    positions.map(p => ({ ...p, quantity: p.quantity * orderQuantity }))

  // 1. Explicit per-bottle bundle prices from Sanity
  const allHaveBundlePrice = components.every(
    c => typeof c.bundlePrice === 'number' && Number.isFinite(c.bundlePrice) && c.bundlePrice > 0
  )
  if (allHaveBundlePrice) {
    const explicit = components.map(c => ({
      winestroId: c.winestroId,
      quantity: c.quantity,
      unitPriceCents: toCents(c.bundlePrice as number)
    }))
    const explicitSum = explicit.reduce((sum, p) => sum + p.unitPriceCents * p.quantity, 0)
    if (explicitSum === bundleCents) {
      return { ok: true, source: 'bundlePrice', positions: scale(explicit) }
    }
  }

  // 2. Proportional split by catalog price
  if (components.some(c => typeof c.productPrice !== 'number' || !Number.isFinite(c.productPrice) || c.productPrice <= 0)) {
    return { ok: false, reason: 'component product price missing - cannot split bundle price' }
  }
  const catalogCents = components.map(c => toCents(c.productPrice as number))
  const catalogSum = components.reduce((sum, c, i) => sum + catalogCents[i] * c.quantity, 0)

  // Exact factor bundleCents / catalogSum, applied in integer arithmetic before rounding
  const positions = components.map((c, i) => ({
    winestroId: c.winestroId,
    quantity: c.quantity,
    unitPriceCents: Math.round((catalogCents[i] * bundleCents) / catalogSum)
  }))

  const remainder = bundleCents - positions.reduce((sum, p) => sum + p.unitPriceCents * p.quantity, 0)
  if (remainder === 0) {
    return { ok: true, source: 'proportional', positions: scale(positions) }
  }

  // Candidates ordered by bottle count (spreads the remainder thinnest), then by price
  const order = positions
    .map((p, i) => i)
    .sort((a, b) =>
      positions[b].quantity - positions[a].quantity ||
      positions[b].unitPriceCents - positions[a].unitPriceCents
    )

  const evenIndex = order.find(
    i => remainder % positions[i].quantity === 0 &&
      positions[i].unitPriceCents + remainder / positions[i].quantity > 0
  )
  if (evenIndex !== undefined) {
    positions[evenIndex].unitPriceCents += remainder / positions[evenIndex].quantity
    return { ok: true, source: 'proportional', positions: scale(positions) }
  }

  // No position divides evenly: split one bottle off the most expensive position
  const splitIndex = [...positions.keys()]
    .sort((a, b) => positions[b].unitPriceCents - positions[a].unitPriceCents)
    .find(i => positions[i].unitPriceCents + remainder > 0)
  if (splitIndex === undefined) {
    return { ok: false, reason: 'could not distribute rounding remainder' }
  }
  const source = positions[splitIndex]
  const result = [...positions]
  result.splice(
    splitIndex,
    1,
    { ...source, quantity: source.quantity - 1 },
    { ...source, quantity: 1, unitPriceCents: source.unitPriceCents + remainder }
  )
  return { ok: true, source: 'proportional', positions: scale(result.filter(p => p.quantity > 0)) }
}
