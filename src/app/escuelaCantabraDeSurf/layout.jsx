import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";
import FooterEscuelas from "@/components/FooterEscuelas";
import { CartProvider } from "@/contexts/CartContext";

export const viewport = {
  themeColor: '#B4121B',
};

export default function MainLayout({ children }) {
  return (
    <CartProvider storageKey="escuela-cantabra-cart">
      <div className="theme-escuela">
        <main className="flex-1">{children}</main>
        <FooterEscuelas />
      </div>
    </CartProvider>
  );
}