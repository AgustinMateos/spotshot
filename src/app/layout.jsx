
import "./globals.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { SITE_URL } from '@/lib/seo';


import { Oxygen, Manrope, Inter, Open_Sans, Roboto } from 'next/font/google';


const oxygen = Oxygen({
  subsets: ['latin'],
  weight: ['300','400',  '700'], 
  variable: '--font-oxygen',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});
const DEFAULT_DESCRIPTION =
  "Encuentra y descarga tus fotos de surf en segundos. Fotógrafos y escuelas suben sus sesiones y tú compras las tuyas.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SpotShot | Encuentra tus fotos de surf en segundos",
    template: "%s | SpotShot",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "SpotShot",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "SpotShot",
    title: "SpotShot | Encuentra tus fotos de surf en segundos",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/inicio/somo1.webp", alt: "Surf en la playa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpotShot | Encuentra tus fotos de surf en segundos",
    description: DEFAULT_DESCRIPTION,
    images: ["/inicio/somo1.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    'google-site-verification': 'U6OKkr4jUPHk7IGUVdtUiAl3JL3GfRVmkTaaiWM4Lec',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#103457',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${oxygen.variable} ${manrope.variable} ${inter.variable} ${openSans.variable} ${roboto.variable} antialiased`} >
     
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}