'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Search, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Layers,
  Lock,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoleBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Forms';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { MOCK_USERS } from '@/lib/mock-data';
import { User, UserRole } from '@/types/database';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('PdmJogja2026!');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);

  // Modal Tambah User & Multi-Group
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STAFF_UNIT');
  const [groupPrimary, setGroupPrimary] = useState('Bendahara Masjid Gedhe Kauman');
  const [groupSecondary, setGroupSecondary] = useState('Admin KL Lazismu Ngampilan');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  // Handler Reset Password oleh Admin
  const handleAdminResetPassword = async () => {
    if (!selectedUser) return;

    if (sendEmailNotification) {
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toEmail: selectedUser.email,
            toName: selectedUser.full_name,
            subject: '[LPPK PDM] Pemberitahuan Reset Kata Sandi Akun oleh Administrator',
            notificationType: 'PERMINTAAN_REVISI',
            unitName: 'PDM Kota Yogyakarta',
            title: 'Kata Sandi Baru Telah Ditetapkan',
            periodeAudit: '2026',
            notes: `Kata sandi akun Anda telah direset oleh Administrator menjadi: "${newAdminPassword}". Harap segera ganti sandi ini setelah login.`,
          })
        });
      } catch {
        // ignore
      }
    }

    toast.success(`Kata sandi untuk ${selectedUser.full_name} berhasil direset!`, { icon: '🔑' });
    setResetModalOpen(false);
  };

  // Handler Tambah User Baru dengan Dukungan Multi-Group
  const handleCreateUser = () => {
    if (!newFullName || !newEmail) {
      toast.error('Nama lengkap dan email wajib diisi!');
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      organization_id: '11111111-1111-1111-1111-111111111111',
      email: newEmail,
      full_name: newFullName,
      role: newRole,
      is_active: true,
      created_at: new Date().toISOString(),
      groups: [
        { groupId: `grp-1-${Date.now()}`, groupName: groupPrimary, role: newRole, isDefault: true },
        ...(groupSecondary ? [{ groupId: `grp-2-${Date.now()}`, groupName: groupSecondary, role: 'STAFF_UNIT' as UserRole }] : [])
      ]
    };

    setUsers([newUser, ...users]);
    setAddUserModalOpen(false);
    setNewFullName('');
    setNewEmail('');
    toast.success('Pengguna baru dengan multi-group berhasil ditambahkan!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <Users className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen User, Role & Multi-Grup</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengaturan hak akses berjenjang (RBAC), penugasan lebih dari 1 grup/peran per pengguna, dan reset kata sandi oleh Admin.
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setAddUserModalOpen(true)}
        >
          Tambah User & Multi-Grup
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama atau email user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#055838]"
          >
            <option value="ALL">Semua Peran (Roles)</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="AUDITOR_INTERNAL">Auditor Internal</option>
            <option value="BENDAHARA">Bendahara</option>
            <option value="APPROVER_SPJ">Approver SPJ</option>
            <option value="STAFF_UNIT">Staff Unit</option>
            <option value="VIEWER_ONLY">Viewer Only</option>
          </select>
        </div>
      </div>

      {/* Tabel Pengguna */}
      <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pengguna & Email</TableHead>
                <TableHead>Peran Utama</TableHead>
                <TableHead>Penugasan Multi-Grup / Jabatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Manajemen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#055838] font-bold text-xs flex items-center justify-center">
                        {u.full_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{u.full_name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {u.groups && u.groups.length > 0 ? (
                        u.groups.map((grp, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            <Layers className="w-3 h-3 text-amber-600" />
                            {grp.groupName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">1 Grup Default</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Aktif
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Tombol Reset Password oleh Admin */}
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<KeyRound className="w-3.5 h-3.5 text-amber-600" />}
                        onClick={() => {
                          setSelectedUser(u);
                          setResetModalOpen(true);
                        }}
                      >
                        Reset Sandi
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL RESET PASSWORD OLEH ADMIN */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        size="md"
        title="Reset Kata Sandi oleh Administrator"
        description="Tetapkan kata sandi baru untuk akun pengguna ini."
        footer={
          <>
            <Button variant="outline" onClick={() => setResetModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleAdminResetPassword}>
              Simpan & Kirim ke Email User
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border">
            <p className="font-bold text-slate-800">{selectedUser?.full_name}</p>
            <p className="text-[11px] text-slate-400">{selectedUser?.email}</p>
          </div>

          <Input
            label="Kata Sandi Baru untuk User"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            helperText="Pengguna dapat mengganti sandi ini kembali secara mandiri di menu profil."
          />

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <input
              id="sendMail"
              type="checkbox"
              checked={sendEmailNotification}
              onChange={(e) => setSendEmailNotification(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#055838] focus:ring-[#055838]"
            />
            <label htmlFor="sendMail" className="text-xs text-emerald-900 cursor-pointer">
              <strong>Kirimkan pemberitahuan kata sandi baru ke email pengguna</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Mengirimkan detail sandi ke email {selectedUser?.email} via server SMTP LPPK PDM.
              </p>
            </label>
          </div>
        </div>
      </Modal>

      {/* MODAL TAMBAH USER & MULTI-GROUP */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        size="md"
        title="Tambah Pengguna Baru & Penugasan Multi-Grup"
        description="Fasilitasi satu akun untuk memegang lebih dari satu grup/peran sekaligus."
        footer={
          <>
            <Button variant="outline" onClick={() => setAddUserModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Simpan Pengguna
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Nama Lengkap Pengurus / Auditor"
            placeholder="Contoh: Muhammad Ihsan, S.E."
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />

          <Input
            label="Alamat Email"
            type="email"
            placeholder="ihsan@pdmjogja.org"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <Select
            label="Peran Akses Utama (RBAC)"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as UserRole)}
            options={[
              { value: 'SUPER_ADMIN', label: 'Super Admin PDM' },
              { value: 'AUDITOR_INTERNAL', label: 'Auditor Internal LPPK' },
              { value: 'BENDAHARA', label: 'Bendahara' },
              { value: 'APPROVER_SPJ', label: 'Approver SPJ' },
              { value: 'STAFF_UNIT', label: 'Staff / Pengurus Unit' },
              { value: 'VIEWER_ONLY', label: 'Viewer Only' }
            ]}
          />

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              Penugasan Grup Ganda (Multi-Group Assignment):
            </p>
            <Input
              label="Grup / Entitas Utama (Default)"
              value={groupPrimary}
              onChange={(e) => setGroupPrimary(e.target.value)}
            />
            <Input
              label="Grup / Entitas Kedua (Sekunder)"
              value={groupSecondary}
              onChange={(e) => setGroupSecondary(e.target.value)}
              helperText="Pengguna dapat beralih peran antar-grup secara langsung dari dashboard tanpa logout."
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
