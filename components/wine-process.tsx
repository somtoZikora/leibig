import React from 'react'
import Image from 'next/image'


interface ProcessStep {
    id: number
    title: string;
    description: string;
    thumbnail: string;
}
const WineProcessSection = () => {

    const processSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Steillage ist unsere DNA",
      description: "27 Hektar Steil- und Steilstlagen an der Mosel – Handarbeit und Präzision, die Weine hervorbringen, die du so nur hier findest.",
      thumbnail: "https://images.unsplash.com/photo-1659602739291-282d182a335d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2306"
    },
    {
      id: 2,
      title: "100 % Handlese",
      description: "Wir lesen jede Traube von Hand – selektiert für höchste Qualität. So landet nur das Beste in deiner Flasche.",
      thumbnail: "https://images.unsplash.com/photo-1719170408739-b8521060b80f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287"
    },
    {
      id: 3,
      title: "Tradition & Spontangärung",
      description: "Seit Generationen vertrauen wir auf Spontangärung und minimalen Eingriff. So entstehen Weine mit unverfälschtem Charakter – perfekt für Kenner und Genießer.",
      thumbnail: "https://images.unsplash.com/photo-1739294523794-f1ab147cb747?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
    },
    {
      id: 4,
      title: "Sekte & Weine mit Profil",
      description: "Vom Riesling-Klassiker bis zum prickelnden Sekt – unsere Kollektion verbindet Tiefe, Eleganz und Vielfalt.",
      thumbnail: "https://images.unsplash.com/photo-1656235123277-9ac111857004?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1760"
    },
  ]
  return (
    <section className="py-12 px-4 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
    {/* Left side - Image */}
    <div className="relative h-[500px] lg:h-auto lg:min-h-full w-full">
      <Image
        src="/images/process_wine.jpg"
        alt="Person holding wine glass"
        fill
        className="object-cover rounded-l-lg"
        priority
      />
    </div>

    {/* Right side - Content inside light gray box */}
    <div className="bg-[#F5F5F5] p-8 lg:p-12 rounded-r-lg flex flex-col justify-center">
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          Darum lohnt sich jeder Schluck Kirsten-Liebieg:
        </h2>

        {/* Subtitle */}
        <p className="text-gray-700 text-base leading-relaxed">
          Bei Kirsten-Liebieg bekommst du keine Standardweine. Unsere Steillagen, Handlese und Spontangärung stehen für unverwechselbare Qualität. Vier starke Argumente, warum deine nächste Flasche unbedingt von uns sein sollte:
        </p>

        {/* Process Steps Grid - White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-3"
            >
              {/* Thumbnail Image */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
                <Image
                  src={step.thumbnail}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
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