import Footer from '@/components/Footer'
import Navbar from '@/components/login/Navbar'
import OrderSuccessContent from '@/components/OrderSuccessContent';
import React from 'react'
import { Suspense } from 'react';


export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Cargando tu orden...</div>}>
      <Navbar/><OrderSuccessContent/><Footer/>
    </Suspense>
  );
}