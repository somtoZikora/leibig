import { client } from './sanity'
import { type CartItem } from './store'

/**
 * Calculates the total number of bottles in the cart
 * Takes into account bundles which may contain multiple bottles
 */
export async function calculateTotalBottles(cartItems: CartItem[]): Promise<number> {
  let totalBottles = 0

  // Fetch full product details for all cart items to check if they're bundles
  for (const item of cartItems) {
    try {
      // Query Sanity to get the full product details including bundle information
      const product = await client.fetch(
        `*[_id == $productId][0]{
          _id,
          _type,
          title,
          "bundleItems": bundleItems[]{
            quantity,
            product->{_id, title}
          }
        }`,
        { productId: item.id }
      )

      if (!product) {
        // If product not found, assume it's a single bottle
        totalBottles += item.quantity
        continue
      }

      if (product._type === 'bundle' && product.bundleItems) {
        // For bundles, sum up all the bottles in the bundle
        const bottlesInBundle = product.bundleItems.reduce(
          (sum: number, bundleItem: any) => sum + (bundleItem.quantity || 0),
          0
        )
        // Multiply by the quantity of this bundle in the cart
        totalBottles += bottlesInBundle * item.quantity
      } else {
        // Regular product: 1 bottle per quantity
        totalBottles += item.quantity
      }
    } catch (error) {
      console.error(`Error fetching product ${item.id}:`, error)
      // On error, assume it's a single bottle
      totalBottles += item.quantity
    }
  }

  return totalBottles
}

/**
 * Checks if the total bottle count is a multiple of 6
 */
export function isMultipleOfSix(bottleCount: number): boolean {
  return bottleCount % 6 === 0
}

/**
 * Calculates how many more bottles are needed to reach the next multiple of 6
 */
export function bottlesNeededForSix(bottleCount: number): number {
  if (bottleCount === 0) return 6
  const remainder = bottleCount % 6
  return remainder === 0 ? 0 : 6 - remainder
}
