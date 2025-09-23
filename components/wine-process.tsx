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
    <section className="hidden md:block py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
    {/* Left side - Image */}
    <div className="relative h-[900px] w-full">
      <Image
        src="/images/process_wine.jpg"
        alt="Person holding wine glass"
        fill
        className="object-cover rounded-l-lg"
        priority
      />
    </div>

    {/* Right side - Content inside gray box */}
    <div className="bg-[#F0F0F0] p-10 rounded-r-lg flex flex-col justify-center">
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-3xl lg:text-[30px] font-semibold text-gray-900 leading-tight">
          Vom Weinberg bis zu Ihrem Tisch - <br />
        so stellen wir Wein her
          {/* <span className="text-gray-700"> so stellen wir Wein her</span> */}
        </h2>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              {/* Circular Icon */}
              <div className="w-16 h-16 bg-gradient-to-b from-blue-700 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg font-bold">{step.id}</span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
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