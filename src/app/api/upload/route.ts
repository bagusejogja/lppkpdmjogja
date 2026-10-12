import { NextRequest, NextResponse } from 'next/server';
import { buildR2StorageKey, validateUploadedFile, getR2PublicUrl } from '@/lib/storage-helper';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const unitCode = (formData.get('unitCode') as string) || 'PDM-YK';
    const periode = (formData.get('periode') as string) || '2026';
    const moduleType = (formData.get('module') as 'SPJ' | 'Audit_Docs') || 'Audit_Docs';
    const referenceId = (formData.get('referenceId') as string) || 'ref-01';

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const validation = validateUploadedFile({ name: file.name, size: file.size });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Bangun Cloudflare R2 Key sesuai format terstruktur:
    // bucket-name/[Unit_Audit_ID]/[Periode_Audit_2026]/SPJ/[SPJ_ID]/file.pdf
    const storageKey = buildR2StorageKey({
      unitCodeOrId: unitCode,
      periodeAudit: periode,
      module: moduleType,
      referenceId: referenceId,
      filename: file.name,
    });

    const publicUrl = getR2PublicUrl(storageKey);

    return NextResponse.json({
      success: true,
      storageKey,
      publicUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
