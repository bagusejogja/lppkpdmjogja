export type UserRole = 
  | 'SUPER_ADMIN'
  | 'AUDITOR_INTERNAL'
  | 'BENDAHARA'
  | 'APPROVER_SPJ'
  | 'STAFF_UNIT'
  | 'VIEWER_ONLY';

export type OrgType = 
  | 'PDM'
  | 'PCM'
  | 'PRM'
  | 'MAJELIS'
  | 'LEMBAGA'
  | 'ANAK_USAHA'
  | 'SEKOLAH'
  | 'MASJID'
  | 'UNIT_USAHA';

export type SpjStatus = 
  | 'DRAFT'
  | 'PENDING_LEVEL_1'
  | 'PENDING_LEVEL_2'
  | 'PENDING_LEVEL_3'
  | 'PENDING_LEVEL_4'
  | 'PENDING_LEVEL_5'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION_REQUIRED';

export type RequestStatus = 
  | 'DITERIMA'
  | 'DALAM_PROSES'
  | 'DISUBMIT'
  | 'KOMPLIT'
  | 'REVISI';

export type SopCategory = 
  | 'KEUANGAN'
  | 'SDM'
  | 'ASET'
  | 'ORGANISASI';

export interface UserGroupMembership {
  groupId: string;
  groupName: string;
  role: UserRole;
  isDefault?: boolean;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  groups?: UserGroupMembership[]; // Dukungan Multi-Group
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  level: 1 | 2 | 3;
  type: OrgType;
  parent_id?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  file_key: string;
  file_url: string;
  original_name: string;
  display_name: string;
  file_size: number;
  file_type?: string | null;
  notes?: string | null;
  uploaded_by: string;
  uploaded_by_name?: string; // Siapa yang upload
  uploaded_by_role?: string; // Jabatan pengunggah
  created_at: string;        // Kapan diinput
  updated_at?: string;       // Kapan terakhir diupdate
  version?: string | null;          // Versi revisi file
}

export interface DocumentRequest {
  id: string;
  organization_id: string;
  auditor_id: string;
  periode_audit: string;
  title: string;
  description_html: string;
  category: string;
  is_saved_to_master_template: boolean;
  status: RequestStatus;
  auditee_response_notes?: string | null;
  rejection_notes?: string | null;
  due_date?: string | null;
  submitted_at?: string | null;
  verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  organization?: Organization;
  auditor?: User;
  attachments?: RequestAttachment[];
}

export interface AuditTemplateItem {
  id: string;
  title: string;
  category: string;
  is_mandatory: boolean;
  description?: string;
}

export interface AuditTemplate {
  id: string;
  name: string;
  target_org_type: string;
  description?: string | null;
  default_items: AuditTemplateItem[];
  is_active: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SpjAttachment {
  id: string;
  spj_id: string;
  file_key: string;
  file_url: string;
  original_name: string;
  display_name: string;
  file_size: number;
  file_type?: string | null;
  notes?: string | null;
  uploaded_by: string;
  uploaded_by_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface SpjApprovalHistory {
  id: string;
  spj_id: string;
  level_number: number;
  actor_id: string;
  actor_name?: string;
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REVISION';
  notes?: string | null;
  action_date: string;
}

export interface Spj {
  id: string;
  organization_id: string;
  created_by: string;
  nomor_spj: string;
  judul_pengajuan: string;
  deskripsi?: string | null;
  total_nominal: number;
  periode_audit: string;
  current_level: number;
  max_levels: number;
  status: SpjStatus;
  catatan_revisi?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  created_at?: string;
  updated_at?: string;
  organization?: Organization;
  creator?: User;
  attachments?: SpjAttachment[];
  approvals?: SpjApprovalHistory[];
}

export interface Sop {
  id: string;
  title: string;
  category: SopCategory;
  level_scope: 1 | 2 | 3;
  target_org_type: string;
  file_key?: string | null;
  file_url: string;
  version: string;
  description?: string | null;
  published_date: string;
  created_by?: string | null;
  created_at?: string;
}
