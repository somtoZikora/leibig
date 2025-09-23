import { defineField, defineType } from 'sanity'

export const syncLogType = defineType({
  name: 'syncLog',
  title: 'Sync Log',
  type: 'document',
  fields: [
    defineField({
      name: 'timestamp',
      title: 'Sync Timestamp',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'stats',
      title: 'Sync Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'total',
          title: 'Total Products',
          type: 'number',
        }),
        defineField({
          name: 'new',
          title: 'New Products',
          type: 'number',
        }),
        defineField({
          name: 'updated',
          title: 'Updated Products',
          type: 'number',
        }),
        defineField({
          name: 'failed',
          title: 'Failed Products',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'success',
      title: 'Sync Success',
      type: 'boolean',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'timestamp',
      subtitle: 'stats.total',
    },
    prepare({ title, subtitle }) {
      return {
        title: `Sync: ${new Date(title).toLocaleString()}`,
        subtitle: subtitle ? `${subtitle} products` : 'No stats',
      }
    },
  },
})