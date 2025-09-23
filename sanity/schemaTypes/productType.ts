import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
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
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.min(0),
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
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Klein', value: 'small' },
          { title: 'Mittel', value: 'medium' },
          { title: 'Groß', value: 'large' },
        ],
      },
    }),

    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          { title: 'TOP-VERKÄUFER', value: 'TOP-VERKÄUFER' },
          { title: 'STARTERSETS', value: 'STARTERSETS' },
        ],
      },
    }),


   defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Im Angebot", value: "Im Angebot" },
          { title: "Neuheiten", value: "Neuheiten" },
          { title: "Weine", value: "Weine" },
          
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
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'winestroId',
      title: 'Winestro Product ID',
      type: 'string',
      description: 'External ID from Winestro API for sync tracking',
      readOnly: true,
    }),
  ],
 preview: {
  select: {
    title: 'title',
    subtitle: 'price',
    media: 'image',
  },
  prepare({ title, subtitle, media }) {
    return {
      title,
      subtitle: subtitle ? `€${subtitle}` : 'No price',
      media,
    };
  },
},

});
