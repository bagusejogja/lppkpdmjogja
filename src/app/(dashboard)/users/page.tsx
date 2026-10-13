'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  KeyRound, 
  Search, 
  UserCheck, 
  Mail, 
  Phone, 
  Lock, 
  Layers, 
  Plus, 
  Check, 
  AlertCircle,
  Building2,
  Trash2,
  Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RoleBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MOCK_USERS } from '@/lib/mock-data';
import { ALL_UNITS } from '@/lib/units-data';
import { User, UserRole, UserGroupMembership } from '@/types/database';

interface AssignedGroupForm {
  id: string;
  unitId: number;
  unitName: string;
  role: UserRole;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Modal Reset Password oleh Admin
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('PdmJogja2026!');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);

  // Modal Tambah User & Multi-Group Dinamis
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Multi-Group Assignment Dinamis (>2 unit bisa ditambahkan)
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroupForm[]>([
    {
      id: 'grp-init-1',
      unitId: 5, // Misal SD Muhammadiyah Karangkajang
      unitName: 'SD Muhammadiyah Karangkajang',
      role: 'STAFF_UNIT'
    },
    {
      id: 'grp-init-2',
      unitId: 14, // KL Lazismu
      unitName: 'KL Lazismu Ngampilan',
      role: 'BENDAHARA'
    }
  ]);

  // Grup / Entitas Utama (Default) - Disimpan sebagai unitId
  const [defaultGroupId, setDefaultGroupId] = useState<string>("grp-init-1");

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

  // Tambah baris penugasan group unit baru
  const handleAddGroupRow = () => {
    const newRowId = `grp-${Date.now()}`;
    const defaultUnit = ALL_UNITS[0];
    const newRow: AssignedGroupForm = {
      id: newRowId,
      unitId: defaultUnit.id,
      unitName: defaultUnit.nama_unit,
      role: 'STAFF_UNIT'
    };
    setAssignedGroups([...assignedGroups, newRow]);
  };

  // Hapus baris penugasan group
  const handleRemoveGroupRow = (index: number) => {
    if (assignedGroups.length <= 1) {
      toast.error('Minimal pengguna harus ditugaskan pada 1 unit!');
      return;
    }
    const removedRowId = assignedGroups[index].id;
    const next = assignedGroups.filter((_, idx) => idx !== index);
    setAssignedGroups(next);

    if (defaultGroupId === removedRowId && next.length > 0) {
      setDefaultGroupId(next[0].id);
    }
  };

  // Ubah unit pada baris tertentu
  const handleUpdateGroupUnit = (index: number, newUnitId: number) => {
    const selectedUnitObj = ALL_UNITS.find(u => u.id === newUnitId);
    const updated = [...assignedGroups];
    updated[index].unitId = newUnitId;
    updated[index].unitName = selectedUnitObj ? selectedUnitObj.nama_unit : `Unit #${newUnitId}`;
    setAssignedGroups(updated);

    // Jika belum ada default, set ke yang ini
    // tetapkan default row jika perlu
  };

  // Ubah role pada baris tertentu
  const handleUpdateGroupRole = (index: number, role: UserRole) => {
    const updated = [...assignedGroups];
    updated[index].role = role;
    setAssignedGroups(updated);
  };

  // Handler Tambah User Baru
  const handleCreateUser = () => {
    if (!newFullName || !newEmail) {
      toast.error('Nama lengkap dan email wajib diisi!');
      return;
    }

    // Bangun groups list
    const groups: UserGroupMembership[] = assignedGroups.map(ag => ({
      groupId: `grp-${ag.unitId}`,
      groupName: ag.unitName,
      role: ag.role,
      isDefault: ag.id === defaultGroupId
    }));

    // Cari role default
    const defaultGroupObj = assignedGroups.find(ag => ag.id === defaultGroupId) || assignedGroups[0];

    const newUser: User = {
      id: `u-${Date.now()}`,
      organization_id: `org-${defaultGroupObj.unitId}`,
      email: newEmail,
      full_name: newFullName,
      role: defaultGroupObj.role,
      phone: newPhone || '0812-3456-7890',
      is_active: true,
      created_at: new Date().toISOString(),
      groups: groups
    };

    setUsers([newUser, ...users]);
    setAddUserModalOpen(false);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    toast.success('Pengguna baru dengan penugasan multi-group berhasil ditambahkan!');
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
                Pengaturan hak akses berjenjang (RBAC), penugasan multi-grup (bebas &gt;2 unit), dan reset kata sandi oleh Admin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setAddUserModalOpen(true)}
            className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengguna & Multi-Grup
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600">Filter Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#055838]"
            >
              <option value="ALL">Semua Peran</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="AUDITOR_INTERNAL">Auditor LPPK</option>
              <option value="BENDAHARA">Bendahara</option>
              <option value="APPROVER_SPJ">Approver SPJ</option>
              <option value="STAFF_UNIT">Staff Auditee</option>
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama, email pengguna..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna & Penugasan Multi-Grup */}
      <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Nama & Kontak</th>
                  <th className="px-4 py-3.5">Peran Utama</th>
                  <th className="px-4 py-3.5 min-w-[280px]">Penugasan Unit Kerja (Multi-Grup)</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-center">Aksi Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#055838] text-white flex items-center justify-center font-bold text-[10px]">
                          {u.full_name.substring(0, 2).toUpperCase()}
                        </div>
                        {u.full_name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 ml-9 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span>
                        {u.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {u.phone}</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {u.groups && u.groups.length > 0 ? (
                          u.groups.map((grp, idx) => (
                            <span 
                              key={idx}
                              className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                                grp.isDefault
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 font-medium'
                              }`}
                            >
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{grp.groupName}</span>
                              <span className="text-slate-400">({grp.role})</span>
                              {grp.isDefault && <span className="text-amber-500 font-black">★</span>}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Hanya 1 Unit Default</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <UserCheck className="w-3 h-3" />
                        Aktif
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(u);
                          setNewAdminPassword('PdmJogja2026!');
                          setResetModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>Reset Password</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: RESET PASSWORD OLEH ADMIN */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Kata Sandi Pengguna (Otoritas Admin)"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-800">Target Akun:</span>
              <p className="font-bold text-slate-900 text-sm">{selectedUser.full_name}</p>
              <p className="text-slate-500">{selectedUser.email}</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Tetapkan Password Sementara (Temporary):</label>
              <Input
                value={newAdminPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAdminPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
              />
              <span className="text-[11px] text-slate-400">Pengguna disarankan mengganti password ini setelah login.</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={sendEmailNotification}
                onChange={(e) => setSendEmailNotification(e.target.checked)}
                className="rounded border-slate-300 text-[#055838] focus:ring-[#055838]"
              />
              <span className="text-slate-700 font-medium">Kirimkan instruksi & password baru ini ke email pengguna otomatis via SMTP</span>
            </label>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResetModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button onClick={handleAdminResetPassword} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                Terapkan Reset Password
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: TAMBAH USER & MULTI-GROUP DINAMIS (>2 UNIT, DROPDOWN ALL_UNITS, ROLE PER UNIT) */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Tambah Pengguna Baru & Penugasan Multi-Grup Bebas"
      >
        <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
          <p className="text-slate-500">
            Pengguna dapat ditugaskan pada lebih dari satu unit kerja dengan jabatan/peran yang berbeda di masing-masing unit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Lengkap & Gelar *</label>
              <Input
                placeholder="Contoh: Drs. H. Bambang Irawan, M.Ag"
                value={newFullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Akun (Login) *</label>
              <Input
                type="email"
                placeholder="nama@muhammadiyah.or.id"
                value={newEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
            <Input
              placeholder="0812-xxxx-xxxx"
              value={newPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPhone(e.target.value)}
            />
          </div>

          {/* SECTION MULTI-GROUP ASSIGNMENT DINAMIS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#055838]" />
                Daftar Penugasan Unit & Peran ({assignedGroups.length} Unit Ditugaskan)
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddGroupRow}
                className="text-[11px] h-7 bg-white text-[#055838] border-emerald-600 hover:bg-emerald-50 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Tambah Unit Lain
              </Button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tentukan entitas yang dapat diakses pengguna beserta peran/jabatan spesifik untuk memisahkan wewenang di setiap unit.
            </p>

            {/* List Baris Penugasan Group */}
            <div className="space-y-2.5">
              {assignedGroups.map((grp, idx) => (
                <div key={grp.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">
                      Penugasan #{idx + 1} {grp.id === defaultGroupId && <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 ml-1">(Utama / Default)</span>}
                    </span>
                    {assignedGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGroupRow(idx)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="Hapus penugasan unit ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Dropdown Pilihan Unit dari ALL_UNITS 165 */}
                    <div className="sm:col-span-7">
                      <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Pilih Entitas / Unit Kerja</label>
                      <select
                        value={grp.unitId}
                        onChange={(e) => handleUpdateGroupUnit(idx, Number(e.target.value))}
                        className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-[#055838]"
                      >
                        {ALL_UNITS.map(u => (
                          <option key={u.id} value={u.id}>
                            #{u.id} - {u.nama_unit} {u.nama_unit_pendek ? `(${u.nama_unit_pendek})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dropdown Role Khusus Unit Ini */}
                    <div className="sm:col-span-5">
                      <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Jabatan / Role di Unit Ini</label>
                      <select
                        value={grp.role}
                        onChange={(e) => handleUpdateGroupRole(idx, e.target.value as UserRole)}
                        className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-[#055838]"
                      >
                        <option value="STAFF_UNIT">Staff Auditee Unit</option>
                        <option value="BENDAHARA">Bendahara Unit</option>
                        <option value="APPROVER_SPJ">Approver / Pimpinan Unit</option>
                        <option value="AUDITOR_INTERNAL">Auditor LPPK</option>
                        <option value="SUPER_ADMIN">Super Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dropdown Pemilih Unit Utama / Default */}
            <div className="pt-2 border-t border-slate-200">
              <label className="font-bold text-slate-800 block text-xs mb-1">
                Grup / Entitas Utama (Default saat Login Pertama Kali) *
              </label>
              <select
                value={defaultGroupId}
                onChange={(e) => setDefaultGroupId(e.target.value)}
                className="w-full text-xs border border-emerald-500 rounded-lg px-3 py-2 bg-emerald-50/50 text-emerald-900 font-bold focus:ring-2 focus:ring-[#055838]"
              >
                {assignedGroups.map((grp, idx) => (
                  <option key={grp.id} value={grp.id}>
                    #{idx + 1}. {grp.unitName} — Jabatan: {grp.role}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Pilihan otomatis bersumber dari unit-unit yang ditugaskan di atas. Pengguna akan langsung berada di unit ini saat login.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddUserModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button onClick={handleCreateUser} className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Pengguna & Hak Akses
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
