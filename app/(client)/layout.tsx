import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { currentUser } from '@clerk/nextjs/server';
import AnimatedLayout from "@/components/AnimatedLayout";

const avenirLTPro = localFont({
  src: [
    {
      path: '../fonts/AvenirLTPro-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-LightOblique.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/AvenirLTPro-Roman.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-Oblique.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/AvenirLTPro-Book.ttf',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-BookOblique.ttf',
      weight: '450',
      style: 'italic',
    },
    {
      path: '../fonts/AvenirLTPro-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-MediumOblique.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../fonts/AvenirLTPro-Heavy.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-HeavyOblique.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/AvenirLTPro-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/AvenirLTPro-BlackOblique.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-avenir',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Kirsten-Liebieg Weingut | Moselweine direkt vom Winzer",
    template: "%s | Kirsten-Liebieg"
  },
  description: "Entdecken Sie exzellente Moselweine von Kirsten-Liebieg. Riesling, Spätburgunder und mehr direkt vom Weingut. Nachhaltig, authentisch und voller Tradition seit 1987.",
  keywords: ["Moselwein", "Weingut", "Riesling", "Kirsten-Liebieg", "Wein online kaufen", "Deutscher Wein", "Mosel", "Winzer", "Weinversand", "Spätburgunder"],
  authors: [{ name: "Kirsten-Liebieg Weingut" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.kirsten-liebieg.de",
    siteName: "Kirsten-Liebieg Weingut",
    title: "Kirsten-Liebieg Weingut | Moselweine direkt vom Winzer",
    description: "Entdecken Sie exzellente Moselweine von Kirsten-Liebieg. Riesling, Spätburgunder und mehr direkt vom Weingut.",
    images: [
      {
        url: "/images/Kirsten-Liebieg_Logo.png",
        width: 1407,
        height: 311,
        alt: "Kirsten-Liebieg Weingut Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirsten-Liebieg Weingut | Moselweine direkt vom Winzer",
    description: "Entdecken Sie exzellente Moselweine von Kirsten-Liebieg. Riesling, Spätburgunder und mehr direkt vom Weingut.",
    images: ["/images/Kirsten-Liebieg_Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const serializedUser = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress || null,
    imageUrl: user.imageUrl,
    isSignedIn: true
  } : null;
  
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <html lang="en">
     <body className={`${avenirLTPro.variable} font-avenir`}>
        {/* Get the user from Clerk and pass it to Header */}
        <Header />
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
        <Footer/>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
          }}
        />
      </body>
    </html>
    </ClerkProvider>
  );
}