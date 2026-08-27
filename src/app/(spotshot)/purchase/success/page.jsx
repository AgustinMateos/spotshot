

import OrderSuccessContent from '@/components/OrderSuccessContent';
import React from 'react'
import { Suspense } from 'react';


export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Cargando tu orden...</div>}>
    <OrderSuccessContent />
    </Suspense>
  );
}