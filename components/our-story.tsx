import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const OurStory = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="bg-[rgba(139,115,85,0.1)] rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-black">Das Team hinter Kirsten-Liebieg</h2>
            <p className="text-xl lg:text-2xl text-gray-700 font-semibold">
              Mosel im Blut
            </p>
            <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
              Hinter jedem großartigen Wein stecken Menschen mit Leidenschaft und Hingabe. Unser Team vereint jahrzehntelange Erfahrung, Liebe zur Mosel und das Streben nach Perfektion. Lerne die Gesichter kennen, die Tag für Tag daran arbeiten, dir unvergessliche Weinmomente zu bescheren.
            </p>
            <Link href="/ueber-uns">
              <Button className="bg-black text-white px-8 py-6 text-lg rounded-lg font-medium hover:bg-[rgba(139,115,85,0.8)]">
                Lerne uns kennen
              </Button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/Über uns - About Us/Ende ein gesamtes Team/4_5.jpg"
              alt="Kirsten-Liebieg Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
