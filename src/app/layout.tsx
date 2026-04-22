import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingCTA from '@/components/FloatingCTA';

export const metadata: Metadata = {
  title: 'DineSync Malay — Authentic Malaysian Cuisine',
  description: 'Experience the rich flavors of Malaysia at DineSync. From Nasi Lemak to Satay, discover our heritage dishes in an elevated dining setting.',
  keywords: ['Malaysian restaurant', 'Nasi Lemak', 'Kuala Lumpur dining', 'Bangsar food', 'DineSync Malay'],
  openGraph: {
    title: 'DineSync Malay — Authentic Malaysian Flavors',
    description: 'Explore our Malaysian menu and book a table at DineSync Malay.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "DineSync Malay",
    "image": "https://images.unsplash.com/photo-1541510952743-002c9dfc230f?w=800",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No. 12, Jalan Telawi 5, Bangsar",
      "addressLocality": "Kuala Lumpur",
      "addressRegion": "Kuala Lumpur",
      "postalCode": "59100",
      "addressCountry": "MY"
    },
    "url": "http://localhost:3000",
    "telephone": "+60322843111",
    "priceRange": "RM RM RM",
    "menu": "http://localhost:3000/menu",
    "servesCuisine": "Malaysian",
    "openingHours": "Mo-Su 10:00-22:00"
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
