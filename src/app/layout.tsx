import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'LPPK PDM Kota Yogyakarta - Sistem Komunikasi Audit, SPJ & SOP',
  description: 'Sistem Terpadu Komunikasi Audit Internal, Multi-Level Approval SPJ & Repositori SOP Pimpinan Daerah Muhammadiyah Kota Yogyakarta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
