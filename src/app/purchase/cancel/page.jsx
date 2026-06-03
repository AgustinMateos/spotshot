import React from 'react'
import OrderErrorContent from '@/components/OrderErrorConntent'
import { Suspense } from 'react';
import Footer from '@/components/Footer'

const page = () => {
  return (
     <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Cargando tu orden...</div>}>
      <OrderErrorContent/><Footer/>
    </Suspense>
  )
}

export default page