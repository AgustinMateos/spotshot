import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export default function MainLayout({ children }) {
  return (
    <CartProvider storageKey="spotshot-cart">
      <NavbarComponent />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}