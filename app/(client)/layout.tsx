import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { currentUser } from '@clerk/nextjs/server';

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
  title: "Leibig Wineshop",
  description: "Buy the best wines online from our curated selection of fine wines. Fast shipping and excellent customer service.",
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
    <ClerkProvider>
    <html lang="en">
     <body className={`${avenirLTPro.variable} font-avenir`}>
        {/* Get the user from Clerk and pass it to Header */}
        <Header user={serializedUser} />
        {children}
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