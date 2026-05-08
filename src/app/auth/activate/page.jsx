'use client';

import { Suspense } from 'react';
import ActivateContent from '@/components/ActivateContent';

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-medium">Activando tu cuenta...</h2>
        </div>
      </div>
    }>
      <ActivateContent />
    </Suspense>
  );
}