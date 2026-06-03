


export default function ShotLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
    

      {/* Contenido principal (aquí va page.jsx y todas las subpáginas) */}
      <main className="flex-1">
        {children}
      </main>

      
    </div>
  );
}