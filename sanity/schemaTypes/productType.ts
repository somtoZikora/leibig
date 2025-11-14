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
    defineField({
      name: 'artikelnummer',
      title: 'Artikelnummer',
      type: 'string',
      description: 'Article number from Winestro',
    }),
    defineField({
      name: 'qualitaet',
      title: 'Qualität',
      type: 'string',
      description: 'Wine quality level (e.g. Gutswein, Kabinett)',
    }),
    defineField({
      name: 'alkohol',
      title: 'Alkoholgehalt (%)',
      type: 'number',
      description: 'Alcohol percentage',
    }),
    defineField({
      name: 'liter',
      title: 'Füllmenge (Liter)',
      type: 'number',
      description: 'Bottle size in liters',
    }),
    defineField({
      name: 'zucker',
      title: 'Zuckergehalt',
      type: 'number',
      description: 'Sugar content',
    }),
    defineField({
      name: 'saeure',
      title: 'Säuregehalt',
      type: 'number',
      description: 'Acid content',
    }),
    defineField({
      name: 'brennwert',
      title: 'Brennwert (kcal)',
      type: 'number',
      description: 'Energy/calories per 100ml',
    }),
    defineField({
      name: 'kohlenhydrate',
      title: 'Kohlenhydrate',
      type: 'number',
      description: 'Carbohydrates per 100ml',
    }),
    defineField({
      name: 'eiweiss',
      title: 'Eiweiß',
      type: 'number',
      description: 'Protein per 100ml',
    }),
    defineField({
      name: 'fett',
      title: 'Fett',
      type: 'number',
      description: 'Fat per 100ml',
    }),
    defineField({
      name: 'salz',
      title: 'Salz',
      type: 'number',
      description: 'Salt per 100ml',
    }),
    defineField({
      name: 'erzeuger',
      title: 'Erzeuger',
      type: 'text',
      description: 'Producer information',
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
