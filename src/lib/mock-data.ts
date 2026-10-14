import { Organization, User, DocumentRequest, Spj, AuditTemplate, Sop } from '@/types/database';

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Pimpinan Daerah Muhammadiyah Kota Yogyakarta',
    code: 'PDM-YK',
    level: 1,
    type: 'PDM',
    address: 'Jl. Sultan Agung No. 14, Yogyakarta',
    phone: '0274-375990',
    email: 'pdmkotajogja@muhammadiyah.id',
  },
  {
    id: '22222222-2222-2222-2222-222222222221',
    name: 'Majelis Dikdasmen PDM Kota Yogyakarta',
    code: 'MAJ-DIKDASMEN',
    level: 2,
    type: 'MAJELIS',
    parent_id: '11111111-1111-1111-1111-111111111111',
    email: 'dikdasmen@pdmjogja.org',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'PCM Gondomanan Kota Yogyakarta',
    code: 'PCM-GONDOMANAN',
    level: 2,
    type: 'PCM',
    parent_id: '11111111-1111-1111-1111-111111111111',
    email: 'pcmgondomanan@pdmjogja.org',
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    name: 'PT Syarikat Cahaya Media (Suara Muhammadiyah)',
    code: 'AU-SM',
    level: 2,
    type: 'ANAK_USAHA',
    parent_id: '11111111-1111-1111-1111-111111111111',
    email: 'redaksi@suaramuhammadiyah.id',
  },
  {
    id: '33333333-3333-3333-3333-333333333331',
    name: 'PRM Kauman',
    code: 'PRM-KAUMAN',
    level: 3,
    type: 'PRM',
    parent_id: '22222222-2222-2222-2222-222222222222',
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    name: 'Masjid Gedhe Kauman Yogyakarta',
    code: 'MSJ-KAUMAN',
    level: 3,
    type: 'MASJID',
    parent_id: '33333333-3333-3333-3333-333333333331',
    email: 'takmir.kauman@gmail.com',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'SMA Muhammadiyah 1 Yogyakarta (Muhi)',
    code: 'SEK-MUHI',
    level: 3,
    type: 'SEKOLAH',
    parent_id: '22222222-2222-2222-2222-222222222221',
    email: 'info@smamuhi-yog.sch.id',
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    name: 'Masjid Jogokariyan',
    code: 'MSJ-JOGOKARIYAN',
    level: 3,
    type: 'MASJID',
    parent_id: '11111111-1111-1111-1111-111111111111',
    email: 'takmir@masjidjogokariyan.com',
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    organization_id: '11111111-1111-1111-1111-111111111111',
    email: 'superadmin@pdmjogja.org',
    full_name: 'Drs. H. Akhid Widi Rahmanto',
    role: 'SUPER_ADMIN',
    phone: '081234567890',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    groups: [
      { groupId: 'grp-super', groupName: 'Super Admin PDM', role: 'SUPER_ADMIN', isDefault: true },
      { groupId: 'grp-lppk', groupName: 'Tim Pengarah LPPK', role: 'AUDITOR_INTERNAL' }
    ]
  },
  {
    id: 'u-2',
    organization_id: '11111111-1111-1111-1111-111111111111',
    email: 'auditor.lppk@pdmjogja.org',
    full_name: 'Muhammad Faris, S.E., M.Acc., Ak., CA',
    role: 'AUDITOR_INTERNAL',
    phone: '081234567891',
    is_active: true,
    created_at: '2026-01-05T00:00:00Z',
    groups: [
      { groupId: 'grp-lppk', groupName: 'Tim Auditor Utama LPPK', role: 'AUDITOR_INTERNAL', isDefault: true },
      { groupId: 'grp-lazismu-pdm', groupName: 'Dewan Pengawas Syariah Lazismu', role: 'AUDITOR_INTERNAL' }
    ]
  },
  {
    id: 'u-3',
    organization_id: '11111111-1111-1111-1111-111111111111',
    email: 'bendahara.pdm@pdmjogja.org',
    full_name: 'H. Abdul Latif Baedhowi, S.Ag',
    role: 'BENDAHARA',
    phone: '081234567892',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
    groups: [
      { groupId: 'grp-bendahara-pdm', groupName: 'Bendahara PDM Yogyakarta', role: 'BENDAHARA', isDefault: true },
      { groupId: 'grp-approver-pdm', groupName: 'Approver Keuangan Level 4 & 5', role: 'APPROVER_SPJ' }
    ]
  },
  {
    id: 'u-4',
    organization_id: '33333333-3333-3333-3333-333333333332',
    email: 'bendahara.kauman@pdmjogja.org',
    full_name: 'Ahmad Zaki Al-Farisi',
    role: 'STAFF_UNIT',
    phone: '081234567893',
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    groups: [
      { groupId: 'grp-takmir-kauman', groupName: 'Bendahara Masjid Gedhe Kauman', role: 'STAFF_UNIT', isDefault: true },
      { groupId: 'grp-lazismu-ngampilan', groupName: 'Admin KL Lazismu Ngampilan', role: 'STAFF_UNIT' },
      { groupId: 'grp-auditor-muda', groupName: 'Anggota LPPK Bidang Dakwah', role: 'AUDITOR_INTERNAL' }
    ]
  },
  {
    id: 'u-5',
    organization_id: '22222222-2222-2222-2222-222222222222',
    email: 'approver.pcm@pdmjogja.org',
    full_name: 'H. Sudarsono, M.Pd.',
    role: 'APPROVER_SPJ',
    phone: '081234567894',
    is_active: true,
    created_at: '2026-02-15T00:00:00Z',
    groups: [
      { groupId: 'grp-pcm-gondomanan', groupName: 'Ketua PCM Gondomanan', role: 'APPROVER_SPJ', isDefault: true }
    ]
  }
];

export const MOCK_TEMPLATES: AuditTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Template Audit Standar Masjid',
    target_org_type: 'MASJID',
    description: 'Pemeriksaan kepatuhan laporan kas dakwah, ZISWAF, dan legalitas aset tanah wakaf.',
    is_active: true,
    default_items: [
      { id: '1', title: 'Buku Kas & Rekening Koran Bank 6 Bulan Terakhir', category: 'KEUANGAN', is_mandatory: true, description: 'Rekening koran atas nama takmir dan buku kas ditandatangani bendahara' },
      { id: '2', title: 'Bukti Kwitansi/Nota Pengeluaran Operasional & Renovasi', category: 'KEUANGAN', is_mandatory: true, description: 'Nota fisik bermaterai untuk belanja modal' },
      { id: '3', title: 'Buku Inventaris & Sertifikat Ikrar Wakaf (AIW/APAIW)', category: 'ASET', is_mandatory: true, description: 'Legalitas sertifikat atas nama Persyarikatan' },
      { id: '4', title: 'SK Susunan Takmir Disahkan Pimpinan Persyarikatan', category: 'ORGANISASI', is_mandatory: false, description: 'SK pengesahan dari PCM/PRM setempat' },
    ]
  },
  {
    id: 'tpl-2',
    name: 'Template Audit Sekolah & Madrasah (AUM Pendidikan)',
    target_org_type: 'SEKOLAH',
    description: 'Evaluasi RAPBS, SPJ Dana BOS, penggajian pegawai, dan inventarisasi sarpras.',
    is_active: true,
    default_items: [
      { id: '10', title: 'Laporan Realisasi RAPBS Semester Berjalan', category: 'KEUANGAN', is_mandatory: true, description: 'Realisasi anggaran pendapatan dan belanja sekolah' },
      { id: '11', title: 'Berita Acara Rekonsiliasi Kas dan Bank', category: 'KEUANGAN', is_mandatory: true, description: 'Kas opname fisik dan saldo rekening koran' },
      { id: '12', title: 'Daftar Gaji Guru dan Karyawan Tetap/Tidak Tetap', category: 'SDM', is_mandatory: true, description: 'SK penetapan gaji dan bukti transfer bank' },
      { id: '13', title: 'Laporan Buku Induk Aset dan Sarana Pendidikan', category: 'ASET', is_mandatory: false, description: 'Mutasi inventaris komputer, gedung, dan tanah' },
    ]
  },
  {
    id: 'tpl-3',
    name: 'Template Audit Kantor Layanan Lazismu (14 Kecamatan)',
    target_org_type: 'LAZISMU',
    description: 'Standar audit kepatuhan amil zakat, pembagian asnaf 8, dan dana amil 12.5%.',
    is_active: true,
    default_items: [
      { id: '30', title: 'Laporan Penghimpunan ZIS per Program & Per Muzakki', category: 'KEUANGAN', is_mandatory: true, description: 'Rekapitulasi penerimaan kas dan transfer perbankan' },
      { id: '31', title: 'Berita Acara & Tanda Terima Penyaluran Mustahik', category: 'KEUANGAN', is_mandatory: true, description: 'Dokumentasi bukti serah terima bantuan fakir miskin' },
      { id: '32', title: 'Laporan Hak Amil dan Rasio Operasional Kantor', category: 'OPERASIONAL', is_mandatory: true, description: 'Kepatuhan batas maksimal hak amil 12.5%' },
    ]
  }
];

export const MOCK_SOPS: Sop[] = [
  {
    id: 'sop-1',
    title: 'SOP Penyusunan & Verifikasi SPJ Keuangan Persyarikatan',
    category: 'KEUANGAN',
    level_scope: 3,
    target_org_type: 'SEMUA',
    file_url: '/api/download?key=SOP-KEU-01-SPJ.pdf&filename=SOP-KEU-01-SPJ.pdf',
    version: '2.1',
    description: 'Panduan standar kelengkapan dokumen pengeluaran, materai, dan penatausahaan kwitansi.',
    published_date: '2026-01-15'
  },
  {
    id: 'sop-2',
    title: 'SOP Tata Kelola Tanah Wakaf & Bangunan Milik Muhammadiyah',
    category: 'ASET',
    level_scope: 3,
    target_org_type: 'MASJID',
    file_url: '/api/download?key=SOP-AST-02-WAKAF.pdf&filename=SOP-AST-02-WAKAF.pdf',
    version: '1.2',
    description: 'Prosedur sertifikasi ikrar wakaf, inventarisasi aset, dan larangan pemindahtanganan.',
    published_date: '2026-02-01'
  },
  {
    id: 'sop-3',
    title: 'SOP Rekrutmen dan Pembinaan Pegawai Amal Usaha Muhammadiyah (AUM)',
    category: 'SDM',
    level_scope: 2,
    target_org_type: 'SEKOLAH',
    file_url: '/api/download?key=SOP-SDM-03-PEGAWAI.pdf&filename=SOP-SDM-03-PEGAWAI.pdf',
    version: '1.0',
    description: 'Ketentuan uji Al-Islam Kemuhammadiyahan (AIK) dan penetapan gaji pokok serta tunjangan.',
    published_date: '2026-03-10'
  }
];


export const MOCK_DOCUMENT_REQUESTS: DocumentRequest[] = [
  {
    id: 'req-01',
    organization_id: '33333333-3333-3333-3333-333333333332',
    auditor_id: 'u-2',
    periode_audit: '2026',
    title: 'Rekening Koran dan Berita Acara Kas Opname Bulan Januari - Maret 2026',
    description_html: '<p>Mohon takmir melampirkan salinan rekening koran bank BSI atas nama Masjid Gedhe Kauman serta Berita Acara Kas Opname fisik per 31 Maret 2026.</p>',
    category: 'KEUANGAN',
    is_saved_to_master_template: false,
    status: 'DISUBMIT',
    due_date: '2026-04-30',
    created_at: '2026-04-01T08:00:00Z',
    organization: MOCK_ORGANIZATIONS[5],
    attachments: [
      {
        id: 'att-1',
        request_id: 'req-01',
        file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf',
        file_url: '/api/download?key=MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf&filename=MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf',
        original_name: 'scan_rekening_bsi_09812.pdf',
        display_name: 'Rekening Koran BSI Kauman Q1 2026 (Valid)',
        file_size: 2450000,
        file_type: 'application/pdf',
        notes: 'Sudah ditandatangani ketua takmir dan bendahara',
        uploaded_by: 'u-4',
        uploaded_by_name: 'Ahmad Zaki (Bendahara Unit)',
        created_at: '2026-04-05T10:15:00Z',
        updated_at: '2026-04-05T10:15:00Z',
        version: 'v1.0'
      }
    ]
  },
  {
    id: 'req-02',
    organization_id: '33333333-3333-3333-3333-333333333332',
    auditor_id: 'u-2',
    periode_audit: '2026',
    title: 'Sertifikat Ikrar Wakaf dan Peta Bidang Tanah Masjid',
    description_html: '<p>Verifikasi status hukum kepemilikan tanah wakaf di sekitar kompleks serambi masjid.</p>',
    category: 'ASET',
    is_saved_to_master_template: true,
    status: 'KOMPLIT',
    due_date: '2026-04-20',
    created_at: '2026-04-01T08:30:00Z',
    organization: MOCK_ORGANIZATIONS[5],
    attachments: [
      {
        id: 'att-2',
        request_id: 'req-02',
        file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-02/Sertifikat_Wakaf_Kauman.pdf',
        file_url: '/api/download?key=MSJ-KAUMAN/2026/Audit_Docs/req-02/Sertifikat_Wakaf_Kauman.pdf&filename=MSJ-KAUMAN/2026/Audit_Docs/req-02/Sertifikat_Wakaf_Kauman.pdf',
        original_name: 'sertifikat_wakaf_aiw.pdf',
        display_name: 'Akta Ikrar Wakaf KUA Gondomanan',
        file_size: 5120000,
        file_type: 'application/pdf',
        notes: 'Dokumen asli tersimpan di brankas PDM',
        uploaded_by: 'u-4',
        uploaded_by_name: 'Ahmad Zaki (Bendahara Unit)',
        created_at: '2026-04-02T14:20:00Z',
        updated_at: '2026-04-02T14:20:00Z',
        version: 'v1.0'
      }
    ]
  },
  {
    id: 'req-03',
    organization_id: '33333333-3333-3333-3333-333333333333',
    auditor_id: 'u-2',
    periode_audit: '2026',
    title: 'Laporan Penggunaan Dana BOS & SPJ Triwulan 1',
    description_html: '<p>Lampirkan bukti kuitansi belanja modal dan honorarium guru GTT/PTT.</p>',
    category: 'KEUANGAN',
    is_saved_to_master_template: true,
    status: 'REVISI',
    due_date: '2026-04-15',
    created_at: '2026-04-03T11:00:00Z',
    organization: MOCK_ORGANIZATIONS[6],
    attachments: [
      {
        id: 'att-3',
        request_id: 'req-03',
        file_key: 'SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.pdf',
        file_url: '/api/download?key=SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.pdf&filename=SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.pdf',
        original_name: 'rekap_bos_tw1.pdf',
        display_name: 'Draf SPJ BOS Triwulan I SMA Muhi',
        file_size: 3200000,
        file_type: 'application/pdf',
        notes: 'Belum ada tanda tangan kepala bendahara sekolah',
        uploaded_by: 'u-3',
        uploaded_by_name: 'Siti Aminah, S.Pd',
        created_at: '2026-04-07T09:10:00Z',
        updated_at: '2026-04-08T11:00:00Z',
        version: 'v1.1'
      }
    ]
  }
];

export const MOCK_SPJS: Spj[] = [
  {
    id: 'spj-01',
    organization_id: '33333333-3333-3333-3333-333333333332',
    created_by: 'u-4',
    nomor_spj: 'SPJ/MSJ-KM/2026/04/001',
    judul_pengajuan: 'Renovasi Instalasi Tempat Wudhu & Sound System Masjid Kauman',
    deskripsi: 'Penggantian kabel audio, mikrofon imam, dan perbaikan keran wudhu menjelang Ramadan.',
    total_nominal: 18500000,
    periode_audit: '2026',
    current_level: 2,
    max_levels: 3,
    status: 'PENDING_LEVEL_2',
    submitted_at: '2026-04-06T08:00:00Z',
    organization: MOCK_ORGANIZATIONS[5],
    attachments: [
      {
        id: 'att-spj-1',
        spj_id: 'spj-01',
        file_key: 'MSJ-KAUMAN/2026/SPJ/spj-01/Nota_Kwitansi_Audio.pdf',
        file_url: '/api/download?key=MSJ-KAUMAN/2026/SPJ/spj-01/Nota_Kwitansi_Audio.pdf&filename=MSJ-KAUMAN/2026/SPJ/spj-01/Nota_Kwitansi_Audio.pdf',
        original_name: 'nota_audio_toko_jaya.pdf',
        display_name: 'Kwitansi Pembelian Sound System Toko Jaya Musik',
        file_size: 1820000,
        file_type: 'application/pdf',
        notes: 'Lunas bertanda tangan toko & materai 10.000',
        uploaded_by: 'u-4',
        created_at: '2026-04-06T08:10:00Z'
      }
    ],
    approvals: [
      {
        id: 'appr-1',
        spj_id: 'spj-01',
        level_number: 1,
        actor_id: 'u-4',
        actor_name: 'Ahmad Zaki (Bendahara Unit)',
        action: 'SUBMIT',
        notes: 'Pengajuan SPJ diajukan lengkap dengan nota asli.',
        action_date: '2026-04-06T08:15:00Z'
      },
      {
        id: 'appr-2',
        spj_id: 'spj-01',
        level_number: 1,
        actor_id: 'u-1',
        actor_name: 'Ketua Takmir Kauman',
        action: 'APPROVE',
        notes: 'Disetujui di tingkat takmir masjid. Diteruskan ke PCM.',
        action_date: '2026-04-07T09:30:00Z'
      }
    ]
  },
  {
    id: 'spj-02',
    organization_id: '33333333-3333-3333-3333-333333333333',
    created_by: 'u-3',
    nomor_spj: 'SPJ/SMA-MUHI/2026/04/005',
    judul_pengajuan: 'Penyelenggaraan Pesantren Kilat & Milad Sekolah',
    deskripsi: 'Kegiatan bimbingan ibadah intensif siswa kelas X dan XI.',
    total_nominal: 42300000,
    periode_audit: '2026',
    current_level: 3,
    max_levels: 4,
    status: 'APPROVED',
    submitted_at: '2026-04-02T10:00:00Z',
    approved_at: '2026-04-08T16:00:00Z',
    organization: MOCK_ORGANIZATIONS[6],
    attachments: []
  }
];
