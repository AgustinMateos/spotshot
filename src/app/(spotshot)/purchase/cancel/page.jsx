import React from 'react'
import OrderErrorContent from '@/components/OrderErrorConntent'
import { Suspense } from 'react';


const page = () => {
  return (
     <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center text-xl">Cargando tu orden...</div>}>
      <OrderErrorContent/>
    </Suspense>
  )
}

export default page