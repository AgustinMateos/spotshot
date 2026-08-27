import { Suspense } from 'react';
import Downloads from '@/components/Downloads';   // Ajusta la ruta si es necesario

export default function DownloadsPage() {
  return (
    <Suspense fallback={<div>Cargando descargas...</div>}>
      <Downloads />
    </Suspense>
  );
}