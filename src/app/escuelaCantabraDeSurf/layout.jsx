import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";
import FooterEscuelas from "@/components/FooterEscuelas";

export default function MainLayout({ children }) {
  return (
    <>
     
      <main className="flex-1">{children}</main>
      <FooterEscuelas />
    </>
  );
}