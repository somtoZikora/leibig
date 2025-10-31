import React from 'react'
import { ShieldCheck, Truck, MessageCircle, Home } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "Sichere Zahlung",
      description: "Ob Kreditkarte, PayPal oder Klarna – bei uns zahlst du entspannt & sicher."
    },
    {
      id: 2,
      icon: Truck,
      title: "Bequeme Lieferung",
      description: "Ab 72 € versandkostenfrei – Mosel-Charakter direkt zu dir nach Hause."
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "Persönlicher Service",
      description: "Fragen zum Wein oder zur Auswahl? Wir sind persönlich für dich da."
    },
    {
      id: 4,
      icon: Home,
      title: "Direkt vom Weingut",
      description: "Jede Flasche kommt ohne Umwege direkt aus unserem Keller zu dir"
    }
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.id} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-[rgba(139,115,85,0.1)] rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
