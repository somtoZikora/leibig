import { Button } from "@/components/ui/button"
import Image from "next/image"

const OurStory = () => {
  return (
    <section className="hidden md:block py-16 px-4 max-w-7xl mx-auto">
      <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-black">UNSERE GESCHICHTE</h2>
            <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
              In einer malerischen Region begann die Geschichte eines Weinguts, als ein leidenschaftlicher Winzer seine
              ersten Reben pflanzte. Über die Jahre entwickelte sich eine Tradition, die für ihre herausragenden Weine
              bekannt wurde und weltweit geschätzt wird. Heute kombiniert wird, um Weine zu schaffen, die den
              einzigartigen Charakter der Region widerspiegeln.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium">
              See More
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden bg-white shadow-sm">
           <Image
        src="/images/ourstory.jpg"
        alt="Hands holding fresh grapes from vineyard"
        className="object-cover"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
