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
  Edit2,
  Edit3,
  Save,
  X
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
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal Reset Password oleh Admin
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('PdmJogja2026!');
  const [sendResetEmail, setSendResetEmail] = useState(true);

  // Modal Tambah User & Multi-Group Dinamis
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  // State Dinamis Penugasan Multi-Group (Bebas >2 Unit)
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroupForm[]>([
    { id: 'grp-1', unitId: ALL_UNITS[0]?.id || 1, unitName: ALL_UNITS[0]?.nama_unit || 'Pimpinan Daerah Muhammadiyah', role: 'STAFF_UNIT' }
  ]);
  const [defaultGroupId, setDefaultGroupId] = useState<string>('grp-1');

  // Modal Edit User
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAssignedGroups, setEditAssignedGroups] = useState<AssignedGroupForm[]>([]);
  const [editDefaultGroupId, setEditDefaultGroupId] = useState<string>('');

  // Filter list
  const filteredUsers = users.filter(u => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || 
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Handler Buka Modal Edit User
  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setEditFullName(u.full_name);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');

    // Map user groups into AssignedGroupForm
    const existingGroups: AssignedGroupForm[] = (u.groups && u.groups.length > 0)
      ? u.groups.map((g, idx) => {
          const unitIdNum = parseInt(g.groupId.replace('grp-', '')) || (idx + 1);
          return {
            id: `edit-grp-${idx + 1}`,
            unitId: unitIdNum,
            unitName: g.groupName,
            role: g.role
          };
        })
      : [{
          id: 'edit-grp-1',
          unitId: 1,
          unitName: ALL_UNITS[0]?.nama_unit || 'PDM Kota Yogyakarta',
          role: u.role
        }];

    setEditAssignedGroups(existingGroups);
    setEditDefaultGroupId(existingGroups[0].id);
    setEditUserModalOpen(true);
  };

  // Handler Simpan Perubahan Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editFullName.trim() || !editEmail.trim()) {
      toast.error('Nama lengkap dan email wajib diisi!');
      return;
    }

    const updatedGroups: UserGroupMembership[] = editAssignedGroups.map(ag => ({
      groupId: `grp-${ag.unitId}`,
      groupName: ag.unitName,
      role: ag.role,
      isDefault: ag.id === editDefaultGroupId
    }));

    const defaultGroupObj = editAssignedGroups.find(ag => ag.id === editDefaultGroupId) || editAssignedGroups[0];

    setUsers(users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          full_name: editFullName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          role: defaultGroupObj.role,
          organization_id: `org-${defaultGroupObj.unitId}`,
          groups: updatedGroups
        };
      }
      return u;
    }));

    setEditUserModalOpen(false);
    toast.success(`Profil pengguna "${editFullName}" berhasil diperbarui!`);
  };

  // Handler Reset Password
  const handleAdminResetPassword = async () => {
    if (!selectedUser) return;

    if (sendResetEmail) {
      try {
        await fetch('/api/send-email', {
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

  // Tambah baris penugasan group unit baru pada modal Add
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

  // Hapus baris penugasan group pada modal Add
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

  // Ubah unit pada modal Add
  const handleUpdateGroupUnit = (index: number, newUnitId: number) => {
    const selectedUnitObj = ALL_UNITS.find(u => u.id === newUnitId);
    const updated = [...assignedGroups];
    updated[index].unitId = newUnitId;
    updated[index].unitName = selectedUnitObj ? selectedUnitObj.nama_unit : `Unit #${newUnitId}`;
    setAssignedGroups(updated);
  };

  // Ubah role pada modal Add
  const handleUpdateGroupRole = (index: number, role: UserRole) => {
    const updated = [...assignedGroups];
    updated[index].role = role;
    setAssignedGroups(updated);
  };

  // Multi-group handlers untuk Modal Edit
  const handleAddEditGroupRow = () => {
    const newRowId = `edit-grp-${Date.now()}`;
    const defaultUnit = ALL_UNITS[0];
    const newRow: AssignedGroupForm = {
      id: newRowId,
      unitId: defaultUnit.id,
      unitName: defaultUnit.nama_unit,
      role: 'STAFF_UNIT'
    };
    setEditAssignedGroups([...editAssignedGroups, newRow]);
  };

  const handleRemoveEditGroupRow = (index: number) => {
    if (editAssignedGroups.length <= 1) {
      toast.error('Minimal pengguna harus ditugaskan pada 1 unit!');
      return;
    }
    const removedRowId = editAssignedGroups[index].id;
    const next = editAssignedGroups.filter((_, idx) => idx !== index);
    setEditAssignedGroups(next);

    if (editDefaultGroupId === removedRowId && next.length > 0) {
      setEditDefaultGroupId(next[0].id);
    }
  };

  const handleUpdateEditGroupUnit = (index: number, newUnitId: number) => {
    const selectedUnitObj = ALL_UNITS.find(u => u.id === newUnitId);
    const updated = [...editAssignedGroups];
    updated[index].unitId = newUnitId;
    updated[index].unitName = selectedUnitObj ? selectedUnitObj.nama_unit : `Unit #${newUnitId}`;
    setEditAssignedGroups(updated);
  };

  const handleUpdateEditGroupRole = (index: number, role: UserRole) => {
    const updated = [...editAssignedGroups];
    updated[index].role = role;
    setEditAssignedGroups(updated);
  };

  // Handler Tambah User Baru
  const handleCreateUser = () => {
    if (!newFullName || !newEmail) {
      toast.error('Nama lengkap dan email wajib diisi!');
      return;
    }

    const groups: UserGroupMembership[] = assignedGroups.map(ag => ({
      groupId: `grp-${ag.unitId}`,
      groupName: ag.unitName,
      role: ag.role,
      isDefault: ag.id === defaultGroupId
    }));

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
            + Tambah Pengguna & Multi-Grup
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="ALL">Semua Tingkatan Role</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="AUDITOR_LEAD">AUDITOR_LEAD</option>
              <option value="VERIFIKATOR_KEUANGAN">VERIFIKATOR_KEUANGAN</option>
              <option value="PIMPINAN_PDM">PIMPINAN_PDM</option>
              <option value="STAFF_UNIT">STAFF_UNIT</option>
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama, email, NBM pengguna..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Role Default</th>
                  <th className="py-3 px-4">Penugasan Multi-Grup (Entitas Unit)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{u.full_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{u.email}</span>
                        {u.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{u.phone}</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>

                    <td className="px-4 py-3.5 max-w-md">
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                          title="Edit Profil & Penugasan Unit Pengguna"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewAdminPassword('PdmJogja2026!');
                            setResetModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
                          title="Reset Password Pengguna"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reset Sandi</span>
                        </button>
                      </div>
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
                className="text-xs font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="sendResetEmail"
                checked={sendResetEmail}
                onChange={(e) => setSendResetEmail(e.target.checked)}
                className="rounded text-[#055838] focus:ring-[#055838]"
              />
              <label htmlFor="sendResetEmail" className="text-xs text-slate-700 font-medium">
                Kirim notifikasi email otomatis ke {selectedUser.email}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setResetModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button onClick={handleAdminResetPassword} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                Terapkan Kata Sandi Baru
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: TAMBAH USER & MULTI-GROUP DINAMIS */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Tambah Pengguna Baru & Penugasan Multi-Grup"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
              <Input
                value={newFullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFullName(e.target.value)}
                placeholder="H. Ahmad Dahlan, S.E."
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Resmi *</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)}
                placeholder="nama@muhammadiyah.id"
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nomor Kontak / WhatsApp</label>
            <Input
              value={newPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPhone(e.target.value)}
              placeholder="0812-3456-7890"
              className="text-xs"
            />
          </div>

          {/* Bagian Penugasan Multi-Grup Bebas */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Penugasan Grup Ganda (Multi-Group Assignment)</span>
                <span className="text-[11px] text-slate-500">Bebas tugaskan ke lebih dari 2 unit dengan role berbeda per unit</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddGroupRow}
                className="text-xs bg-white text-[#055838] border-emerald-600 hover:bg-emerald-50 font-bold"
              >
                + Tambah Unit Lain
              </Button>
            </div>

            <div className="space-y-2">
              {assignedGroups.map((grp, idx) => (
                <div key={grp.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col md:flex-row items-center gap-2">
                  <div className="w-full md:w-5/12">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Pilih Unit Kerja:</label>
                    <select
                      value={grp.unitId}
                      onChange={(e) => handleUpdateGroupUnit(idx, parseInt(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium truncate"
                    >
                      {ALL_UNITS.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nama_unit} ({u.tipe})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-4/12">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Role Pada Unit Ini:</label>
                    <select
                      value={grp.role}
                      onChange={(e) => handleUpdateGroupRole(idx, e.target.value as UserRole)}
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium"
                    >
                      <option value="STAFF_UNIT">STAFF_UNIT (Auditee/Pembuat)</option>
                      <option value="VERIFIKATOR_KEUANGAN">VERIFIKATOR_KEUANGAN</option>
                      <option value="AUDITOR_LEAD">AUDITOR_LEAD</option>
                      <option value="PIMPINAN_PDM">PIMPINAN_PDM</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </div>

                  <div className="w-full md:w-2/12 flex items-center justify-center gap-2 pt-3 md:pt-0">
                    <button
                      type="button"
                      onClick={() => setDefaultGroupId(grp.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                        defaultGroupId === grp.id
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {defaultGroupId === grp.id ? '★ Default' : 'Jadikan Default'}
                    </button>

                    {assignedGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGroupRow(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" onClick={() => setAddUserModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button onClick={handleCreateUser} className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Pengguna Baru
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: EDIT PENGGUNA & PENUGASAN MULTI-GRUP */}
      <Modal
        isOpen={editUserModalOpen}
        onClose={() => setEditUserModalOpen(false)}
        title={`Edit Profil & Penugasan: ${editingUser?.full_name}`}
      >
        <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
              <Input
                value={editFullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFullName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Resmi *</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditEmail(e.target.value)}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nomor Kontak / WhatsApp</label>
            <Input
              value={editPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPhone(e.target.value)}
              placeholder="0812-3456-7890"
              className="text-xs"
            />
          </div>

          {/* Penugasan Multi-Grup pada Edit */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Penugasan Grup & Wewenang Unit</span>
                <span className="text-[11px] text-slate-500">Sesuaikan unit penugasan dan peran aktif pengguna</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                type="button"
                onClick={handleAddEditGroupRow}
                className="text-xs bg-white text-[#055838] border-emerald-600 hover:bg-emerald-50 font-bold"
              >
                + Tambah Unit Lain
              </Button>
            </div>

            <div className="space-y-2">
              {editAssignedGroups.map((grp, idx) => (
                <div key={grp.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col md:flex-row items-center gap-2">
                  <div className="w-full md:w-5/12">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Pilih Unit Kerja:</label>
                    <select
                      value={grp.unitId}
                      onChange={(e) => handleUpdateEditGroupUnit(idx, parseInt(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium truncate"
                    >
                      {ALL_UNITS.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nama_unit} ({u.tipe})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-4/12">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Role Pada Unit Ini:</label>
                    <select
                      value={grp.role}
                      onChange={(e) => handleUpdateEditGroupRole(idx, e.target.value as UserRole)}
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium"
                    >
                      <option value="STAFF_UNIT">STAFF_UNIT (Auditee/Pembuat)</option>
                      <option value="VERIFIKATOR_KEUANGAN">VERIFIKATOR_KEUANGAN</option>
                      <option value="AUDITOR_LEAD">AUDITOR_LEAD</option>
                      <option value="PIMPINAN_PDM">PIMPINAN_PDM</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </div>

                  <div className="w-full md:w-2/12 flex items-center justify-center gap-2 pt-3 md:pt-0">
                    <button
                      type="button"
                      onClick={() => setEditDefaultGroupId(grp.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                        editDefaultGroupId === grp.id
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {editDefaultGroupId === grp.id ? '★ Default' : 'Jadikan Default'}
                    </button>

                    {editAssignedGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEditGroupRow(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setEditUserModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan Pengguna
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
