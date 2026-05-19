// app/api/images/[...path]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // Reconstruimos la ruta completa de la imagen
  const imagePath = params.path.join('/');

  const supabaseUrl = `https://wojntwetejfuwhpnclsx.supabase.co/storage/v1/object/public/spotshot-sessions/${imagePath}`;

  try {
    const response = await fetch(supabaseUrl);

    if (!response.ok) {
      return new NextResponse('Imagen no encontrada', { status: 404 });
    }

    const blob = await response.blob();

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(blob, { headers });

  } catch (error) {
    console.error('Error proxy imagen:', error);
    return new NextResponse('Error al cargar la imagen', { status: 500 });
  }
}