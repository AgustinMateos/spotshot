import NavbarComponent from "@/components/NavbarPage";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <NavbarComponent />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}