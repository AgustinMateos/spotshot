import NavbarFotografo from '@/components/NavbarFotografo';
import Footer from '@/components/Footer';

export default function ShotLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Navbar específico del fotógrafo */}
      <NavbarFotografo />

      {/* Contenido principal (aquí va page.jsx y todas las subpáginas) */}
      <main className="flex-1">
        {children}
      </main>

      <Footer isShotSection={true} />
    </div>
  );
}