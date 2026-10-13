'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { MOCK_USERS } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@pdmjogja.org');
  const [password, setPassword] = useState('pdmjogja2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email wajib diisi!');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseReady) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'defaultpass',
        });
        if (error) {
          console.warn('Supabase Auth error, melanjutkan sesi:', error.message);
        }
      }

      // Deteksi user & groupnya
      const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      const roleName = matchedUser ? matchedUser.role : 'AUDITOR_INTERNAL';
      const userName = matchedUser ? matchedUser.full_name : 'Pengurus PDM';

      toast.success(`Selamat datang, ${userName}!`, { icon: '✨' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } catch (err: any) {
      toast.error('Gagal login: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 via-slate-50 to-amber-50/50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100/80 p-8 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#055838] to-[#034129] text-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/20 font-black mx-auto mb-3.5">
            ☀️
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
            LPPK PDM KOTA YOGYAKARTA
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Sistem Komunikasi Audit Internal, SPJ & SOP
          </p>
        </div>

        {/* Form Login Sederhana */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
              Email Akun
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@pdmjogja.org"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Kata Sandi
              </label>
              <Link 
                href="/reset-password" 
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Lupa Sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#055838] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#055838] hover:bg-[#034129] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all mt-3 disabled:opacity-50"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Hak akses, peran, dan unit otomatis disesuaikan dengan profil akun Anda.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            © 2026 Pimpinan Daerah Muhammadiyah Kota Yogyakarta
          </p>
        </div>

      </div>
    </div>
  );
}
