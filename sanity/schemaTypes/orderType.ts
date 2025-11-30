import { BasketIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Unique order identifier',
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID',
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ausstehend', value: 'pending' },
          { title: 'Bezahlt', value: 'paid' },
          { title: 'Bearbeitung', value: 'processing' },
          { title: 'Versandt', value: 'shipped' },
          { title: 'Zugestellt', value: 'delivered' },
          { title: 'Storniert', value: 'cancelled' },
          { title: 'Rückerstattet', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          title: 'Order Item',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'productSnapshot',
              title: 'Product Snapshot',
              type: 'object',
              description: 'Product details at time of order',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Product Title',
                  type: 'string',
                }),
                defineField({
                  name: 'price',
                  title: 'Price at Purchase',
                  type: 'number',
                }),
                defineField({
                  name: 'image',
                  title: 'Product Image',
                  type: 'image',
                }),
              ],
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: Rule => Rule.required().min(1),
            }),
            defineField({
              name: 'selectedSize',
              title: 'Selected Size',
              type: 'string',
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            }),
            defineField({
              name: 'totalPrice',
              title: 'Total Price',
              type: 'number',
              validation: Rule => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: 'productSnapshot.title',
              quantity: 'quantity',
              unitPrice: 'unitPrice',
              media: 'productSnapshot.image',
            },
            prepare({ title, quantity, unitPrice, media }) {
              return {
                title: title || 'Product',
                subtitle: `${quantity}x à €${unitPrice}`,
                media,
              }
            },
          },
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'tax',
      title: 'Tax Amount',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'taxRate',
      title: 'Tax Rate (%)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(100),
      initialValue: 19,
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping Cost',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'total',
      title: 'Total Amount',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'EUR',
      options: {
        list: [
          { title: 'Euro (EUR)', value: 'EUR' },
          { title: 'US Dollar (USD)', value: 'USD' },
        ],
      },
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        defineField({
          name: 'company',
          title: 'Company Name',
          type: 'string',
          description: 'Optional company name',
        }),
        defineField({
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'street',
          title: 'Street Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'houseNumber',
          title: 'House Number',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'billingAddress',
      title: 'Billing Address',
      type: 'object',
      description: 'Billing address if different from shipping address',
      fields: [
        defineField({
          name: 'company',
          title: 'Company Name',
          type: 'string',
          description: 'Optional company name',
        }),
        defineField({
          name: 'firstName',
          title: 'First Name',
          type: 'string',
        }),
        defineField({
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
        }),
        defineField({
          name: 'street',
          title: 'Street Name',
          type: 'string',
        }),
        defineField({
          name: 'houseNumber',
          title: 'House Number',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'PayPal', value: 'paypal' },
          { title: 'Credit Card', value: 'credit_card' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ausstehend', value: 'pending' },
          { title: 'Autorisiert', value: 'authorized' },
          { title: 'Erfasst', value: 'captured' },
          { title: 'Fehlgeschlagen', value: 'failed' },
          { title: 'Rückerstattet', value: 'refunded' },
          { title: 'Teilweise rückerstattet', value: 'partially_refunded' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      description: 'PayPal payment ID or transaction reference',
    }),
    defineField({
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        defineField({
          name: 'paypalOrderId',
          title: 'PayPal Order ID',
          type: 'string',
        }),
        defineField({
          name: 'paypalPaymentId',
          title: 'PayPal Payment ID',
          type: 'string',
        }),
        defineField({
          name: 'paypalPayerId',
          title: 'PayPal Payer ID',
          type: 'string',
        }),
        defineField({
          name: 'transactionFee',
          title: 'Transaction Fee',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      description: 'Internal notes or customer comments',
    }),
    defineField({
      name: 'customerNotes',
      title: 'Customer Notes',
      type: 'text',
      description: 'Notes from customer about the order',
    }),
    defineField({
      name: 'winestroOrderNumber',
      title: 'Winestro Order Number',
      type: 'string',
      description: 'Order number from Winestro system',
      readOnly: true,
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipping tracking number',
    }),
    defineField({
      name: 'estimatedDelivery',
      title: 'Estimated Delivery Date',
      type: 'date',
    }),
    defineField({
      name: 'actualDelivery',
      title: 'Actual Delivery Date',
      type: 'datetime',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Created Date, Old',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
    {
      title: 'Order Number',
      name: 'orderNumberAsc',
      by: [{ field: 'orderNumber', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'customerEmail',
      status: 'status',
      total: 'total',
      createdAt: 'createdAt',
    },
    prepare({ title, subtitle, status, total, createdAt }) {
      const date = createdAt ? new Date(createdAt).toLocaleDateString('de-DE') : ''
      return {
        title: `Bestellung ${title}`,
        subtitle: `${subtitle} • €${total} • ${status} • ${date}`,
        media: BasketIcon,
      }
    },
  },
})