'use client';

import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Forms';
import { RoleBadge } from '@/components/ui/Badge';
import { MOCK_USERS } from '@/lib/mock-data';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[3]); // Ahmad Zaki
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Harap lengkapi semua kolom kata sandi!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Kata sandi baru dan konfirmasi tidak cocok!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Kata sandi Anda berhasil diperbarui!', { icon: '🔒' });
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil Pengguna & Keamanan Akun</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola informasi profil, penugasan multi-grup, dan atur ulang kata sandi Anda secara mandiri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Info Profil & Multi-Group (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <Card className="rounded-2xl border-slate-200 text-center p-6">
            <div className="w-20 h-20 rounded-full bg-[#055838] text-amber-300 text-2xl font-black flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20 mb-3">
              {currentUser.full_name.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="text-base font-bold text-slate-900">{currentUser.full_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            <div className="mt-3 flex justify-center">
              <RoleBadge role={currentUser.role} />
            </div>

            {/* Multi-Group List */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-left space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Grup / Jabatan yang Dimiliki:
              </p>
              {currentUser.groups?.map((grp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800">{grp.groupName}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Role: {grp.role}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Form Ganti Password Mandiri (7 cols) */}
        <div className="md:col-span-7">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#055838]" />
                <span>Ganti Kata Sandi Mandiri</span>
              </CardTitle>
              <CardDescription>
                Perbarui kata sandi secara berkala untuk menjaga keamanan akses portal LPPK.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <Input
                  label="Kata Sandi Lama"
                  type="password"
                  required
                  placeholder="Masukkan sandi saat ini"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  required
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  required
                  placeholder="Ketik ulang sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Simpan Kata Sandi Baru
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
