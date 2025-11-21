import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

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
          ],
          preview: {
            select: {
              title: 'product.title',
              quantity: 'quantity',
              media: 'product.image',
            },
            prepare({ title, quantity, media }) {
              return {
                title: title || 'Untitled Product',
                subtitle: `Quantity: ${quantity}`,
                media,
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(2).error('Bundle must contain at least 2 products'),
    }),
    defineField({
      name: 'price',
      title: 'Bundle Price',
      type: 'number',
      description: 'Fixed price for the entire bundle',
      validation: Rule => Rule.required().min(0),
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
