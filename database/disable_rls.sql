-- ==============================================================================
-- SISTEM KOMUNIKASI AUDIT INTERNAL, APPROVAL SPJ & REPOSITORI SOP
-- LPPK PDM KOTA YOGYAKARTA
-- Script: Nonaktifkan Row Level Security (RLS) di Semua Tabel
-- ==============================================================================

ALTER TABLE IF EXISTS organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS template_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sops DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS document_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS request_attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS request_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spjs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spj_attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS spj_approvals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs DISABLE ROW LEVEL SECURITY;

-- Verifikasi status RLS tabel
SELECT schemaname, tablename, rowsecurity AS is_rls_enabled FROM pg_tables WHERE schemaname = 'public';
