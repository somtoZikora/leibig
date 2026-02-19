/**
 * Facebook Commerce Catalog CSV Generator
 *
 * This script fetches all products and bundles from Sanity and generates
 * a Facebook Commerce catalog CSV file that can be uploaded to Meta Business Suite.
 *
 * Usage:
 *   npx tsx scripts/generate-facebook-catalog-csv.ts
 *
 * Output:
 *   facebook_catalog.csv in the project root
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import * as fs from 'fs'
import * as path from 'path'
import { WineProduct, BundleProduct, PortableTextBlock, SanityImage } from '../lib/sanity'

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3y5r987r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Don't use CDN for data export
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skzMOZGs9ukhmNYjuopqdOvQptphB94RByKXP3UKbju8z9nYMWwkF0RO4aqgcmSyOVNADXIT0ues2UPwdBXdJlvD0ghlkF463xF0yeAgFg7nQNWhjIkQFqLRmLF8aHtEALxTeckOcttDpGj4jSFe2uUyB76fI4TIeZW04kcj62hN3wEhTfTH', // Optional: only needed if you have private documents
})

// Image URL builder
const builder = imageUrlBuilder(client)

/**
 * Convert Sanity image to full URL
 */
function getImageUrl(image: SanityImage | null | undefined): string {
  if (!image || !image.asset) return ''
  return builder.image(image).quality(100).width(1200).url()
}

/**
 * Convert Portable Text (rich text) to plain text
 */
function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || blocks.length === 0) return ''

  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map(child => child.text).join('')
    })
    .join(' ')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

/**
 * Format price for Facebook (number with currency code)
 */
function formatPrice(price: number | undefined): string {
  if (!price) return '0.00 EUR'
  return `${price.toFixed(2)} EUR`
}

/**
 * Determine availability based on stock
 */
function getAvailability(stock: number | undefined, isArchived: boolean = false): string {
  if (isArchived) return 'out of stock'
  if (!stock || stock <= 0) return 'out of stock'
  return 'in stock'
}

/**
 * Get brand name (wine producer or default)
 */
function getBrand(product: WineProduct): string {
  // Use producer name if available, otherwise default brand
  if (product.erzeuger) {
    // Clean up producer text
    return product.erzeuger.replace(/\n/g, ' ').trim().substring(0, 100)
  }
  return 'Weingut Kirsten Liebieg'
}

/**
 * Build product description with wine details
 */
function buildDescription(product: WineProduct): string {
  let description = portableTextToPlainText(product.description)

  // Add wine-specific details
  const wineDetails: string[] = []

  if (product.jahrgang) wineDetails.push(`Jahrgang: ${product.jahrgang}`)
  if (product.rebsorte) wineDetails.push(`Rebsorte: ${product.rebsorte}`)
  if (product.geschmack) wineDetails.push(`Geschmack: ${product.geschmack}`)
  if (product.qualitaet) wineDetails.push(`Qualität: ${product.qualitaet}`)
  if (product.alkohol) wineDetails.push(`Alkohol: ${product.alkohol}%`)
  if (product.liter) wineDetails.push(`Füllmenge: ${product.liter}L`)

  if (wineDetails.length > 0) {
    description += '\n\n' + wineDetails.join(' | ')
  }

  // Trim to Facebook's limit
  return description.substring(0, 9999)
}

/**
 * Build bundle description with component products
 */
function buildBundleDescription(bundle: BundleProduct): string {
  let description = portableTextToPlainText(bundle.description)

  // Note: Bundle items are references, so we note this is a bundle
  description += '\n\nDieses Bundle ist ein Weinpaket mit mehreren ausgewählten Weinen.'

  return description.substring(0, 9999)
}

/**
 * Get product URL on the website
 */
function getProductUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kirsten-liebieg.de'
  return `${baseUrl}/produkt/${slug}`
}

/**
 * Get bundle URL on the website
 */
function getBundleUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kirsten-liebieg.de'
  return `${baseUrl}/bundle/${slug}`
}

/**
 * Get sale price effective dates (if on sale)
 */
function getSalePriceEffectiveDate(discount: number | undefined, oldPrice: number | undefined): string {
  if (!discount || !oldPrice) return ''

  // Set sale period: now until 1 year from now
  const now = new Date()
  const endDate = new Date()
  endDate.setFullYear(endDate.getFullYear() + 1)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T00:00+01:00`
  }

  return `${formatDate(now)}/${formatDate(endDate)}`
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSV(value: string | number | undefined): string {
  if (value === undefined || value === null) return ''

  const str = String(value)

  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

/**
 * Convert product to Facebook catalog row
 */
function productToCSVRow(product: WineProduct): string[] {
  const slug = product.slug?.current || ''
  const availability = getAvailability(product.stock, product.isArchived)
  const hasSale = product.oldPrice && product.oldPrice > product.price

  return [
    product._id, // id
    product.title || '', // title
    buildDescription(product), // description
    availability, // availability
    'new', // condition
    formatPrice(product.price), // price
    getProductUrl(slug), // link
    getImageUrl(product.image), // image_link
    getBrand(product), // brand
    'Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine', // google_product_category
    'Food & Beverage > Alcoholic Beverages > Wine', // fb_product_category
    String(product.stock || 0), // quantity_to_sell_on_facebook
    hasSale ? formatPrice(product.oldPrice) : '', // sale_price
    hasSale ? getSalePriceEffectiveDate(product.discount, product.oldPrice) : '', // sale_price_effective_date
    '', // item_group_id (could be used for vintages)
    'unisex', // gender
    '', // color
    product.liter ? `${product.liter}L` : '', // size (bottle size)
    'adult', // age_group (wine is for adults)
    '', // material
    '', // pattern
    '', // shipping (leave empty to use default)
    '', // shipping_weight (could calculate based on liter)
    '', // video[0].url
    '', // video[0].tag[0]
    product.artikelnummer || '', // gtin (use article number as identifier)
    product.tags?.[0] || '', // product_tags[0]
    product.tags?.[1] || '', // product_tags[1]
    product.tasteCollection?.[0] || '', // style[0] (use taste collection)
  ]
}

/**
 * Convert bundle to Facebook catalog row
 */
function bundleToCSVRow(bundle: BundleProduct): string[] {
  const slug = bundle.slug?.current || ''
  const hasSale = bundle.oldPrice && bundle.oldPrice > bundle.price

  return [
    bundle._id, // id
    bundle.title || '', // title
    buildBundleDescription(bundle), // description
    'in stock', // availability (bundles are virtual, assume available)
    'new', // condition
    formatPrice(bundle.price), // price
    getBundleUrl(slug), // link
    getImageUrl(bundle.image), // image_link
    'Weingut Kirsten Liebieg', // brand
    'Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine', // google_product_category
    'Food & Beverage > Alcoholic Beverages > Wine', // fb_product_category
    '10', // quantity_to_sell_on_facebook (arbitrary for bundles)
    hasSale ? formatPrice(bundle.oldPrice) : '', // sale_price
    hasSale ? getSalePriceEffectiveDate(bundle.discount, bundle.oldPrice) : '', // sale_price_effective_date
    '', // item_group_id
    'unisex', // gender
    '', // color
    '', // size
    'adult', // age_group (wine is for adults)
    '', // material
    '', // pattern
    '', // shipping
    '', // shipping_weight
    '', // video[0].url
    '', // video[0].tag[0]
    '', // gtin
    bundle.tags?.[0] || '', // product_tags[0]
    bundle.tags?.[1] || '', // product_tags[1]
    bundle.tasteCollection?.[0] || '', // style[0]
  ]
}

/**
 * Main function to generate CSV
 */
async function generateFacebookCatalog() {
  console.log('🍷 Fetching products from Sanity...')

  // Fetch all products (excluding archived)
  const products = await client.fetch<WineProduct[]>(`
    *[_type == "product" && !isArchived] | order(title asc) {
      _id,
      title,
      slug,
      image,
      gallery,
      description,
      price,
      oldPrice,
      discount,
      stock,
      isArchived,
      tags,
      tasteCollection,
      artikelnummer,
      jahrgang,
      rebsorte,
      geschmack,
      qualitaet,
      alkohol,
      liter,
      zucker,
      saeure,
      erzeuger,
      enthaeltSulfite
    }
  `)

  console.log(`✓ Found ${products.length} products`)

  // Fetch all bundles
  const bundles = await client.fetch<BundleProduct[]>(`
    *[_type == "bundle"] | order(title asc) {
      _id,
      title,
      slug,
      image,
      gallery,
      description,
      price,
      oldPrice,
      discount,
      tags,
      tasteCollection,
      bundleItems
    }
  `)

  console.log(`✓ Found ${bundles.length} bundles`)

  // CSV Header
  const header = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
    'quantity_to_sell_on_facebook',
    'sale_price',
    'sale_price_effective_date',
    'item_group_id',
    'gender',
    'color',
    'size',
    'age_group',
    'material',
    'pattern',
    'shipping',
    'shipping_weight',
    'video[0].url',
    'video[0].tag[0]',
    'gtin',
    'product_tags[0]',
    'product_tags[1]',
    'style[0]',
  ]

  // Build CSV content
  const rows: string[][] = [header]

  // Add all products
  products.forEach(product => {
    rows.push(productToCSVRow(product))
  })

  // Add all bundles
  bundles.forEach(bundle => {
    rows.push(bundleToCSVRow(bundle))
  })

  // Convert to CSV string
  const csvContent = rows
    .map(row => row.map(escapeCSV).join(','))
    .join('\n')

  // Write to file
  const outputPath = path.join(process.cwd(), 'facebook_catalog.csv')
  fs.writeFileSync(outputPath, csvContent, 'utf-8')

  console.log(`\n✅ Facebook catalog CSV generated successfully!`)
  console.log(`📁 File location: ${outputPath}`)
  console.log(`📊 Total items: ${products.length + bundles.length} (${products.length} products + ${bundles.length} bundles)`)
  console.log('\n📤 You can now upload this CSV to Meta Business Suite:')
  console.log('   https://business.facebook.com/commerce/catalogs')
}

// Run the script
generateFacebookCatalog()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error generating catalog:', error)
    process.exit(1)
  })
