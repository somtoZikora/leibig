"use client"

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CartItem } from '@/lib/store'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import ReactPixel from 'react-facebook-pixel'
import { getMetaConversionParams } from '@/lib/meta-pixel-client'

interface ExpressPayPalButtonProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  discount?: number
  voucherCode?: string
  onSuccess: () => void
  disabled?: boolean
}

export function ExpressPayPalButton({
  items,
  subtotal,
  shipping,
  total,
  discount = 0,
  voucherCode,
  onSuccess,
  disabled = false
}: ExpressPayPalButtonProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        PayPal ist derzeit nicht verfügbar. Bitte verwenden Sie die traditionelle Kasse.
      </div>
    )
  }

  // Determine if we're in sandbox mode
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === 'sandbox'

  return (
    <div>
      {/* Sandbox Mode Indicator */}
      {isSandbox && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-700 text-xs font-medium">
              🧪 SANDBOX MODE - Testumgebung
            </span>
          </div>
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "EUR",
          intent: "capture"
        }}
      >
        <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <PayPalButtons
          disabled={disabled || isProcessing}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'checkout',
            height: 48
          }}

          // Step 1: Create PayPal order with line items
          createOrder={async (data, actions) => {
            setIsProcessing(true)
            try {
              return await actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                  amount: {
                    currency_code: "EUR",
                    value: total.toFixed(2),
                    breakdown: {
                      item_total: {
                        currency_code: "EUR",
                        value: subtotal.toFixed(2)
                      },
                      shipping: {
                        currency_code: "EUR",
                        value: shipping.toFixed(2)
                      }
                    }
                  },
                  items: items.map(item => ({
                    name: item.title,
                    unit_amount: {
                      currency_code: "EUR",
                      value: item.price.toFixed(2)
                    },
                    quantity: item.quantity.toString(),
                    description: item.selectedSize
                      ? `Größe: ${item.selectedSize}`
                      : undefined
                  }))
                }],
                // Enable shipping address collection
                application_context: {
                  shipping_preference: "GET_FROM_FILE" // Use PayPal address
                }
              })
            } catch (error) {
              console.error('Error creating PayPal order:', error)
              setIsProcessing(false)
              throw error
            }
          }}

          // Step 2: Capture payment and create order with PayPal address
          onApprove={async (data, actions) => {
            try {
              // Capture the payment
              const orderDetails = await actions.order!.capture()

              // Extract shipping address from PayPal
              const shippingInfo = orderDetails.purchase_units?.[0]?.shipping
              const payerInfo = orderDetails.payer

              // Prepare shipping address
              const shippingAddress = {
                firstName: shippingInfo?.name?.given_name || payerInfo?.name?.given_name || '',
                lastName: shippingInfo?.name?.surname || payerInfo?.name?.surname || '',
                street: shippingInfo?.address?.address_line_1 || '',
                city: shippingInfo?.address?.admin_area_2 || '',
                postalCode: shippingInfo?.address?.postal_code || '',
                country: shippingInfo?.address?.country_code || 'DE'
              }

              // Create order in your system
              const response = await fetch('/api/orders/express-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paypalOrderId: orderDetails.id,
                  paypalPaymentId: orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.id,
                  paypalPayerId: orderDetails.payer?.payer_id,
                  items: items.map(item => ({
                    product: item.id,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price,
                    selectedSize: item.selectedSize,
                    image: item.image
                  })),
                  subtotal,
                  discount,
                  voucherCode,
                  shipping,
                  total,
                  currency: 'EUR',
                  shippingAddress,
                  billingAddress: shippingAddress, // Use same as shipping
                  customerEmail: payerInfo?.email_address,
                  customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                  paymentMethod: 'paypal',
                  paymentStatus: 'captured',
                  userId: user?.id
                })
              })

              const result = await response.json()

              if (!response.ok) {
                throw new Error(result.error || 'Bestellerstellung fehlgeschlagen')
              }

              // Track Purchase event - Meta Pixel (client-side)
              ReactPixel.track('Purchase', {
                content_ids: items.map(item => item.id),
                contents: items.map(item => ({
                  id: item.id,
                  quantity: item.quantity,
                })),
                value: total,
                currency: 'EUR',
                num_items: items.reduce((sum, item) => sum + item.quantity, 0),
              })

              // Track Purchase event (server-side Conversions API)
              try {
                const metaParams = getMetaConversionParams()
                await fetch('/api/meta-conversion', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    eventName: 'Purchase',
                    email: payerInfo?.email_address ?? undefined,
                    value: total,
                    currency: 'EUR',
                    contents: items.map(item => ({
                      id: item.id,
                      quantity: item.quantity,
                      item_price: item.price,
                    })),
                    fbc: metaParams.fbc,
                    fbp: metaParams.fbp,
                    eventSourceUrl: metaParams.eventSourceUrl,
                  }),
                })
              } catch (conversionError) {
                console.error('Failed to send Conversions API event:', conversionError)
              }

              // Clear cart
              onSuccess()

              // Redirect to success page
              router.push(`/checkout/success?orderId=${result.orderId}`)

              toast.success('Zahlung erfolgreich!')
            } catch (error) {
              console.error('Express checkout error:', error)
              toast.error('Fehler bei der Zahlung. Bitte versuchen Sie es erneut.')
              setIsProcessing(false)
            }
          }}

          onError={(err) => {
            console.error('PayPal error:', err)
            toast.error('PayPal-Fehler. Bitte versuchen Sie es erneut.')
            setIsProcessing(false)
          }}

          onCancel={() => {
            toast.info('Zahlung abgebrochen.')
            setIsProcessing(false)
          }}
        />
        </div>
      </PayPalScriptProvider>
    </div>
  )
}
