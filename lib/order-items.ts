/**
 * Order items point at the product or bundle that was bought with a weak reference.
 * A strong reference would stop that product or bundle from ever being unpublished or
 * deleted in Sanity. The order keeps what was bought in its productSnapshot.
 */
export function weakProductRef(id: string) {
  return { _type: 'reference' as const, _ref: id, _weak: true as const }
}

type OrderItemInput = { product?: { _ref?: unknown } | null }

/** Returns the order with every items[].product reference marked weak. Other fields are kept. */
export function withWeakProductRefs<T extends object>(order: T): T {
  const items = (order as { items?: unknown }).items
  if (!Array.isArray(items)) return order
  return {
    ...order,
    items: items.map((item: OrderItemInput) =>
      item?.product && typeof item.product._ref === 'string'
        ? { ...item, product: { ...item.product, _weak: true } }
        : item
    ),
  }
}
