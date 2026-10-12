-- ==============================================================================
-- SISTEM KOMUNIKASI AUDIT INTERNAL, APPROVAL SPJ & REPOSITORI SOP
-- LEMBAGA PEMBINAAN & PENGAWASAN KEUANGAN (LPPK) PDM KOTA YOGYAKARTA
-- Database Target: Supabase (PostgreSQL 15+)
-- Project: https://pofruxnxcnzhjdwdlkiu.supabase.co
-- ==============================================================================

-- Aktifkan ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'SUPER_ADMIN',
        'AUDITOR_INTERNAL',
        'BENDAHARA',
        'APPROVER_SPJ',
        'STAFF_UNIT',
        'VIEWER_ONLY'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE org_type AS ENUM (
        'PDM',
        'PCM',
        'PRM',
        'MAJELIS',
        'LEMBAGA',
        'ANAK_USAHA',
        'SEKOLAH',
        'MASJID',
        'UNIT_USAHA'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE spj_status AS ENUM (
        'DRAFT',
        'PENDING_LEVEL_1',
        'PENDING_LEVEL_2',
        'PENDING_LEVEL_3',
        'PENDING_LEVEL_4',
        'PENDING_LEVEL_5',
        'APPROVED',
        'REJECTED',
        'REVISION_REQUIRED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM (
        'DITERIMA',
        'DALAM_PROSES',
        'DISUBMIT',
        'KOMPLIT',
        'REVISI'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE sop_category AS ENUM (
        'KEUANGAN',
        'SDM',
        'ASET',
        'ORGANISASI'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 2. TABEL ORGANISASI (HIERARKI BERJENJANG LEVEL 1, 2, 3)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    level INT NOT NULL CHECK (level BETWEEN 1 AND 3), 
    -- 1: PDM, 2: PCM/Majelis/Anak Usaha, 3: PRM/Masjid/Sekolah/Unit Usaha
    type org_type NOT NULL,
    parent_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing hirarki
CREATE INDEX IF NOT EXISTS idx_org_parent_id ON organizations(parent_id);
CREATE INDEX IF NOT EXISTS idx_org_level ON organizations(level);
CREATE INDEX IF NOT EXISTS idx_org_type ON organizations(type);

-- ------------------------------------------------------------------------------
-- 3. TABEL USERS & RBAC
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STAFF_UNIT',
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ------------------------------------------------------------------------------
-- 4. TABEL KONFIGURASI APPROVAL SPJ DINAMIS (1 s/d 5 LEVEL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS approval_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    total_levels INT NOT NULL CHECK (total_levels BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_org_approval_config UNIQUE (organization_id)
);

CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID NOT NULL REFERENCES approval_configs(id) ON DELETE CASCADE,
    level_number INT NOT NULL CHECK (level_number BETWEEN 1 AND 5),
    level_name VARCHAR(150) NOT NULL, -- Contoh: "Bendahara Unit", "Pimpinan Cabang", "Bendahara PDM"
    required_role user_role NOT NULL DEFAULT 'APPROVER_SPJ',
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- jika spesifik perorangan
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_config_level UNIQUE (config_id, level_number)
);

CREATE INDEX IF NOT EXISTS idx_steps_config ON approval_steps(config_id);

-- ------------------------------------------------------------------------------
-- 5. TABEL SPJ & APPROVAL WORKFLOW
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spjs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    nomor_spj VARCHAR(100) UNIQUE NOT NULL,
    judul_pengajuan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    total_nominal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    periode_audit VARCHAR(50) NOT NULL, -- Contoh: "2026", "2026-Q1"
    current_level INT NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
    max_levels INT NOT NULL DEFAULT 1 CHECK (max_levels BETWEEN 1 AND 5),
    status spj_status NOT NULL DEFAULT 'DRAFT',
    catatan_revisi TEXT,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spjs_org ON spjs(organization_id);
CREATE INDEX IF NOT EXISTS idx_spjs_status ON spjs(status);
CREATE INDEX IF NOT EXISTS idx_spjs_periode ON spjs(periode_audit);

-- Riwayat Tindakan Approval (Audit Trail)
CREATE TABLE IF NOT EXISTS spj_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spj_id UUID NOT NULL REFERENCES spjs(id) ON DELETE CASCADE,
    level_number INT NOT NULL CHECK (level_number BETWEEN 1 AND 5),
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(50) NOT NULL CHECK (action IN ('SUBMIT', 'APPROVE', 'REJECT', 'REVISION')),
    notes TEXT,
    action_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spj_approvals_spj ON spj_approvals(spj_id);

-- Lampiran Berkas SPJ (Tersimpan di Cloudflare R2)
CREATE TABLE IF NOT EXISTS spj_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spj_id UUID NOT NULL REFERENCES spjs(id) ON DELETE CASCADE,
    file_key VARCHAR(500) NOT NULL, -- Path R2: [Unit_ID]/[Periode]/SPJ/[SPJ_ID]/filename
    file_url TEXT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL, -- Fitur Rename Display
    file_size BIGINT NOT NULL DEFAULT 0,
    file_type VARCHAR(100),
    notes TEXT, -- Fitur Catatan/Keterangan per file
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spj_attach_spj ON spj_attachments(spj_id);

-- ------------------------------------------------------------------------------
-- 6. TABEL TEMPLATE AUDIT DINAMIS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    target_org_type org_type NOT NULL,
    description TEXT,
    default_items JSONB NOT NULL DEFAULT '[]'::jsonb, 
    -- Format: [{"id": "uuid", "title": "Buku Kas Masuk", "category": "KEUANGAN", "is_mandatory": true}]
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TABEL PERMINTAAN DOKUMEN AUDIT (Q&A) & ATTACHMENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    auditor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    periode_audit VARCHAR(50) NOT NULL, -- Contoh: "2026"
    title VARCHAR(255) NOT NULL,
    description_html TEXT NOT NULL, -- Catatan dari WYSIWYG Editor
    category VARCHAR(50) NOT NULL DEFAULT 'KEUANGAN', -- KEUANGAN, SDM, ASET, OPERASIONAL
    is_saved_to_master_template BOOLEAN DEFAULT false,
    status request_status NOT NULL DEFAULT 'DITERIMA',
    auditee_response_notes TEXT,
    rejection_notes TEXT,
    due_date DATE,
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doc_req_org ON document_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_doc_req_status ON document_requests(status);
CREATE INDEX IF NOT EXISTS idx_doc_req_periode ON document_requests(periode_audit);

-- Berkas Dokumen Audit Yang Diunggah (Cloudflare R2)
CREATE TABLE IF NOT EXISTS request_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
    file_key VARCHAR(500) NOT NULL, -- Path R2: [Unit_ID]/[Periode]/Audit_Docs/[Request_ID]/filename
    file_url TEXT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL, -- Fitur Rename Display
    file_size BIGINT NOT NULL DEFAULT 0,
    file_type VARCHAR(100),
    notes TEXT, -- Fitur Catatan/Keterangan per file
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_req_attach_req ON request_attachments(request_id);

-- ------------------------------------------------------------------------------
-- 8. TABEL REPOSITORI SOP BERJENJANG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category sop_category NOT NULL,
    level_scope INT NOT NULL DEFAULT 3 CHECK (level_scope BETWEEN 1 AND 3),
    -- 1: Berlaku hanya Level PDM, 2: Hingga Cabang/Majelis, 3: Semua unit hingga Ranting & Masjid
    target_org_type VARCHAR(50) NOT NULL DEFAULT 'SEMUA',
    file_key VARCHAR(500),
    file_url TEXT NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    description TEXT,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sops_cat ON sops(category);
CREATE INDEX IF NOT EXISTS idx_sops_level ON sops(level_scope);

-- ------------------------------------------------------------------------------
-- 9. TABEL AUDIT LOGS (AKTIVITAS SISTEM)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_created ON audit_logs(created_at);

-- ------------------------------------------------------------------------------
-- 10. TRIGGER UPDATE UPDATED_AT OTOMATIS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER set_timestamp_organizations BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER set_timestamp_spjs BEFORE UPDATE ON spjs FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER set_timestamp_document_requests BEFORE UPDATE ON document_requests FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TRIGGER set_timestamp_sops BEFORE UPDATE ON sops FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 11. INITIAL SEED DATA (PDM KOTA YOGYAKARTA, PCM, PRM, MASJID, SEKOLAH)
-- ------------------------------------------------------------------------------

-- Level 1: PDM Kota Yogyakarta
INSERT INTO organizations (id, name, code, level, type, address, phone, email)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Pimpinan Daerah Muhammadiyah Kota Yogyakarta', 'PDM-YK', 1, 'PDM', 'Jl. Sultan Agung No. 14, Pakualaman, Yogyakarta', '0274-375990', 'pdmkotajogja@muhammadiyah.id')
ON CONFLICT (code) DO NOTHING;

-- Level 2: Majelis & PCM
INSERT INTO organizations (id, name, code, level, type, parent_id, address, phone, email)
VALUES 
('22222222-2222-2222-2222-222222222221', 'Majelis Dikdasmen PDM Kota Yogyakarta', 'MAJ-DIKDASMEN', 2, 'MAJELIS', '11111111-1111-1111-1111-111111111111', 'Jl. Sultan Agung No. 14, Yogyakarta', '0274-375991', 'dikdasmen.pdmjogja@gmail.com'),
('22222222-2222-2222-2222-222222222222', 'PCM Gondomanan Kota Yogyakarta', 'PCM-GONDOMANAN', 2, 'PCM', '11111111-1111-1111-1111-111111111111', 'Jl. Kauman No. 23, Gondomanan, Yogyakarta', '0274-371234', 'pcmgondomanan@gmail.com'),
('22222222-2222-2222-2222-222222222223', 'PT Syarikat Cahaya Media (Suara Muhammadiyah)', 'AU-SM', 2, 'ANAK_USAHA', '11111111-1111-1111-1111-111111111111', 'Jl. KH Ahmad Dahlan No. 107, Yogyakarta', '0274-376996', 'redaksi@suaramuhammadiyah.id')
ON CONFLICT (code) DO NOTHING;

-- Level 3: PRM, Masjid, Sekolah
INSERT INTO organizations (id, name, code, level, type, parent_id, address, phone, email)
VALUES 
('33333333-3333-3333-3333-333333333331', 'PRM Kauman', 'PRM-KAUMAN', 3, 'PRM', '22222222-2222-2222-2222-222222222222', 'Kauman, Gondomanan, Yogyakarta', '0274-371111', 'prmkauman@gmail.com'),
('33333333-3333-3333-3333-333333333332', 'Masjid Gedhe Kauman Yogyakarta', 'MSJ-KAUMAN', 3, 'MASJID', '33333333-3333-3333-3333-333333333331', 'Alun-alun Keraton, Gondomanan, Yogyakarta', '0274-372222', 'takmir.kauman@gmail.com'),
('33333333-3333-3333-3333-333333333333', 'SMA Muhammadiyah 1 Yogyakarta (Muhi)', 'SEK-MUHI', 3, 'SEKOLAH', '22222222-2222-2222-2222-222222222221', 'Jl. Gotongroyong II, Petinggen, Karangwaru, Yogyakarta', '0274-513454', 'info@smamuhi-yog.sch.id'),
('33333333-3333-3333-3333-333333333334', 'Masjid Jogokariyan', 'MSJ-JOGOKARIYAN', 3, 'MASJID', '11111111-1111-1111-1111-111111111111', 'Jl. Jogokaryan No. 36, Mantrijeron, Yogyakarta', '0274-383049', 'takmir@masjidjogokariyan.com')
ON CONFLICT (code) DO NOTHING;

-- Akun Pengguna Contoh (Dapat disinkronkan dengan Supabase Auth)
INSERT INTO users (id, organization_id, email, full_name, role, phone)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'superadmin@pdmjogja.org', 'Super Administrator PDM', 'SUPER_ADMIN', '081234567890'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'auditor.lppk@pdmjogja.org', 'Ketua Tim Auditor LPPK', 'AUDITOR_INTERNAL', '081234567891'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'bendahara.pdm@pdmjogja.org', 'Bendahara PDM Kota Yogyakarta', 'BENDAHARA', '081234567892'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'approver.pcm@pdmjogja.org', 'Ketua PCM Gondomanan', 'APPROVER_SPJ', '081234567893'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333332', 'bendahara.kauman@pdmjogja.org', 'Bendahara Takmir Kauman', 'STAFF_UNIT', '081234567894'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'viewer.sekolah@pdmjogja.org', 'Pengawas Sekolah SMA Muhi', 'VIEWER_ONLY', '081234567895')
ON CONFLICT (email) DO NOTHING;

-- Template Audit Bawaan
INSERT INTO audit_templates (id, name, target_org_type, description, default_items)
VALUES 
(
  '99999999-9999-9999-9999-999999999991',
  'Template Audit Standar Masjid',
  'MASJID',
  'Template pemeriksaan berkas & kepatuhan keuangan takmir masjid di lingkungan PDM Kota Yogyakarta.',
  '[
    {"id": "t-1", "title": "Buku Kas & Rekening Koran Bank Terakhir", "category": "KEUANGAN", "is_mandatory": true},
    {"id": "t-2", "title": "Bukti Fisik Kwitansi / Nota Pengeluaran Tertinggi Periode Berjalan", "category": "KEUANGAN", "is_mandatory": true},
    {"id": "t-3", "title": "Daftar Inventaris Tanah Wakaf & Aset Masjid", "category": "ASET", "is_mandatory": true},
    {"id": "t-4", "title": "SK Susunan Pengurus Takmir Disahkan PCM/PRM", "category": "ORGANISASI", "is_mandatory": false}
  ]'::jsonb
),
(
  '99999999-9999-9999-9999-999999999992',
  'Template Audit Amal Usaha Sekolah (AUM)',
  'SEKOLAH',
  'Standar audit operasional, SPJ BOS/Komite, dan verifikasi aset pendidikan.',
  '[
    {"id": "t-10", "title": "Laporan Realisasi RAPBS Semester Berjalan", "category": "KEUANGAN", "is_mandatory": true},
    {"id": "t-11", "title": "Rekonsiliasi Bank dan Berita Acara Kas Opname", "category": "KEUANGAN", "is_mandatory": true},
    {"id": "t-12", "title": "Daftar Gaji dan Honorarium Guru/Karyawan", "category": "SDM", "is_mandatory": true},
    {"id": "t-13", "title": "Laporan Mutasi & Sertifikasi Aset Gedung/Tanah", "category": "ASET", "is_mandatory": false}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Sample SOP
INSERT INTO sops (id, title, category, level_scope, target_org_type, file_url, version, description)
VALUES 
(
  '88888888-8888-8888-8888-888888888881',
  'SOP Prosedur Verifikasi dan SPJ Keuangan Persyarikatan',
  'KEUANGAN',
  3,
  'SEMUA',
  'https://pub-75569bb9cb0a485b933e7b4f4c7f4080.r2.dev/sop/SOP-KEU-01-SPJ.pdf',
  '2.1',
  'Standar baku penyusunan bukti pertanggungjawaban dana umat dan batas waktu kelengkapan nota.'
),
(
  '88888888-8888-8888-8888-888888888882',
  'SOP Tata Kelola dan Pencatatan Tanah Wakaf Masjid Muhammadiyah',
  'ASET',
  3,
  'MASJID',
  'https://pub-75569bb9cb0a485b933e7b4f4c7f4080.r2.dev/sop/SOP-AST-02-WAKAF.pdf',
  '1.0',
  'Tata cara pelaporan legalitas sertifikat wakaf atas nama Persyarikatan Muhammadiyah.'
)
ON CONFLICT DO NOTHING;
