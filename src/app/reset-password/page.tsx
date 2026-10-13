'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseReady } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email akun wajib diisi!');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseReady) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
          console.warn('Supabase reset notice:', error.message);
        }
      }

      // Kirim notifikasi email via API internal
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: email,
          toName: 'Pengurus / Anggota LPPK',
          subject: '[LPPK PDM Jogja] Permintaan Reset Kata Sandi Akun',
          notificationType: 'PERMINTAAN_REVISI',
          unitName: 'PDM Kota Yogyakarta',
          title: 'Instruksi Pemulihan Kata Sandi',
          periodeAudit: '2026',
          notes: 'Kami menerima permintaan reset kata sandi untuk akun Anda. Silakan ikuti tautan yang dikirimkan ke email untuk membuat sandi baru.',
        }),
      });

      setIsSent(true);
      toast.success('Tautan reset kata sandi telah dikirim ke email Anda!', { icon: '📧' });
    } catch (err: any) {
      toast.error('Gagal mengirim reset sandi: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-amber-50/40 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-8 sm:p-10 transition-all">
        
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Login</span>
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#055838] flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Atur Ulang Sandi</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Masukkan alamat email akun pengurus atau auditor Anda. Kami akan mengirimkan tautan verifikasi ke email Anda.
        </p>

        {isSent ? (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Email Verifikasi Terkirim!</h4>
            <p className="text-xs text-emerald-700">
              Silakan periksa kotak masuk atau spam email <strong>{email}</strong> untuk mengatur ulang kata sandi Anda.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 py-2 px-4 rounded-xl bg-[#055838] text-white text-xs font-bold shadow-sm hover:bg-[#034129]"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
                Email Terdaftar
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: takmir.kauman@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#055838] hover:bg-[#034129] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Mengirim Tautan...' : 'Kirim Tautan Pemulihan'}</span>
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          LPPK PDM Kota Yogyakarta • Bantuan: lppkpdmjogja@gmail.com
        </div>
      </div>
    </div>
  );
}
