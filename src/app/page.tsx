'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#055838] text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold tracking-wide">LPPK PDM KOTA YOGYAKARTA</h2>
        <p className="text-sm text-emerald-200 mt-1">Memuat Sistem Komunikasi Audit Internal & Approval SPJ...</p>
      </div>
    </div>
  );
}
