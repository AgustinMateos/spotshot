
import "./globals.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';   // ← Nuevo
import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";
import { Oxygen, Manrope, Inter, Open_Sans, Roboto } from 'next/font/google';

// Configura las fuentes
const oxygen = Oxygen({
  subsets: ['latin'],
  weight: ['300','400',  '700'], // elige los pesos que necesites
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
export const metadata = {
  title: "SpotShot",
  description: "Convierte tus fotos de surf en ingresos reales",
  icons: {
    icon: "/favicon.ico",
  },
  
  other: {
    'google-site-verification': 'U6OKkr4jUPHk7IGUVdtUiAl3JL3GfRVmkTaaiWM4Lec',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${oxygen.variable} ${manrope.variable} ${inter.variable} ${openSans.variable} ${roboto.variable} antialiased`} >
     
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <CartProvider> 
            <NavbarComponent/>                   
            <main className="flex-1">
              {children}
            </main>
            
           <Footer/>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}