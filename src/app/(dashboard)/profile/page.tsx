'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  User, 
  KeyRound, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff,
  Save,
  Check,
  ArrowRight,
  BadgeCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { MOCK_USERS } from '@/lib/mock-data';

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'unit';

  const [activeTab, setActiveTab] = useState<'unit' | 'password' | 'bio'>(
    initialTab === 'password' ? 'password' : initialTab === 'bio' ? 'bio' : 'unit'
  );

  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('lppk_active_user_id');
      if (savedUserId) {
        const found = MOCK_USERS.find(u => u.id === savedUserId);
        if (found) {
          setCurrentUser(found);
          setFullName(found.full_name);
        }
      }
      const savedGroupIdx = localStorage.getItem('lppk_active_group_idx');
      if (savedGroupIdx !== null && !isNaN(parseInt(savedGroupIdx))) {
        setSelectedGroupIndex(parseInt(savedGroupIdx));
      }
    }
  }, []);

  // State Unit Aktif Switcher
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [unitSwitchSuccess, setUnitSwitchSuccess] = useState(false);

  // State Form Ganti Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // State Biodata
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '0812-3456-7890');
  const [nbm, setNbm] = useState('1192837');
  const [bioSuccess, setBioSuccess] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'password') setActiveTab('password');
    if (tab === 'unit') setActiveTab('unit');
    if (tab === 'bio') setActiveTab('bio');
  }, [searchParams]);

  const handleSwitchUnit = (idx: number) => {
    setSelectedGroupIndex(idx);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lppk_active_group_idx', idx.toString());
      if (currentUser.groups && currentUser.groups[idx]) {
        localStorage.setItem('lppk_active_role', currentUser.groups[idx].role);
      }
      window.dispatchEvent(new Event('lppk_unit_changed'));
    }
    setUnitSwitchSuccess(true);
    setTimeout(() => setUnitSwitchSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!oldPassword) {
      setPasswordError('Password lama harus diisi');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }

    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBioSuccess(true);
    setTimeout(() => setBioSuccess(false), 3000);
  };

  const currentActiveGroup = currentUser.groups ? currentUser.groups[selectedGroupIndex] : {
    groupId: 'default',
    groupName: 'Unit Default',
    role: currentUser.role
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-[#055838] to-[#04432b] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-2xl text-amber-300 shadow-inner">
              {currentUser.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{currentUser.full_name}</h1>
                <span className="text-[11px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                  NBM: {nbm}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">{email} • {phone}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-700/60">
                <Building2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Unit Aktif Saat Ini: <strong className="text-white font-semibold">{currentActiveGroup.groupName}</strong> ({currentActiveGroup.role})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Terpusat */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-2xs gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('unit')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'unit'
              ? 'border-[#055838] text-[#055838]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Ganti Unit Aktif (Multi-Group)</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
            {currentUser.groups?.length || 1}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'password'
              ? 'border-[#055838] text-[#055838]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="h-4 w-4 text-amber-500" />
          <span>Ganti Password & Keamanan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bio')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'bio'
              ? 'border-[#055838] text-[#055838]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Informasi Profil Akun</span>
        </button>
      </div>

      {/* TAB 1: GANTI UNIT AKTIF (MULTI-GROUP SWITCHER) */}
      {activeTab === 'unit' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#055838]" />
                Penugasan Entitas / Unit Kerja Anda (Multi-Group)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Satu akun ini memiliki wewenang pada beberapa unit persyarikatan. Klik tombol "Pindah ke Unit Ini" untuk mengubah konteks kerja aktif, dokumen audit, dan SPJ yang Anda kelola.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {unitSwitchSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Konteks kerja berhasil dialihkan ke <strong>{currentActiveGroup.groupName}</strong>. Seluruh data transaksi, SPJ, dan permohonan audit disesuaikan otomatis.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentUser.groups?.map((grp, idx) => {
                  const isCurrent = selectedGroupIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                        isCurrent 
                          ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isCurrent 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {isCurrent ? 'SEDANG AKTIF' : 'TERDAFTAR'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {grp.groupId}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{grp.groupName}</h4>
                        <div className="text-xs text-slate-500">
                          Peran: <strong className="text-slate-700">{grp.role}</strong>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {isCurrent ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                            <BadgeCheck className="h-4 w-4" />
                            Konteks Aktif Saat Ini
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => handleSwitchUnit(idx)}
                            className="w-full bg-white hover:bg-emerald-50 text-[#055838] border border-[#055838] text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <span>Pindah ke Unit Ini</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: GANTI PASSWORD & KEAMANAN */}
      {activeTab === 'password' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              Perbarui Kata Sandi Akun
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Gunakan kombinasi minimal 8 karakter dengan huruf besar, angka, dan simbol untuk keamanan maksimal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="p-6 space-y-4 max-w-md">
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Password berhasil diperbarui! Gunakan password baru Anda pada sesi login berikutnya.</span>
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password Lama</label>
                <div className="relative">
                  <Input
                    type={showOldPass ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi lama"
                    value={oldPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password Baru</label>
                <div className="relative">
                  <Input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Ulangi Password Baru</label>
                <Input
                  type="password"
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-end">
              <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-semibold flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan Password Baru
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* TAB 3: INFORMASI PROFIL & BIODATA */}
      {activeTab === 'bio' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-[#055838]" />
              Data Diri & Keanggotaan Persyarikatan
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Perbarui nama lengkap, nomor NBM Muhammadiyah, dan kontak telepon aktif
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleBioSubmit}>
            <CardContent className="p-6 space-y-4 max-w-lg">
              {bioSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Biodata profil berhasil disimpan!</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nama Lengkap & Gelar</label>
                <Input
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nomor Baku Muhammadiyah (NBM)</label>
                  <Input
                    value={nbm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNbm(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp / HP</label>
                  <Input
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Login (Terdaftar di Sistem)</label>
                <Input
                  value={email}
                  disabled
                  className="bg-slate-100 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400">Email hanya dapat diubah melalui Super Admin.</span>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-end">
              <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-semibold flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}


export default function ProfilePage() {
  return (
    <React.Suspense fallback={
      <div className="p-8 text-center text-slate-500 text-sm">
        Memuat profil pengguna...
      </div>
    }>
      <ProfileContent />
    </React.Suspense>
  );
}
