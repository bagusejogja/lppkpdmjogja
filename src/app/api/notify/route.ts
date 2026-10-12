import { NextRequest, NextResponse } from 'next/server';
import { sendAuditNotificationEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await sendAuditNotificationEmail({
      toEmail: body.toEmail,
      toName: body.toName,
      subject: body.subject,
      notificationType: body.notificationType,
      unitName: body.unitName,
      title: body.title,
      periodeAudit: body.periodeAudit || '2026',
      notes: body.notes,
      actionUrl: body.actionUrl,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
