'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>('longuicher')

  const vineyards = [
    {
      id: 'longuicher',
      name: 'Longuicher Maximiner Herrenberg',
      description: 'Der Longuicher Maximiner Herrenberg ist die westlichste unserer Lagen, sozusagen der Startpunkt. Dieser Weinberg wurde Anfang des 19. Jahrhunderts während der Säkularisation unter Napoleon im Département Moselle ersteigert und ist seitdem im Besitz einer Longuicher Familie, 1904 neu gepflanzt mit wurzelechten Reben. Diese Parzelle, die wir hier bewirtschaften dürfen, ist eine der wenigen wurzelechten, nichtgepfropften Rebanlagen Deutschlands, die die Reblaus überlebt haben. Jedes Jahr bringt dieser Weinberg hocharomatische Trauben von alten, filigranen Stöcken hervor. Leichter, rötlicher Schieferboden und eine Mulde im Berg bringen eine ganz besondere Aromatik hervor.',
      wines: ['1904']
    },
    {
      id: 'mehringer',
      name: 'Mehringer Zellerberg',
      description: 'Unser Mehringer Zellerberg wurde 2011 von uns neu gepflanzt mit besonders sorgfältig ausgesuchten, speziell gezüchteten Reben. Der Weinberg ist von der Mosel nur durch die Straße getrennt und zeigt direkt nach Süden. Verwitterter Devonschiefer mit einem höheren Humusanteil prägt hier den Boden. Die Siedlung Mehring ist römischen Ursprungs, eine Nachbildung einer römischen Villa ist hier noch heute zu bewundern. Schon die Römer nutzten das spezielle Klima dieser Moselschleife um hier Wein anzubauen.',
      wines: ['For Friends']
    },
    {
      id: 'poelicher',
      name: 'Pölicher Held',
      description: 'Der Pölicher Held liegt auf der anderen Moselseite, ist durch die starken Kurven der Mosel aber ebenfalls nach Südwest ausgerichtet. »Held« kommt von »Halde«, in diesem Berg ist früher Schiefer abgebaut worden. Entsprechend steinig und rutschig ist hier der Boden – in den außerordentlich steilen Weinbergen des Pölicher Helds findet man sehr große Schiefersteine, die als lose Schicht zwischen den Reben liegen – das Bewirtschaften unserer Weinberge ist hier sehr anspruchsvoll.',
      wines: ['Pölicher Held', 'Heldensekt']
    },
    {
      id: 'klusserather',
      name: 'Klüsserather Bruderschaft',
      description: 'Die Klüsserather Bruderschaft ist unsere Heimat – in diesem großen Bogen, den die Mosel formt, liegen die Parzellen nach Süden ausgerichtet, grauer Devonschiefer prägt das Bild der Böden. Aus den Trauben, die in den verschiedenen Parzellen wachsen, entstehen sehr mineralische Weine. Einzelne Parzellen bringen große Weine wie unser »Herzstück«, unsere »Alten Reben« (von 1921 gepflanzten Reben) oder unseren trockenen »Pur« hervor. Im Nebenkegel der Bruderschaft liegt der Königsberg, auf dem unser »Wolkentanz«, unser »Vierpass« und unser Weißburgunder wächst.',
      wines: ['Herzstück', 'Alte Reben', 'Pur', 'Wolkentanz', 'Weißburgunder']
    },
    {
      id: 'koewericher',
      name: 'Köwericher Laurentiuslay',
      description: 'Die Köwericher Laurentiuslay knüpft direkt an die Bruderschaft an, wendet aber nach Westen. Das Mikroklima hier ist völlig anders: im Spätsommer haben wir morgens lange Schatten, abends lange Sonne – und im Gegensatz zur Bruderschaft grenzt die Laurentiuslay direkt an die Mosel, nur von der Straße unterbrochen. 80% Hangneigung, öliger Devonschiefer, der locker auf dem Felsen liegt, mit besonderer Flora, bringt unsere Laurentiuslay einen sehr würzigen, leichteren und etwas verspielteren Riesling als die Bruderschaft.',
      wines: ['Laurentiuslay']
    },
    {
      id: 'trittenheimer',
      name: 'Trittenheimer Apotheke',
      description: 'Die Trittenheimer Apotheke gehört zu den großen Lagen der Mosel. Wir freuen uns, dass wir diesen Weinberg, der mit über 100 Jahre alten Reben bestückt ist, seit 2018 bewirtschaften dürfen. Die Apotheke wendet nach Westen und bringt Weine mit unglaublicher Spannung hervor – hier wird relativ spät gelesen, die Trauben haben Zeit, zu reifen, das Säure-Süsse-Spiel ist eindrucksvoll. Sehr steil geht\'s hier zu: die kleinen Terrassen bieten dem flachgründigen Schieferboden Halt und bringen charaktervolle Rieslinge hervor – selbst der Reblaus war es zu anstrengend, die Stufen zu erklimmen. Da der Weinberg keine Zuwegung von oben hat, muss jede Terrasse in diesem Weinberg von unten einzeln erklommen werden.',
      wines: ['Trittenheimer Apotheke']
    },
    {
      id: 'piesporter',
      name: 'Piesporter Goldtröpfchen',
      description: 'Im berühmten Piesporter Goldtröpfchen haben wir eine wunderschöne, mit Riesling bestockte Parzelle erworben, die in einem modernen Drahtrahmen steckt. »Die sehr steile Lage fordert uns bei der Bewirtschaftung sehr«, sagt Bernhard Kirsten. Durch die Möglichkeit seiner großen Wasserspeicherkraft übersteht der Ausnahme-Weinberg trockene und heiße Sommer wunderbar. Die große, nach Südosten ausgerichtete Weinlage erstreckt sich links der Mosel beginnend bis zur Moselloreley und bildet die Form eines Amphitheaters.',
      wines: ['Piesporter Goldtröpfchen']
    },
    {
      id: 'winninger-hamm',
      name: 'Winninger Hamm',
      description: 'Die Mosel-Lage Winninger Hamm ist insgesamt etwa 13 Hektar groß und grenzt direkt an den Uhlen. Auf fast 20 Kleinstterrassen, auf denen zum Teil nur 5–10 Stöcke Platz haben, zieht sich unser Weinberg von unten bis hoch über die Mosel hinauf – mit zahllosen Stufen, die in den Fels gehauen sind. Die Ausrichtung des Weinberges ist gen Süd, Südwest und die Rieslingstöcke wachsen auf tonhaltigem Blauschiefer. Diese einzigartige Bodenformation liegt sehr fein und sehr gesplittert, so dass der Untergrund im Winninger Hamm besonders locker ist. Dort können die Reben tief wurzeln und die kleinen Beeren erhalten dadurch ihre intensive Aromatik. Die perfekte Grundlage für elegante und mineralische Weine.',
      wines: ['Winninger Hamm']
    },
    {
      id: 'winninger-domgarten',
      name: 'Winninger Domgarten',
      description: 'Der Name Domgarten geht auf eine kleine Gewannbezeichnung zurück, einen ehemaligen Besitz des Kölner Domstifts. Die Lage umrahmt heute den Ort Winningen auf beiden Seiten und bezieht das steile Eingangsseitental mit ein. Oberhalb von Winningen stößt der Domgarten an den Hamm, unterhalb an das Brückstück. Wir finden hier eine gewisse fruchtige Saftigkeit, weniger Mineralität als im Brückstück oder im Hamm. Der Domgarten ist eine Querterrasse und zeigt Löß- und Bimseinflüsse. Je nach Lage sind aber die sandig-siltigen Schiefer und Quarzite dominant. Wir freuen uns auf die Winniger Rieslinge, die wir seit 2019 hier ernten dürfen.',
      wines: ['Domgarten']
    },
    {
      id: 'winninger-brueckstueck',
      name: 'Winninger Brückstück',
      description: 'Der Boden des Winninger Brückstücks ist skelettreich und wird durch die Gesteine Tonschiefer, Sandstein und Bims geprägt. Die für den Bau der Koblenzer Balduinbrücke im 14ten Jahrhundert benötigten Steine wurden hier gebrochen. Ein Umstand, der namensgebend für die flächenmäßig kleinste Lage Winningens wurde. Unsere Reben wachsen hier mit süd-/südöstlicher Ausrichtung in einer richtigen Mulde, wie eigens für unsere Stöcke entworfen.',
      wines: ['Brückstück']
    },
    {
      id: 'winninger-roettgen',
      name: 'Winninger Röttgen',
      description: 'Der Name Röttgen bezieht sich auf »roden«. Der Aufwand, diese Anlagen zu erstellen, war vermutlich immens. Wir finden hier Löß, der für einen sich hervorragend erwärmenden Boden mit hohem Skelett-Anteil sorgt, dennoch aber genug Zugkraft und Substanz bietet. Der hohe Eisen- und Mineralgehalt der Felsen ist erkennbar an den rostbraunen und rostgelben Farben in den Felsen. In kleinen Terrassen zieht sich unser Weinberg hier nach oben, unterbrochen durch schiere Felswände, die sich auftürmen. Wir hoffen, dass unser Röttchen feine und filigrane Weine hervorbringt, 2020 wird unsere erste Ernte hier sein.',
      wines: ['Röttgen']
    }
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Team Photo Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-white">
        <Image
          src="/Über uns - About Us/Hero Team Bild/16_9.jpg"
          alt="Kirsten-Liebieg Team"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Philosophie Section */}
      <section className="py-16 px-4" style={{ backgroundColor: 'rgba(139, 115, 85, 0.1)' }}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
              Wo Steillage auf Leidenschaft trifft.
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Kirsten-Liebieg – Weinbau am Limit: 27 Hektar Steil- und Steilstlagen, 100 % Handlese und Weine, die Geschichten erzählen.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-[rgba(139,115,85,0.05)]">
              <Image
                src="/Über uns - About Us/Unsere Wurzeln liegen in der Steillage/4_5 Steillage_Favorit.jpg"
                alt="Steillage - Weinberg an der Mosel"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black">
                Unsere Wurzeln liegen in der Steillage.
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Entlang der Mosel – von Longuich bis Winningen – bewirtschaften wir 27 Hektar Steil- und Steilstlagen. Zwischen 1000 und 1200 Arbeitsstunden pro Hektar fließen hier jedes Jahr in Handarbeit, Präzision und Leidenschaft. Kirsten-Liebieg steht für kompromissloses Handwerk, nachhaltige Bewirtschaftung und Weine, die das erzählen, was die Mosel ausmacht: Charakter, Tiefe und Herkunft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Die Lagen Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
              Unsere Lagen – jede mit eigener Handschrift.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Unsere Reben wachsen auf den großen Schieferlagen der Mosel:
            </p>
          </div>
        </div>

        {/* Map Section - Full Width */}
        <div className="w-full mb-12 bg-white">
          <Image
            src="/images/moselschleife.png"
            alt="Kirsten-Liebieg Weinlagen Karte - Mosel Vineyards Map"
            width={1920}
            height={1080}
            className="w-full h-auto"
          />
        </div>

        {/* Accordion Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-0 border-t border-gray-200">
              {vineyards.map((vineyard) => (
                <div key={vineyard.id} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === vineyard.id ? null : vineyard.id)}
                    className="w-full py-6 px-4 flex items-center justify-between transition-colors text-left hover:bg-[rgba(139,115,85,0.05)]"
                  >
                    <h3 className="text-xl md:text-2xl font-normal text-gray-700">
                      {vineyard.name}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openAccordion === vineyard.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openAccordion === vineyard.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-6 space-y-4">
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {vineyard.description}
                      </p>
                      {vineyard.wines.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Weine</p>
                          <p className="text-sm text-gray-500">{vineyard.wines.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Nachhaltigkeit Section */}
      <section className="py-16 px-4" style={{ backgroundColor: 'rgba(139, 115, 85, 0.1)' }}>
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
              Bewusst bewirtschaften. Für heute und morgen.
            </h2>
          </div>

          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>
              Bei Kirsten-Liebieg bedeutet Nachhaltigkeit mehr als Öko-Siegel. Wir arbeiten im Einklang mit der Natur, schützen die Böden, fördern Biodiversität und denken in Generationen.
            </p>
            <p>
              Als Mitglied bei Fair&apos;n Green und Game Conservancy Deutschland leben wir Verantwortung, Ökologisch, sozial und wirtschaftlich.
            </p>
            <p>
              Von CO<sub>2</sub>-reduzierten Transporten über den Einsatz ressourcenschonender Materialien bis zur Erhaltung alter Rebanlagen – wir glauben, dass echter Genuss nur funktioniert, wenn man die Natur respektiert, die ihn möglich macht.
            </p>
          </div>
        </div>
      </section>

      {/* Die Menschen Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Menschen, die Wein leben.
            </h2>
          </div>

          {/* Team Grid */}
          <div className="space-y-8">
            {/* Row 1: Inge & Bernhard - Image left, content right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:items-stretch">
              {/* Left: Image */}
              <div className="relative h-96 lg:h-auto lg:min-h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="/Über uns - About Us/Inge und Bernhard/Inge_Bernhard_4_5.jpg"
                  alt="Inge von Geldern und Bernhard Kirsten"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right: Bernhard & Inge content stacked */}
              <div className="space-y-8 flex flex-col justify-center">
                {/* Bernhard content */}
                <div className="bg-white">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    Bernhard Kirsten – Winzer, Visionär, Präzision seit 1987
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Als Bernhard Kirsten 1987 die Leitung des Weinguts übernahm, hatte er eine klare Vision: Die Mosel neu zu denken. Sein Ziel war es, Weine zu schaffen, die nicht nur schmecken, sondern sprechen: Über ihre Herkunft, ihre Lagen, ihre Entstehung. Mit einer Leidenschaft für Spontangärung, traditionelles Handwerk und präzise Kellerarbeit hat Bernhard Kirsten den Stil von Kirsten-Liebieg entscheidend geprägt. Er ist Winzer aus Überzeugung, Techniker mit Gefühl und Pragmatiker mit Herz. Für ihn ist jeder Jahrgang eine neue Chance, die Balance zwischen Natur, Handwerk und Charakter zu finden.
                  </p>
                </div>

                {/* Inge content */}
                <div className="bg-white">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    Inge von Geldern – das Herz des Weinguts
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Inge ist das Herz von Kirsten-Liebieg – warmherzig, klar und immer mitten im Geschehen. Sie hält die Fäden in der Hand, koordiniert, organisiert und empfängt Gäste mit einem Lächeln, das man nicht vergisst. Als Gastgeberin, Zuhörerin und kreative Seele ist sie die Verbindung zwischen Weinberg, Keller und Kunde. Ihre Energie prägt das Miteinander im Team genauso wie die Atmosphäre im Weingut. Wer einmal mit ihr über Wein gesprochen hat, versteht, warum hier mehr entsteht als ein Produkt: Hier entsteht Persönlichkeit im Glas.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Andreas - Content left, image right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:items-stretch">
              {/* Left: Andreas content */}
              <div className="bg-white order-2 lg:order-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4 text-black">
                  Andreas Winkelmann
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Wenn jemand die Sprache des Weins spricht, dann Andreas Winkelmann. Als erfahrener Sommelier und Markenbotschafter bringt er die Weine von Kirsten-Liebieg dorthin, wo sie hingehören: zu Menschen, die Qualität zu schätzen wissen. Er übersetzt Handwerk in Genuss, Technik in Emotion und steht für den Brückenschlag zwischen Tradition und Moderne. Mit seinem Gespür für Wein, Foodpairing und Präsentation ist Andreas das Bindeglied zwischen Keller, Glas und Community.
                </p>
              </div>

              {/* Right: Andreas image */}
              <div className="relative h-96 lg:h-auto lg:min-h-[600px] rounded-lg overflow-hidden order-1 lg:order-2">
                <Image
                  src="/Über uns - About Us/Andreas/Andreas_4_5.jpg"
                  alt="Andreas Winkelmann - Sommelier"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Row 3: Team image - Full width */}
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/Cover.jpg"
                alt="Kirsten-Liebieg Team"
                fill
                className="object-cover"
              />
            </div>

            {/* Row 4: Team content - Full width */}
            <div className="bg-white">
              <h3 className="text-xl font-bold mb-4 text-black">
                Unser gesamtes Team
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Rund 27 Hektar Steillagen bedeuten mehr als Weinbau, sie bedeuten Gemeinschaft. Hinter Inge, Bernhard und Andreas steht ein Team, das Tag für Tag Außergewöhnliches leistet. Vom Schieferhang bis in den Versand: jede Flasche Kirsten-Liebieg ist das Ergebnis von rund 1000 bis 1200 Arbeitsstunden pro Hektar, reiner Handarbeit und ehrlichem Engagement. Denn Weinmachen ist Teamarbeit und ohne die vielen Menschen, die täglich anpacken, pflücken, keltern, etikettieren, ausliefern und beraten, wäre Kirsten-Liebieg nicht das, was es ist: ein lebendiger Ort voller Leidenschaft, Erfahrung und Zusammenhalt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
