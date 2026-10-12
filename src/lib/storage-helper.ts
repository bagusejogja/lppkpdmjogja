import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN, isR2Configured } from './r2';

export interface StoragePathParams {
  unitCodeOrId: string;      // Contoh: "MSJ-KAUMAN" atau UUID Unit
  periodeAudit: string;      // Contoh: "2026"
  module: 'SPJ' | 'Audit_Docs';
  referenceId: string;       // ID SPJ atau ID Document Request
  filename: string;          // Nama berkas asli
}

/**
 * Sanitasi string folder agar aman di Cloudflare R2 / S3
 */
export function sanitizeKeySegment(segment: string): string {
  return segment
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
}

/**
 * Membangun struktur folder R2 standar LPPK PDM Jogja:
 * bucket-name/
 * └── [Unit_Audit_ID]/
 *     └── [Periode_Audit_2026]/
 *         ├── SPJ/
 *         │   └── [SPJ_ID]/file1.pdf
 *         └── Audit_Docs/
 *             └── [Request_ID]/file2.xlsx
 */
export function buildR2StorageKey(params: StoragePathParams): string {
  const cleanUnit = sanitizeKeySegment(params.unitCodeOrId);
  const cleanPeriode = sanitizeKeySegment(params.periodeAudit);
  const cleanRef = sanitizeKeySegment(params.referenceId);
  
  // Ambil nama file dan timestamp untuk menghindari tabrakan nama file yang sama
  const ext = params.filename.includes('.') ? params.filename.substring(params.filename.lastIndexOf('.')) : '';
  const baseName = sanitizeKeySegment(params.filename.replace(ext, ''));
  const safeFilename = `${baseName}_${Date.now()}${ext}`;

  return `${cleanUnit}/${cleanPeriode}/${params.module}/${cleanRef}/${safeFilename}`;
}

/**
 * Validasi ekstensi dan tipe MIME berkas yang diperbolehkan
 * Format yang didukung: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Gambar (.jpg, .png)
 */
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.webp'];

export function validateUploadedFile(file: { name: string; size: number; type?: string }): { valid: boolean; error?: string } {
  const maxSizeBytes = 25 * 1024 * 1024; // 25 MB
  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'Ukuran file melebihi batas maksimal 25 MB' };
  }

  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { 
      valid: false, 
      error: `Format file '${ext}' tidak didukung. Harap unggah PDF, Word (.doc, .docx), Excel (.xls, .xlsx), atau Gambar (.jpg, .png).` 
    };
  }

  return { valid: true };
}

/**
 * Generate Presigned Upload URL untuk direct upload dari browser ke Cloudflare R2
 */
export async function getPresignedUploadUrl(storageKey: string, contentType: string): Promise<string> {
  if (!isR2Configured) {
    // Mode demo / fallback
    return `/api/upload/mock?key=${encodeURIComponent(storageKey)}`;
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: storageKey,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

/**
 * Mendapatkan Public URL dari berkas R2
 */
export function getR2PublicUrl(storageKey: string): string {
  const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
  return `${cleanDomain}/${storageKey}`;
}
