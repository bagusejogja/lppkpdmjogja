import { MOCK_USERS } from './mock-data';
import { User } from '@/types/database';

export interface AuthContextState {
  currentUser: User;
  activeRole: string;
  isLppkLeader: boolean;
  isFieldAuditor: boolean;
}

/**
 * Mendapatkan user dan peran aktif saat ini dari localStorage atau default
 */
export function getActiveAuthState(): AuthContextState {
  if (typeof window === 'undefined') {
    return {
      currentUser: MOCK_USERS[0],
      activeRole: 'SUPER_ADMIN',
      isLppkLeader: true,
      isFieldAuditor: false
    };
  }

  const savedUserId = localStorage.getItem('lppk_active_user_id') || 'u-1';
  const foundUser = MOCK_USERS.find(u => u.id === savedUserId) || MOCK_USERS[0];

  const savedGroupIdx = localStorage.getItem('lppk_active_group_idx');
  const groupIdx = savedGroupIdx ? parseInt(savedGroupIdx, 10) : 0;
  
  const activeGroup = (foundUser.groups && foundUser.groups[groupIdx]) 
    ? foundUser.groups[groupIdx] 
    : (foundUser.groups?.[0] || { role: foundUser.role, groupName: 'Unit PDM' });

  const activeRole = activeGroup.role || foundUser.role;

  // LPPK Leader / Pengarah: Memiliki wewenang supervisi menyeluruh (Read-Only di unit lapangan)
  const isLppkLeader = 
    activeRole === 'SUPER_ADMIN' || 
    foundUser.id === 'u-1' || 
    activeGroup.groupName.includes('Pengarah LPPK') || 
    activeGroup.groupName.includes('Super Admin');

  const isFieldAuditor = activeRole === 'AUDITOR_INTERNAL' && !isLppkLeader;

  return {
    currentUser: foundUser,
    activeRole,
    isLppkLeader,
    isFieldAuditor
  };
}

/**
 * Mengecek apakah auditor ditugaskan pada unit tertentu
 */
export function isUserAssignedToUnit(
  userName: string,
  ketuaAuditor: string,
  anggotaAuditor: string[]
): boolean {
  if (!userName) return false;
  
  const clean = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
  const target = clean(userName);

  if (clean(ketuaAuditor).includes(target) || target.includes(clean(ketuaAuditor))) {
    return true;
  }

  return anggotaAuditor.some(anggota => {
    const cleanAnggota = clean(anggota);
    return cleanAnggota.includes(target) || target.includes(cleanAnggota);
  });
}
