"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinueShopping: () => void
  onProceedToCheckout: () => void
}

export function CheckoutDialog({
  open,
  onOpenChange,
  onContinueShopping,
  onProceedToCheckout,
}: CheckoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white">
        {/* Content */}
        <div className="p-8 md:p-12">
          <DialogHeader className="space-y-6">
            <DialogTitle className="text-center text-2xl md:text-3xl font-normal leading-tight text-black">
              Bitte beachten Sie, dass wir unsere Weine und Sekte ausschließlich in Versandkartons mit 6 oder 12 Flaschen versenden.
            </DialogTitle>
            <DialogDescription className="text-center text-lg md:text-xl font-normal leading-relaxed text-black">
              Wir bitten Sie daher, Ihre Bestellung in vollen 6er- oder 12er-Schritten aufzugeben (z. B. 6, 12, 18 Flaschen usw.), um einen sicheren und effizienten Versand zu gewährleisten.
              <br />
              <br />
              Vielen Dank für Ihr Verständnis!
            </DialogDescription>
          </DialogHeader>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              onClick={onContinueShopping}
              className="flex-1 bg-[rgba(139,115,85,0.8)] hover:bg-[rgba(139,115,85,1)] text-white py-6 rounded-lg text-base font-medium uppercase tracking-wide"
              size="lg"
            >
              WEITER EINKAUFEN
            </Button>
            <Button
              onClick={onProceedToCheckout}
              variant="outline"
              className="flex-1 border-2 border-[rgba(139,115,85,0.8)] text-[rgba(139,115,85,0.8)] hover:bg-[rgba(139,115,85,0.05)] py-6 rounded-lg text-base font-medium uppercase tracking-wide"
              size="lg"
            >
              ZUR KASSE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
