import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";
import FooterEscuelas from "@/components/FooterEscuelas";
import { CartProvider } from "@/contexts/CartContext";

export default function MainLayout({ children }) {
  return (
    <CartProvider storageKey="escuela-cantabra-cart">
      <main className="flex-1">{children}</main>
      <FooterEscuelas />
    </CartProvider>
  );
}