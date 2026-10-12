# Sistem Komunikasi Audit Internal, Approval SPJ & Repositori SOP
### Lembaga Pembinaan dan Pengawasan Keuangan (LPPK) PDM Kota Yogyakarta

Aplikasi web Full-Stack modern yang dirancang khusus untuk memfasilitasi komunikasi audit internal, verifikasi bukti transaksi secara digital, persetujuan SPJ berjenjang (1 s/d 5 level approval), repositori Standard Operating Procedure (SOP), serta monitoring kepatuhan keuangan di lingkungan **Pimpinan Daerah Muhammadiyah (PDM) Kota Yogyakarta** dan seluruh amal usaha di bawahnya (PCM, PRM, Sekolah, Masjid, dan Anak Usaha).

---

## 1. Spesifikasi Teknologi & Stack
* **Framework Web:** Next.js (App Router, TypeScript, React 19)
* **Styling & Design System:** Tailwind CSS v3, Shadcn UI pattern, Muhammadiyah Palette (Deep Green `#055838` & Gold `#d97706`)
* **Database & Auth:** Supabase (PostgreSQL 15+ dengan Row Level Security & Supabase Auth)
  * Target Project: `https://pofruxnxcnzhjdwdlkiu.supabase.co`
* **Storage File Cloud:** Cloudflare R2 (S3 Compatible API - `lppkpdmjogja@gmail.com`)
* **Visualisasi Data:** Recharts (Interaktif Donut & Bar Charts)
* **Notifikasi Email:** Resend / Nodemailer SMTP otomatis dari Auditor ke Auditee
* **Repositori GitHub:** `https://github.com/bagusejogja/lppkpdmjogja.git`
* **Deployment:** Siap dideploy di Vercel

---

## 2. Struktur Hierarki Organisasi & Role-Based Access Control (RBAC)

### A. Struktur Berjenjang (Parent-Child)
* **Level 1 (Daerah):** PDM Kota Yogyakarta (Pimpinan Utama, Tim Auditor LPPK, Bendahara PDM)
* **Level 2 (Cabang & Majelis):** PCM Gondomanan, Majelis Dikdasmen, PT Syarikat Cahaya Media (Suara Muhammadiyah), dll.
* **Level 3 (Ranting, Masjid, Sekolah, Unit Usaha):** PRM Kauman, Masjid Gedhe Kauman, Masjid Jogokariyan, SMA Muhammadiyah 1 (Muhi), dll.

### B. Peran & Hak Akses (RBAC)
1. `SUPER_ADMIN`: Kelola master organisasi, user akun, alur konfigurasi, dan design system.
2. `AUDITOR_INTERNAL`: Membuat permintaan berkas audit (Q&A), verifikasi dokumen, evaluasi SPJ, dan terbitkan status Komplit/Revisi.
3. `BENDAHARA`: Validasi pengajuan keuangan dan verifikasi nota/kwitansi.
4. `APPROVER_SPJ`: Otoritas persetujuan/penolakan SPJ sesuai tingkatan masing-masing (Level 1 s/d 5).
5. `STAFF_UNIT`: Mengunggah berkas audit, mengajukan SPJ, dan akses SOP.
6. `VIEWER_ONLY`: Mode Read-Only tanpa tombol Edit/Submit/Delete.

---

## 3. Struktur Folder Project (Next.js App Router)

```text
d:/BK/OneDrive - UGM 365/Desktop/lppkpdmjogja/
├── .env.example                     # Template konfigurasi environment
├── .env.local                       # Kredensial aktif (Supabase, R2, Email)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.mjs
├── database/
│   └── schema.sql                   # Skema DDL PostgreSQL Supabase + RLS + Seed Data
├── prisma/
│   └── schema.prisma                # Skema Prisma ORM sebagai referensi
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Layout responsive + sidebar + context unit switcher
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard analitik & chart interaktif
│   │   │   ├── audit/
│   │   │   │   └── page.tsx         # Modul Audit (Q&A), Template Dinamis, R2 Upload & Rename
│   │   │   ├── spj/
│   │   │   │   └── page.tsx         # Modul Multi-Level Approval SPJ (1-5 Level Stepper)
│   │   │   ├── sop/
│   │   │   │   └── page.tsx         # Modul Repositori SOP Berjenjang
│   │   │   └── design-system/
│   │   │       └── page.tsx         # Master UI Styleguide & Komponen Showcase
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.ts         # Cloudflare R2 Upload API Handler
│   │   │   └── notify/
│   │   │       └── route.ts         # Resend / Nodemailer Email Dispatcher API
│   │   ├── globals.css              # Custom styling & scrollbars
│   │   ├── layout.tsx               # Root Layout + React Hot Toast provider
│   │   └── page.tsx                 # Redirect otomatis ke /dashboard
│   ├── components/
│   │   └── ui/                      # Library Komponen UI Standar
│   │       ├── Button.tsx           # Primary, Secondary, Outline, Destructive, Loading
│   │       ├── Badge.tsx            # StatusBadge & RoleBadge
│   │       ├── Card.tsx             # Card, Header, Content, Footer
│   │       ├── Modal.tsx            # Dialog Box popup + ESC handler
│   │       ├── Forms.tsx            # Input, Select, Textarea
│   │       ├── Table.tsx            # Responsive Table & Pagination Controls
│   │       └── Alert.tsx            # Banner Success, Warning, Danger, Info
│   ├── lib/
│   │   ├── supabase.ts              # Inisialisasi Client & Admin Supabase
│   │   ├── r2.ts                    # AWS S3 Client terhubung ke Cloudflare R2
│   │   ├── storage-helper.ts        # Generator Path Folder R2 & File Validator
│   │   ├── email-service.ts         # Generator Template Email & Pengirim Notifikasi
│   │   └── mock-data.ts             # Data inisial organisasi, pengguna, template & SPJ
│   └── types/
│       └── database.ts              # TypeScript interfaces untuk seluruh tabel
```

---

## 4. Struktur Folder Otomatis di Cloudflare R2

File berkas yang diunggah secara otomatis disimpan dengan struktur hierarki rapi tanpa penumpukan acak:

```text
bucket-name/
└── [Unit_Audit_ID]/
    └── [Periode_Audit_2026]/
        ├── SPJ/
        │   └── [SPJ_ID]/
        │       ├── Kwitansi_Belanja_1712903.pdf
        │       └── Nota_Toko_1712904.jpg
        └── Audit_Docs/
            └── [Request_ID]/
                ├── Rekening_Koran_1712901.pdf
                └── Buku_Inventaris_1712902.xlsx
```

* **Fitur Kelola Berkas di Web:** User dapat mengubah **Judul Display File (Rename Display)** dan memberikan **Catatan/Keterangan** pada setiap file yang diunggah tanpa merusak file asli di Cloudflare R2.

---

## 5. Panduan Instalasi & Menjalankan Project

### Langkah 1: Buka Terminal di Folder Project
```bash
cd "d:\BK\OneDrive - UGM 365\Desktop\lppkpdmjogja"
```

### Langkah 2: Install Dependencies
```bash
npm install
```

### Langkah 3: Eksekusi Skema Database di Supabase
1. Buka browser: [https://pofruxnxcnzhjdwdlkiu.supabase.co](https://pofruxnxcnzhjdwdlkiu.supabase.co)
2. Masuk ke menu **SQL Editor** &rarr; **New Query**.
3. Buka file `database/schema.sql` di project ini, copy seluruh isinya lalu klik **Run**.
4. Seluruh tabel (`organizations`, `users`, `approval_steps`, `spjs`, `spj_attachments`, `audit_templates`, `document_requests`, `request_attachments`, `sops`, `audit_logs`) beserta initial dummy data PDM Yogyakarta akan langsung terbuat.

### Langkah 4: Jalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di: `http://localhost:3000`

---

## 6. Sinkronisasi GitHub & Deployment Vercel

### Push ke GitHub:
```bash
git add .
git commit -m "feat: inisialisasi sistem audit internal, spj berjenjang dan sop lppk pdm jogja"
git branch -M main
git push -u origin main
```

### Deploy di Vercel:
1. Masuk ke [https://vercel.com](https://vercel.com) dan pilih **Add New Project**.
2. Pilih repository: `bagusejogja/lppkpdmjogja`.
3. Masukkan Environment Variables sesuai yang ada di file `.env.local`.
4. Klik **Deploy**.
