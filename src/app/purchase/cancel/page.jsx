import React from 'react'
import OrderErrorContent from '@/components/OrderErrorConntent'
import { Suspense } from 'react';
import Footer from '@/components/Footer'
import Navbar from '@/components/login/Navbar'
const page = () => {
  return (
     <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Cargando tu orden...</div>}>
      <Navbar/><OrderErrorContent/><Footer/>
    </Suspense>
  )
}

export default page