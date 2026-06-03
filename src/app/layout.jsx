import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';   // ← Nuevo
import NavbarComponent from "@/components/NavbarPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SpotShot",
  description: "Convierte tus fotos de surf en ingresos reales",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <CartProvider> 
            <NavbarComponent/>                   {/* ← Envolvemos aquí */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Si tenés Footer global, lo podés poner aquí también */}
            {/* <Footer /> */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}