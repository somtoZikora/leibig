import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Über uns - Unser Team & Tradition",
  description: "Lernen Sie das Team von Kirsten-Liebieg kennen. Seit 1987 verbinden wir Mosel-Tradition mit moderner Winzerkunst. Unsere Steillage-Weinberge, nachhaltige Philosophie und Leidenschaft für exzellenten Riesling.",
  keywords: [
    "Kirsten-Liebieg Team",
    "Weingut Mosel",
    "Bernhard Kirsten",
    "Steillage Mosel",
    "Nachhaltiger Weinbau",
    "Fair'n Green",
    "Mosel Winzer",
    "Weinlagen Mosel",
    "Longuicher Maximiner Herrenberg",
    "Tradition Weinbau"
  ],
  openGraph: {
    title: "Über uns - Unser Team & Tradition | Kirsten-Liebieg",
    description: "Lernen Sie das Team von Kirsten-Liebieg kennen. Seit 1987 verbinden wir Mosel-Tradition mit moderner Winzerkunst.",
    type: "website",
    url: "https://www.kirsten-liebieg.de/ueber-uns",
    images: [
      {
        url: "/Über uns - About Us/Hero Team Bild/16_9.jpg",
        width: 1600,
        height: 900,
        alt: "Kirsten-Liebieg Weingut Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns - Unser Team & Tradition | Kirsten-Liebieg",
    description: "Lernen Sie das Team von Kirsten-Liebieg kennen. Seit 1987 verbinden wir Mosel-Tradition mit moderner Winzerkunst.",
    images: ["/Über uns - About Us/Hero Team Bild/16_9.jpg"],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
