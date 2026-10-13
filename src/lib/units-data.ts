export interface UnitRecord {
  id: number;
  nama_unit: string;
  nama_unit_pendek?: string | null;
  pemerhati?: string | null;
  parent_unit_id?: number | null;
  tipe: 'UNIT' | 'GROUP';
}

export const ALL_UNITS: UnitRecord[] = [
  {
    "id": 200,
    "nama_unit": "Badan Pengurus Lazismu PDM Kota Yogyakarta",
    "nama_unit_pendek": "LAZISMU-PDM",
    "pemerhati": "Badan Pengurus Lazismu PDM",
    "parent_unit_id": 17,
    "tipe": "GROUP"
  },
  {
    "id": 1,
    "nama_unit": "PDM Kota Jogja",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": null,
    "tipe": "UNIT"
  },
  {
    "id": 2,
    "nama_unit": "Majelis Tarjih dan Tajdid",
    "nama_unit_pendek": "MTT",
    "pemerhati": "H. Aris madani, S.Pd.I",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 3,
    "nama_unit": "Majelis Tabligh",
    "nama_unit_pendek": "MT",
    "pemerhati": "Drs. H. Aris Thobirin, M.Si.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 4,
    "nama_unit": "Majelis Dikdasmen & PNF",
    "nama_unit_pendek": "Dikdasmen PNF",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 5,
    "nama_unit": "Majelis Pendidikan Kader dan Sumber Daya Insani",
    "nama_unit_pendek": "MPKSDI",
    "pemerhati": "Drs. Rochmat, M.Pd.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 6,
    "nama_unit": "Majelis Pembinaan Kesehatan Umum",
    "nama_unit_pendek": "MPKU",
    "pemerhati": "Edi Sukoco",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 7,
    "nama_unit": "Majelis Pembinaan Kesejahteraan Sosial",
    "nama_unit_pendek": "MPKS",
    "pemerhati": "H. Edi Sukoco, S.Kep., Ns",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 8,
    "nama_unit": "Majelis Ekonomi, Bisnis dan Pariwisata",
    "nama_unit_pendek": "MEBP",
    "pemerhati": "Heri Ananta",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 9,
    "nama_unit": "Majelis Pendayagunaan Wakaf",
    "nama_unit_pendek": "MPW",
    "pemerhati": "Agni Sutanta, S.I.P",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 10,
    "nama_unit": "Majelis Pemberdayaan Masyarakat",
    "nama_unit_pendek": "MPM",
    "pemerhati": "H. Edi Sukoco, S.Kep., Ns",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 11,
    "nama_unit": "Majelis Hukum dan Hak Asasi Manusia",
    "nama_unit_pendek": "MHH",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 12,
    "nama_unit": "Majelis Lingkungan Hidup",
    "nama_unit_pendek": "MLH",
    "pemerhati": "Sumiharto, SE., MBA",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 13,
    "nama_unit": "Lembaga Pengembangan Pesantren",
    "nama_unit_pendek": "LPP",
    "pemerhati": "Drs Aris Thobirin, M,Si",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 14,
    "nama_unit": "Lembaga Pengembangan Cabang Ranting dan Pembinaan Masjid",
    "nama_unit_pendek": "LPCRPM",
    "pemerhati": "Agni Sutanta, S.I.P.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 15,
    "nama_unit": "Lembaga Pembinaan dan Pengawasan Keuangan",
    "nama_unit_pendek": "LPPK",
    "pemerhati": "Noviar Handi Al Faani, SE., Akt.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 16,
    "nama_unit": "Lembaga Resiliensi Bencana",
    "nama_unit_pendek": "LRB/MDMC",
    "pemerhati": "Heru Suroso, S.H.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 17,
    "nama_unit": "Lembaga Amil Zakat, Infak dan Sedekah",
    "nama_unit_pendek": "LazisMu",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "GROUP"
  },
  {
    "id": 18,
    "nama_unit": "Lembaga Pengembangan Usaha Mikro Kecil Menengah",
    "nama_unit_pendek": "LP-UMKM",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 19,
    "nama_unit": "Lembaga Hikmah dan Kebijakan Publik",
    "nama_unit_pendek": "LHKP",
    "pemerhati": "Abdus Samik Sandhi",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 20,
    "nama_unit": "Lembaga Seni Budaya",
    "nama_unit_pendek": "LSB",
    "pemerhati": "Aris Saptono",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 21,
    "nama_unit": "Lembaga Pengembangan Olahraga",
    "nama_unit_pendek": "LPO",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 22,
    "nama_unit": "Lembaga Pembinaan Haji dan Umroh",
    "nama_unit_pendek": "LPHU",
    "pemerhati": "R. Sumiharto, SE., MBA.",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 23,
    "nama_unit": "Majelis Pustaka dan Informasi",
    "nama_unit_pendek": "MPI",
    "pemerhati": "",
    "parent_unit_id": 27,
    "tipe": "UNIT"
  },
  {
    "id": 24,
    "nama_unit": "Struktur Teritorial (Cabang & Ranting)",
    "nama_unit_pendek": "CABANG",
    "pemerhati": "",
    "parent_unit_id": 1,
    "tipe": "GROUP"
  },
  {
    "id": 25,
    "nama_unit": "Organisasi Otonom (Ortom)",
    "nama_unit_pendek": "ORTOM",
    "pemerhati": "",
    "parent_unit_id": 1,
    "tipe": "GROUP"
  },
  {
    "id": 26,
    "nama_unit": "Amal Usaha Muhammadiyah (AUM)",
    "nama_unit_pendek": "AUM",
    "pemerhati": "",
    "parent_unit_id":  1,
    "tipe": "GROUP"
  },
  {
    "id": 27,
    "nama_unit": "Unsur Pembantu Pimpinan (Majelis & Lembaga)",
    "nama_unit_pendek": "MJL-LMG",
    "pemerhati": "",
    "parent_unit_id": 1,
    "tipe": "GROUP"
  },
  {
    "id": 28,
    "nama_unit": "Pimpinan Cabang Muhammadiyah",
    "nama_unit_pendek": "PCM",
    "pemerhati": "",
    "parent_unit_id": 24,
    "tipe": "GROUP"
  },
  {
    "id": 29,
    "nama_unit": "Aisyiyah",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 30,
    "nama_unit": "Nasyiatul Aisyiyah",
    "nama_unit_pendek": "NA",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 31,
    "nama_unit": "Pemuda Muhammadiyah",
    "nama_unit_pendek": "PM",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 32,
    "nama_unit": "Ikatan Pelajar Muhammadiyah",
    "nama_unit_pendek": "IPM",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 33,
    "nama_unit": "Ikatan Mahasiswa Muhammadiyah",
    "nama_unit_pendek": "IMM",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 34,
    "nama_unit": "Tapak Suci Putra",
    "nama_unit_pendek": "TSP",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 35,
    "nama_unit": "Hizbul Wathan",
    "nama_unit_pendek": "HW",
    "pemerhati": "",
    "parent_unit_id": 25,
    "tipe": "GROUP"
  },
  {
    "id": 36,
    "nama_unit": "Bidang Pendidikan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 26,
    "tipe": "GROUP"
  },
  {
    "id": 37,
    "nama_unit": "Bidang Kesehatan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 26,
    "tipe": "GROUP"
  },
  {
    "id": 38,
    "nama_unit": "Bidang Sosial",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 26,
    "tipe": "GROUP"
  },
  {
    "id": 39,
    "nama_unit": "Bidang Ekonomi",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 26,
    "tipe": "GROUP"
  },
  {
    "id": 40,
    "nama_unit": "PCM Danurejan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 41,
    "nama_unit": "PCM Gedongtengen",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 42,
    "nama_unit": "PCM Gondokusuman",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 43,
    "nama_unit": "PCM Gondomanan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 44,
    "nama_unit": "PCM Jetis",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 45,
    "nama_unit": "PCM Kotagede",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 46,
    "nama_unit": "PCM Kraton",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 47,
    "nama_unit": "PCM Mantrijeron",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 48,
    "nama_unit": "PCM Mergangsan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 49,
    "nama_unit": "PCM Ngampilan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 50,
    "nama_unit": "PCM Pakualaman",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 51,
    "nama_unit": "PCM Tegalrejo",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 52,
    "nama_unit": "PCM Umbulharjo",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 53,
    "nama_unit": "PCM Wirobrajan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 28,
    "tipe": "GROUP"
  },
  {
    "id": 54,
    "nama_unit": "PRM Bumijo",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 44,
    "tipe": "UNIT"
  },
  {
    "id": 55,
    "nama_unit": "PRM Cokrodiningratan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 44,
    "tipe": "UNIT"
  },
  {
    "id": 56,
    "nama_unit": "PRM Gowongan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 44,
    "tipe": "UNIT"
  },
  {
    "id": 57,
    "nama_unit": "PRM Terban",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 42,
    "tipe": "UNIT"
  },
  {
    "id": 58,
    "nama_unit": "PRM Demangan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 42,
    "tipe": "UNIT"
  },
  {
    "id": 59,
    "nama_unit": "PRM Klitren",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 42,
    "tipe": "UNIT"
  },
  {
    "id": 60,
    "nama_unit": "PRM Kotabaru",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 42,
    "tipe": "UNIT"
  },
  {
    "id": 61,
    "nama_unit": "PRM Baciro",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 42,
    "tipe": "UNIT"
  },
  {
    "id": 62,
    "nama_unit": "PRM Bausasran",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 40,
    "tipe": "UNIT"
  },
  {
    "id": 63,
    "nama_unit": "PRM Tegal Panggung",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 40,
    "tipe": "UNIT"
  },
  {
    "id": 64,
    "nama_unit": "PRM Suryatmajan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 40,
    "tipe": "UNIT"
  },
  {
    "id": 65,
    "nama_unit": "PRM Ngampilan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 49,
    "tipe": "UNIT"
  },
  {
    "id": 66,
    "nama_unit": "PRM Notoprajan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 49,
    "tipe": "UNIT"
  },
  {
    "id": 67,
    "nama_unit": "PRM Panembahan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 46,
    "tipe": "UNIT"
  },
  {
    "id": 68,
    "nama_unit": "PRM Kadipaten",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 46,
    "tipe": "UNIT"
  },
  {
    "id": 69,
    "nama_unit": "PRM Patehan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 46,
    "tipe": "UNIT"
  },
  {
    "id": 70,
    "nama_unit": "PRM Prawirodirjan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 43,
    "tipe": "UNIT"
  },
  {
    "id": 71,
    "nama_unit": "PRM Ngupasan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 43,
    "tipe": "UNIT"
  },
  {
    "id": 72,
    "nama_unit": "PRM Purwokinanti",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 50,
    "tipe": "UNIT"
  },
  {
    "id": 73,
    "nama_unit": "PRM Gunungketur",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 50,
    "tipe": "UNIT"
  },
  {
    "id": 74,
    "nama_unit": "PRM Wirobrajan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 53,
    "tipe": "UNIT"
  },
  {
    "id": 75,
    "nama_unit": "PRM Patangpuluhan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 53,
    "tipe": "UNIT"
  },
  {
    "id": 76,
    "nama_unit": "PRM Pakuncen",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 53,
    "tipe": "UNIT"
  },
  {
    "id": 77,
    "nama_unit": "PRM Tegalrejo",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 51,
    "tipe": "UNIT"
  },
  {
    "id": 78,
    "nama_unit": "PRM Karangwaru",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 51,
    "tipe": "UNIT"
  },
  {
    "id": 79,
    "nama_unit": "PRM Kricak",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 51,
    "tipe": "UNIT"
  },
  {
    "id": 80,
    "nama_unit": "PRM Bener",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 51,
    "tipe": "UNIT"
  },
  {
    "id": 81,
    "nama_unit": "PRM Sosromenduran",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 41,
    "tipe": "UNIT"
  },
  {
    "id": 82,
    "nama_unit": "PRM Pringgokusuman",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 41,
    "tipe": "UNIT"
  },
  {
    "id": 83,
    "nama_unit": "PRM Prenggan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 45,
    "tipe": "UNIT"
  },
  {
    "id": 84,
    "nama_unit": "PRM Purbayan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 45,
    "tipe": "UNIT"
  },
  {
    "id": 85,
    "nama_unit": "PRM Rejowinangun",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 45,
    "tipe": "UNIT"
  },
  {
    "id": 86,
    "nama_unit": "PRM Pandeyan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 87,
    "nama_unit": "PRM Sorosutan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 88,
    "nama_unit": "PRM Giwangan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 89,
    "nama_unit": "PRM Warungboto",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 90,
    "nama_unit": "PRM Mujamuju",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 91,
    "nama_unit": "PRM Tahunan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 92,
    "nama_unit": "PRM Semaki",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 52,
    "tipe": "UNIT"
  },
  {
    "id": 93,
    "nama_unit": "PRM Brontokusuman",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 48,
    "tipe": "UNIT"
  },
  {
    "id": 94,
    "nama_unit": "PRM Keparakan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 48,
    "tipe": "UNIT"
  },
  {
    "id": 95,
    "nama_unit": "PRM Wirogunan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 48,
    "tipe": "UNIT"
  },
  {
    "id": 96,
    "nama_unit": "PRM Mantrijeron",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 47,
    "tipe": "UNIT"
  },
  {
    "id": 97,
    "nama_unit": "PRM Suryodiningratan",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 47,
    "tipe": "UNIT"
  },
  {
    "id": 98,
    "nama_unit": "PRM Gedongkiwo",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 47,
    "tipe": "UNIT"
  },
  {
    "id": 99,
    "nama_unit": "SD Muhammadiyah",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 36,
    "tipe": "GROUP"
  },
  {
    "id": 100,
    "nama_unit": "SMP Muhammadiyah",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 36,
    "tipe": "GROUP"
  },
  {
    "id": 101,
    "nama_unit": "Panti Asuhan Yatim (PAY)",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 38,
    "tipe": "UNIT"
  },
  {
    "id": 102,
    "nama_unit": "koperasi",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 39,
    "tipe": "GROUP"
  },
  {
    "id": 103,
    "nama_unit": "BMT",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 39,
    "tipe": "GROUP"
  },
  {
    "id": 104,
    "nama_unit": "SD MUHAMMADIYAH BAUSASRAN I",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 105,
    "nama_unit": "SD MUHAMMADIYAH BAUSASRAN II",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 106,
    "nama_unit": "SD MUHAMMADIYAH DANUNEGARAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 107,
    "nama_unit": "SD MUHAMMADIYAH DEMANGAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 108,
    "nama_unit": "SD MUHAMMADIYAH GENDENG",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 109,
    "nama_unit": "SD MUHAMMADIYAH JOGOKARIYAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 110,
    "nama_unit": "SD MUHAMMADIYAH KARANGKAJEN I",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 111,
    "nama_unit": "SD MUHAMMADIYAH KARANGKAJEN II",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 112,
    "nama_unit": "SD MUHAMMADIYAH KARANGWARU",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 113,
    "nama_unit": "SD MUHAMMADIYAH KAUMAN YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 114,
    "nama_unit": "SD MUHAMMADIYAH KLECO 1",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 115,
    "nama_unit": "SD MUHAMMADIYAH KLECO 2",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 116,
    "nama_unit": "SD MUHAMMADIYAH KLECO 3",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 117,
    "nama_unit": "SD MUHAMMADIYAH MILIRAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 118,
    "nama_unit": "SD MUHAMMADIYAH NGADIWINATAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 119,
    "nama_unit": "SD MUHAMMADIYAH NGUPASAN 1 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 120,
    "nama_unit": "SD MUHAMMADIYAH NGUPASAN II",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 121,
    "nama_unit": "SD MUHAMMADIYAH NITIKAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 122,
    "nama_unit": "SD MUHAMMADIYAH NOTOPRAJAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 123,
    "nama_unit": "SD MUHAMMADIYAH NOTOPRAJAN 2",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 124,
    "nama_unit": "SD MUHAMMADIYAH PAKEL",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 125,
    "nama_unit": "SD MUHAMMADIYAH PRINGGOKUSUMAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 126,
    "nama_unit": "SD MUHAMMADIYAH PURBAYAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 127,
    "nama_unit": "SD MUHAMMADIYAH PURWODININGRATAN 2",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 128,
    "nama_unit": "SD MUHAMMADIYAH PURWODININGRATAN I",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 129,
    "nama_unit": "SD MUHAMMADIYAH SAGAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 130,
    "nama_unit": "SD MUHAMMADIYAH SAPEN 1",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 131,
    "nama_unit": "SD MUHAMMADIYAH SAPEN II",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 132,
    "nama_unit": "SD MUHAMMADIYAH SOKONANDI 1",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 133,
    "nama_unit": "SD MUHAMMADIYAH SOKONANDI 2",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 134,
    "nama_unit": "SD MUHAMMADIYAH SURONATAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 135,
    "nama_unit": "SD MUHAMMADIYAH SURYOWIJAYAN",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 136,
    "nama_unit": "SD MUHAMMADIYAH TEGALREJO",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 137,
    "nama_unit": "SD MUHAMMADIYAH WARUNGBOTO",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 138,
    "nama_unit": "SD MUHAMMADIYAH WIROBRAJAN I",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 139,
    "nama_unit": "SD MUHAMMADIYAH WIROBRAJAN II",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 140,
    "nama_unit": "SD MUHAMMADIYAH WIROBRAJAN III",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 99,
    "tipe": "UNIT"
  },
  {
    "id": 141,
    "nama_unit": "SMP MUHAMMADIYAH 1 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 142,
    "nama_unit": "SMP MUHAMMADIYAH 2 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 143,
    "nama_unit": "SMP MUHAMMADIYAH 3 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 144,
    "nama_unit": "SMP MUHAMMADIYAH 4 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 145,
    "nama_unit": "SMP MUHAMMADIYAH 5 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 146,
    "nama_unit": "SMP MUHAMMADIYAH 6 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 147,
    "nama_unit": "SMP MUHAMMADIYAH 7 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 148,
    "nama_unit": "SMP MUHAMMADIYAH 8 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 149,
    "nama_unit": "SMP MUHAMMADIYAH 9 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 150,
    "nama_unit": "SMP MUHAMMADIYAH 10 YOGYAKARTA",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 100,
    "tipe": "UNIT"
  },
  {
    "id": 151,
    "nama_unit": "PKU Kotagede",
    "nama_unit_pendek": "",
    "pemerhati": "",
    "parent_unit_id": 37,
    "tipe": "UNIT"
  },
  {
    "id": 160,
    "nama_unit": "KL Lazismu Danurejan",
    "nama_unit_pendek": "Lazismu Danurejan",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 161,
    "nama_unit": "KL Lazismu Gedongtengen",
    "nama_unit_pendek": "Lazismu Gedongtengen",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 162,
    "nama_unit": "KL Lazismu Gondokusuman",
    "nama_unit_pendek": "Lazismu Gondokusuman",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 163,
    "nama_unit": "KL Lazismu Gondomanan",
    "nama_unit_pendek": "Lazismu Gondomanan",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 164,
    "nama_unit": "KL Lazismu Jetis",
    "nama_unit_pendek": "Lazismu Jetis",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 165,
    "nama_unit": "KL Lazismu Kotagede",
    "nama_unit_pendek": "Lazismu Kotagede",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 166,
    "nama_unit": "KL Lazismu Kraton",
    "nama_unit_pendek": "Lazismu Kraton",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 167,
    "nama_unit": "KL Lazismu Mantrijeron",
    "nama_unit_pendek": "Lazismu Mantrijeron",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 168,
    "nama_unit": "KL Lazismu Mergangsan",
    "nama_unit_pendek": "Lazismu Mergangsan",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 169,
    "nama_unit": "KL Lazismu Ngampilan",
    "nama_unit_pendek": "Lazismu Ngampilan",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 170,
    "nama_unit": "KL Lazismu Pakualaman",
    "nama_unit_pendek": "Lazismu Pakualaman",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 171,
    "nama_unit": "KL Lazismu Tegalrejo",
    "nama_unit_pendek": "Lazismu Tegalrejo",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 172,
    "nama_unit": "KL Lazismu Umbulharjo",
    "nama_unit_pendek": "Lazismu Umbulharjo",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  },
  {
    "id": 173,
    "nama_unit": "KL Lazismu Wirobrajan",
    "nama_unit_pendek": "Lazismu Wirobrajan",
    "pemerhati": "",
    "parent_unit_id":   200,
    "tipe": "UNIT"
  }
];
