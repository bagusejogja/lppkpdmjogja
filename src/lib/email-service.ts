import nodemailer from 'nodemailer';

interface SendNotificationParams {
  toEmail: string;
  toName: string;
  subject: string;
  notificationType: 'PERMINTAAN_BARU' | 'PERMINTAAN_REVISI' | 'STATUS_KOMPLIT' | 'SPJ_APPROVAL';
  unitName: string;
  title: string;
  periodeAudit: string;
  notes?: string;
  actionUrl?: string;
}

export async function sendAuditNotificationEmail(params: SendNotificationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.EMAIL_FROM || '"LPPK PDM Kota Yogyakarta" <lppkpdmjogja@gmail.com>';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const targetUrl = params.actionUrl || `${appUrl}/audit`;

  // Template email responsive bertema Muhammadiyah (Hijau #055838 & Aksen Emas)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${params.subject}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background-color: #055838; padding: 24px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">LEMBAGA PEMBINAAN & PENGAWASAN KEUANGAN</h2>
            <p style="margin: 4px 0 0; font-size: 14px; color: #fef3c7;">Pimpinan Daerah Muhammadiyah Kota Yogyakarta</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 28px 24px;">
            <p style="font-size: 15px; color: #374151; margin-top: 0;">
              Assalamu'alaikum Warahmatullahi Wabarakatuh,<br><br>
              Yth. <strong>${params.toName}</strong> (${params.unitName}),
            </p>

            <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #166534;">
                Pemberitahuan Sistem Audit Internal (Periode: ${params.periodeAudit})
              </p>
              <p style="margin: 6px 0 0; font-size: 15px; font-weight: 700; color: #111827;">
                ${params.title}
              </p>
            </div>

            ${params.notes ? `
              <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 16px 0;">
                <strong>Catatan Auditor / Evaluator:</strong><br>
                <span style="font-style: italic; color: #dc2626;">"${params.notes}"</span>
              </p>
            ` : ''}

            <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
              Mohon segera masuk ke portal untuk memeriksa kelengkapan berkas dan merespons permintaan tersebut.
            </p>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0 20px;">
              <a href="${targetUrl}" style="background-color: #055838; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;">
                Buka Portal Audit & SPJ &rarr;
              </a>
            </div>

            <p style="font-size: 13px; color: #6b7280; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh.<br><br>
              <strong>Tim Auditor LPPK PDM Kota Yogyakarta</strong><br>
              Jl. Sultan Agung No. 14, Pakualaman, Yogyakarta
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 14px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
            Email ini dikirim otomatis oleh Sistem Komunikasi Audit Internal LPPK PDM Kota Yogyakarta.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Jika SMTP belum dikonfigurasi, simulasikan kirim email dan log ke console
  if (!smtpUser || !smtpPass) {
    console.log(`[SIMULASI EMAIL] Dikirim ke: ${params.toEmail} | Subjek: ${params.subject}`);
    return { success: true, messageId: `simulated-${Date.now()}` };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: params.toEmail,
      subject: params.subject,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('Gagal mengirim email notifikasi:', err);
    return { success: false, error: err?.message || 'Gagal mengirim email' };
  }
}
