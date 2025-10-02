import React from 'react'
import Image from 'next/image'


interface ProcessStep {
    id: string
    title: string;
    description: string;
}
const WineProcessSection = () => {

    const processSteps = [
    {
      id: 1,
      title: "Klassische Weingewinnung",
      description: "Vinothek zwischen Ire Geschmacksrichtungen und schöne perfekte Weine aus unserer Kollektion vor",
    },
    {
      id: 2,
      title: "Klassische Weingewinnung",
      description: "Vinothek zwischen Ire Geschmacksrichtungen und schöne perfekte Weine aus unserer Kollektion vor",
    },
    {
      id: 3,
      title: "Klassische Weingewinnung",
      description: "Vinothek zwischen Ire Geschmacksrichtungen und schöne perfekte Weine aus unserer Kollektion vor",
    },
    {
      id: 4,
      title: "Klassische Weingewinnung",
      description: "Vinothek zwischen Ire Geschmacksrichtungen und schöne perfekte Weine aus unserer Kollektion vor",
    },
  ]
  return (
    <section className="hidden md:block py-8 px-4 bg-white">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
    {/* Left side - Image */}
    <div className="relative h-[500px] w-full">
      <Image
        src="/images/process_wine.jpg"
        alt="Person holding wine glass"
        fill
        className="object-cover rounded-l-lg"
        priority
      />
    </div>

    {/* Right side - Content inside gray box */}
    <div className="bg-[#F0F0F0] p-6 rounded-r-lg flex flex-col justify-center">
      <div className="space-y-4">
        {/* Title */}
        <h2 className="text-2xl lg:text-2xl font-semibold text-gray-900 leading-tight">
          Vom Weinberg bis zu Ihrem Tisch - <br />
        so stellen wir Wein her
        </h2>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              {/* Circular Icon */}
              <div className="w-12 h-12 bg-gradient-to-b from-blue-700 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">{step.id}</span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 text-xs leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


  )
}

export default WineProcessSection