import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { BundlePriceInput } from '../components/BundlePriceInput'
import { type BundleItemValue, formatEuro, validateBundlePrices } from '../lib/bundlePricing'

export const bundleType = defineType({
  name: 'bundle',
  title: 'Wine Bundle',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Bundle Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Bundle Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bundleItems',
      title: 'Bundle Products',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bundleItem',
          title: 'Bundle Item',
          fields: [
            {
              name: 'product',
              title: 'Wine Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 1,
              validation: Rule => Rule.required().min(1),
            },
            {
              name: 'bundlePrice',
              title: 'Preis pro Flasche im Paket (€)',
              type: 'number',
              description:
                'Optional. Bruttopreis pro Flasche dieses Weins innerhalb des Pakets – wird für die Winestro-Rechnung verwendet. Wenn leer, teilt der Shop den Paketpreis automatisch anteilig nach den Einzelpreisen auf. Wird er gesetzt, dann bei allen Weinen des Pakets, und die Summe (Preis × Menge) muss genau dem Paketpreis entsprechen.',
              validation: Rule => [
                Rule.positive().error('Preis muss größer als 0 € sein'),
                Rule.precision(2),
              ],
            },
          ],
          preview: {
            select: {
              title: 'product.title',
              quantity: 'quantity',
              bundlePrice: 'bundlePrice',
              media: 'product.image',
            },
            prepare({ title, quantity, bundlePrice, media }) {
              const priceSuffix =
                typeof bundlePrice === 'number' ? ` · ${formatEuro(bundlePrice)}/Fl.` : ''
              return {
                title: title || 'Untitled Product',
                subtitle: `Quantity: ${quantity}${priceSuffix}`,
                media,
              }
            },
          },
        },
      ],
      validation: Rule => [
        Rule.required().min(2).error('Bundle must contain at least 2 products'),
        // Explicit per-bottle bundle prices: all-or-nothing, and must add up to the bundle price.
        Rule.custom((items, context) =>
          validateBundlePrices(
            items as BundleItemValue[] | undefined,
            context.document?.price as number | undefined
          )
        ),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Bundle Price',
      type: 'number',
      description: 'Fixed price for the entire bundle',
      validation: Rule => Rule.required().min(0),
      components: { input: BundlePriceInput },
    }),
    defineField({
      name: 'oldPrice',
      title: 'Old Price',
      type: 'number',
      description: 'For showing discounts',
    }),
    defineField({
      name: 'discount',
      title: 'Discount (%)',
      type: 'number',
      description: 'Percentage discount',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Customer rating from 0 to 5',
      validation: Rule => Rule.min(0).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'status',
      title: 'Bundle Status',
      type: 'string',
      options: {
        list: [
          { title: 'TOP-VERKÄUFER', value: 'TOP-VERKÄUFER' },
          { title: 'STARTERSETS', value: 'STARTERSETS' },
        ],
      },
    }),
    defineField({
      name: 'variant',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Im Angebot', value: 'Im Angebot' },
          { title: 'Neuheiten', value: 'Neuheiten' },
          { title: 'Weine', value: 'Weine' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'tasteCollection',
      title: 'Taste Collection',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Assign bundle to taste collection categories for browse-by-taste feature',
      options: {
        list: [
          { title: 'Mineralisch & Tiefgründig', value: 'Mineralisch & Tiefgründig' },
          { title: 'Frisch & Lebendig', value: 'Frisch & Lebendig' },
          { title: 'Aromatisch & Charmant', value: 'Aromatisch & Charmant' },
          { title: 'Vollmundig & Komplex', value: 'Vollmundig & Komplex' },
        ],
      },
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      description: 'Custom meta title for SEO (recommended: 50-60 characters). If empty, the bundle title will be used.',
      validation: Rule => Rule.max(100),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      description: 'Custom meta description for SEO (recommended: 150-160 characters). If empty, the bundle description will be used.',
      validation: Rule => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'image',
      bundleItems: 'bundleItems',
    },
    prepare({ title, price, media, bundleItems }) {
      const itemCount = bundleItems?.length || 0
      return {
        title,
        subtitle: `€${price} • ${itemCount} product${itemCount !== 1 ? 's' : ''}`,
        media,
      }
    },
  },
})
