// Mock Data for Portfolio Demo
// This file contains all dummy data to replace backend API calls

// ==================== USER DATA ====================
export const MOCK_USERS = [
  {
    userid: "demo",
    password: "demo123",
    userName: "Demo User",
    userDomain: "BCASYARIAH",
    branch: {
      id: "001",
      name: "Kantor Pusat Jakarta"
    },
    role: "estr_opr_kep",
    level: "operator",
    departmen: "Kepatuhan",
    userSession: "demo-session-123"
  },
  {
    userid: "admin",
    password: "admin123",
    userName: "Admin User",
    userDomain: "BCASYARIAH",
    branch: {
      id: "001",
      name: "Kantor Pusat Jakarta"
    },
    role: "estr_spv_kep",
    level: "supervisor",
    departmen: "Kepatuhan",
    userSession: "admin-session-456"
  }
];

// ==================== USER MENU ====================
export const MOCK_USER_MENU = [
  {
    name: "Home",
    path: "/home",
    Profile: "estr_opr_kep"
  },
  {
    name: "Manual Cabang",
    path: "#",
    Profile: "estr_opr_kep",
    subItems: [
      { name: "To Do List", path: "/manual-cabang/to-do-list" },
      { name: "Tracking", path: "/manual-cabang/tracking" },
      { name: "Input Manual", path: "/manual-cabang/input-manual" },
      { name: "Otorisasi", path: "/manual-cabang/otorisasi" }
    ]
  },
  {
    name: "Manual Kep",
    path: "#",
    Profile: "estr_opr_kep",
    subItems: [
      { name: "Operator Kepatuhan", path: "/manual-kep/operator" },
      { name: "Supervisor Kepatuhan", path: "/manual-kep/supervisor" }
    ]
  },
  {
    name: "BI-Fast Transaction",
    path: "#",
    Profile: "estr_opr_kep",
    subItems: [
      { name: "To Do List", path: "/bi-fast/to-do-list" },
      { name: "Status", path: "/bi-fast/status" },
      { name: "Laporan Aktivitas", path: "/bi-fast/laporan-aktivitas" }
    ]
  },
  {
    name: "List Reject",
    path: "#",
    Profile: "estr_opr_kep",
    subItems: [
      { name: "Aktif", path: "/list-reject/aktif" },
      { name: "Operator", path: "/list-reject/operator" },
      { name: "Supervisor", path: "/list-reject/supervisor" }
    ]
  },
  {
    name: "Setting",
    path: "#",
    Profile: "estr_spv_kep",
    subItems: [
      { name: "Setting Parameter", path: "/setting/setting-parameter" },
      { name: "Setting Kode Transaksi", path: "/setting/setting-kode-transaksi" },
      { name: "Setting Prioritas", path: "/setting/setting-prioritas" },
      { name: "Setting Aktivasi", path: "/setting/setting-aktivasi" }
    ]
  },
  {
    name: "Setting Parameter",
    path: "#",
    Profile: "estr_spv_kep",
    subItems: [
      { name: "Otorisasi", path: "/setting-parameter/otorisasi" },
      { name: "Otorisasi Aktivasi", path: "/setting-parameter/otorisasi-aktivasi" },
      { name: "Otorisasi Prioritas", path: "/setting-parameter/otorisasi-prioritas" }
    ]
  },
  {
    name: "Laporan",
    path: "/laporan",
    Profile: "estr_opr_kep"
  },
  {
    name: "Manual Job (UAT Only)",
    path: "/trigger-job",
    Profile: "estr_spv_kep"
  }
];

// ==================== CABANG DATA ====================
export const MOCK_CABANG = [
  { kode_cabang: "001", nama_cabang: "Kantor Pusat Jakarta", singkatan_cabang: "KPJ", induk_cabang: "001" },
  { kode_cabang: "002", nama_cabang: "Cabang Bandung", singkatan_cabang: "BDG", induk_cabang: "001" },
  { kode_cabang: "003", nama_cabang: "Cabang Surabaya", singkatan_cabang: "SBY", induk_cabang: "001" },
  { kode_cabang: "004", nama_cabang: "Cabang Medan", singkatan_cabang: "MDN", induk_cabang: "001" },
  { kode_cabang: "005", nama_cabang: "Cabang Semarang", singkatan_cabang: "SMG", induk_cabang: "001" },
  { kode_cabang: "006", nama_cabang: "Cabang Yogyakarta", singkatan_cabang: "YGY", induk_cabang: "001" },
  { kode_cabang: "007", nama_cabang: "Cabang Makassar", singkatan_cabang: "MKS", induk_cabang: "001" },
  { kode_cabang: "008", nama_cabang: "Cabang Palembang", singkatan_cabang: "PLG", induk_cabang: "001" },
  { kode_cabang: "009", nama_cabang: "Cabang Denpasar", singkatan_cabang: "DPS", induk_cabang: "001" },
  { kode_cabang: "010", nama_cabang: "Cabang Balikpapan", singkatan_cabang: "BPN", induk_cabang: "001" }
];

// ==================== INDIKATOR DATA ====================
export const MOCK_INDIKATOR = [
  { kode_indikator: "PASSBY", deskripsi: "Transaksi Pass By" },
  { kode_indikator: "ET", deskripsi: "Electronic Transfer" },
  { kode_indikator: "BOP", deskripsi: "Break of Pattern" },
  { kode_indikator: "CASH", deskripsi: "Cash Transaction" },
  { kode_indikator: "STRUCT", deskripsi: "Structuring" },
  { kode_indikator: "UNUSUAL", deskripsi: "Unusual Transaction" }
];

// ==================== DASHBOARD DATA ====================
export const MOCK_DASHBOARD_DATA = {
  cabang: {
    belum_dikerjakan_cabang: 45,
    belum_diotorisasi_spv: 23,
    sudah_diotorisasi_spv: 156,
    redflag_reject_cabang: 12,
    total_cabang: 236
  },
  kepatuhan: {
    belum_dikerjakan_kep: 18,
    belum_diotorisasi_kep: 34,
    sudah_diotorisasi_kep: 189,
    redflag_reject_kep: 8,
    total_kep: 249
  },
  total: {
    total_transaksi_mencurigakan_cabang: 236,
    total_transaksi_mencurigakan_kep: 249,
    total_transaksi_mencurigakan: 485
  }
};

// ==================== MANUAL CABANG TODO ====================
export const MOCK_MANUAL_CABANG_TODO = [
  {
    NO: "1",
    ID_LAPORAN: "LAP005",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "Pending Review",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "",
    JAM_HUB_NASABAH: "",
    STATUS: "1",
    DESKRIPSI_STATUS: "Pending Review",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: null,
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  },
  {
    NO: "2",
    ID_LAPORAN: "LAP006",
    INDIKATOR: "ET",
    NO_CIF: "2345678901",
    NO_REK: "0234567890",
    NAMA_NASABAH: "Jane Smith",
    KETERANGAN: "Transfer elektronik dengan nominal besar",
    KETERANGAN_STATUS: "Pending Review",
    CABANG: "002",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "",
    JAM_HUB_NASABAH: "",
    STATUS: "1",
    DESKRIPSI_STATUS: "Pending Review",
    TANGGAL_LAPORAN: "2025-01-11",
    TANGGAL_INPUT: "2025-01-11",
    TANGGAL_OTOR_CSO: null,
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-16",
    SKALA: "MEDIUM",
    KETERLAMBATAN: "0"
  },
  {
    NO: "3",
    ID_LAPORAN: "LAP007",
    INDIKATOR: "BOP",
    NO_CIF: "3456789012",
    NO_REK: "0345678901",
    NAMA_NASABAH: "Robert Johnson",
    KETERANGAN: "Pola transaksi berbeda dari biasanya",
    KETERANGAN_STATUS: "Pending Review",
    CABANG: "003",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "",
    JAM_HUB_NASABAH: "",
    STATUS: "1",
    DESKRIPSI_STATUS: "Pending Review",
    TANGGAL_LAPORAN: "2025-01-12",
    TANGGAL_INPUT: "2025-01-12",
    TANGGAL_OTOR_CSO: null,
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-17",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  }
];

// ==================== MANUAL CABANG TRACKING ====================
export const MOCK_MANUAL_CABANG_TRACKING = [
  {
    NO: 1,
    ID_LAPORAN: "LAP001",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "In Progress",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Sudah dikonfirmasi dengan nasabah",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "2025-01-10",
    JAM_HUB_NASABAH: "10:30",
    STATUS: "3",
    STATUS_TEXT: "In Progress",
    DESKRIPSI_STATUS: "In Progress",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: "2025-01-10",
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  },
  {
    NO: 2,
    ID_LAPORAN: "LAP002",
    INDIKATOR: "ET",
    NO_CIF: "2345678901",
    NO_REK: "0234567890",
    NAMA_NASABAH: "Jane Smith",
    KETERANGAN: "Transfer elektronik dengan nominal besar",
    KETERANGAN_STATUS: "Completed",
    CABANG: "002",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Transaksi valid",
    KET_CABANG_SPV: "Approved",
    KET_KEPATUHAN: "Valid",
    TGL_HUB_NASABAH: "2025-01-11",
    JAM_HUB_NASABAH: "14:15",
    STATUS: "9",
    STATUS_TEXT: "Completed",
    DESKRIPSI_STATUS: "Completed",
    TANGGAL_LAPORAN: "2025-01-11",
    TANGGAL_INPUT: "2025-01-11",
    TANGGAL_OTOR_CSO: "2025-01-11",
    TANGGAL_OTOR_OPR_KEP: "2025-01-11",
    TANGGAL_OTOR_SPV_KEP: "2025-01-11",
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: "admin",
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-16",
    SKALA: "MEDIUM",
    KETERLAMBATAN: "0"
  }
];

// ==================== MANUAL CABANG OTORISASI ====================
export const MOCK_MANUAL_CABANG_OTORISASI = [
  {
    NO: "1",
    ID_LAPORAN: "LAP001",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "Waiting for Approval",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Sudah dikonfirmasi dengan nasabah",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "2025-01-10",
    JAM_HUB_NASABAH: "10:30",
    STATUS: "4",
    DESKRIPSI_STATUS: "Waiting for SPV Approval",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: "2025-01-10",
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  }
];

// ==================== BI-FAST TODO ====================
export const MOCK_BIFAST_TODO = [
  {
    id: 1,
    end_to_end_id: "BIFAST20250101001",
    reference_number: "REF001",
    sender_name: "Ahmad Wijaya",
    sender_account_number: "1234567890",
    sender_bank_code: "014",
    receiver_name: "Budi Santoso",
    receiver_account_number: "0987654321",
    receiver_bank_code: "008",
    amount: 50000000,
    type_trx: "CREDIT",
    status: "PENDING",
    additional_info_rc: "00",
    ket: "Transfer dana investasi",
    no_cif: "1234567890",
    cabang: "001",
    created_at: "2025-01-10T10:30:00",
    jam_hubungi: "",
    tanggal_hubungi: "",
    penjelasan_cso: "",
    penjelasan_spv: "",
    penjelasan_opr_kepatuhan: "",
    penjelasan_spv_kepatuhan: ""
  },
  {
    id: 2,
    end_to_end_id: "BIFAST20250101002",
    reference_number: "REF002",
    sender_name: "Siti Nurhaliza",
    sender_account_number: "2345678901",
    sender_bank_code: "014",
    receiver_name: "Dewi Lestari",
    receiver_account_number: "1987654321",
    receiver_bank_code: "002",
    amount: 75000000,
    type_trx: "DEBIT",
    status: "PENDING",
    additional_info_rc: "00",
    ket: "Pembayaran properti",
    no_cif: "2345678901",
    cabang: "002",
    created_at: "2025-01-11T14:15:00",
    jam_hubungi: "",
    tanggal_hubungi: "",
    penjelasan_cso: "",
    penjelasan_spv: "",
    penjelasan_opr_kepatuhan: "",
    penjelasan_spv_kepatuhan: ""
  }
];

// ==================== BI-FAST STATUS ====================
export const MOCK_BIFAST_STATUS = [
  {
    id: 1,
    end_to_end_id: "BIFAST20250101001",
    reference_number: "REF001",
    sender_name: "Ahmad Wijaya",
    sender_account_number: "1234567890",
    sender_bank_code: "014",
    receiver_name: "Budi Santoso",
    receiver_account_number: "0987654321",
    receiver_bank_code: "008",
    amount: 50000000,
    type_trx: "CREDIT",
    status: "APPROVED",
    additional_info_rc: "00",
    ket: "Transfer dana investasi",
    no_cif: "1234567890",
    cabang: "001",
    created_at: "2025-01-10T10:30:00",
    jam_hubungi: "10:30",
    tanggal_hubungi: "2025-01-10",
    penjelasan_cso: "Sudah dikonfirmasi dengan nasabah",
    penjelasan_spv: "Approved",
    penjelasan_opr_kepatuhan: "Transaksi valid",
    penjelasan_spv_kepatuhan: "Approved",
    otor_spv_cabang: "admin",
    otor_spv_kepatuhan: "admin",
    proses_on: "2025-01-10",
    review_opr_kepatuhan: "Valid"
  }
];

// ==================== LIST REJECT ====================
export const MOCK_LIST_REJECT_AKTIF = [
  {
    NO: "1",
    ID_LAPORAN: "LAP003",
    INDIKATOR: "BOP",
    NO_CIF: "3456789012",
    NO_REK: "0345678901",
    NAMA_NASABAH: "Robert Johnson",
    KETERANGAN: "Pola transaksi berbeda dari biasanya",
    KETERANGAN_STATUS: "Rejected",
    CABANG: "003",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Tidak sesuai profil",
    KET_CABANG_SPV: "Rejected",
    KET_KEPATUHAN: "Rejected",
    TGL_HUB_NASABAH: "2025-01-12",
    JAM_HUB_NASABAH: "09:00",
    STATUS: "10",
    DESKRIPSI_STATUS: "Rejected",
    TANGGAL_LAPORAN: "2025-01-12",
    TANGGAL_INPUT: "2025-01-12",
    TANGGAL_OTOR_CSO: "2025-01-12",
    TANGGAL_OTOR_OPR_KEP: "2025-01-12",
    TANGGAL_OTOR_SPV_KEP: "2025-01-12",
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: "admin",
    REJECT_BY: "admin",
    TANGGAL_REJECT: "2025-01-12",
    ALASAN_REJECT: "Tidak sesuai dengan profil nasabah",
    STATUS_REJECT: "AKTIF",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-17",
    SKALA: "HIGH"
  },
  {
    NO: "2",
    ID_LAPORAN: "LAP004",
    INDIKATOR: "PASSBY",
    NO_CIF: "9876543210",
    NO_REK: "0987654321",
    NAMA_NASABAH: "Michael Brown",
    KETERANGAN: "Transaksi ditolak karena tidak sesuai profil",
    KETERANGAN_STATUS: "Rejected",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Tidak sesuai profil",
    KET_CABANG_SPV: "Rejected",
    KET_KEPATUHAN: "Rejected",
    TGL_HUB_NASABAH: "2025-01-12",
    JAM_HUB_NASABAH: "10:00",
    STATUS: "10",
    DESKRIPSI_STATUS: "Rejected",
    TANGGAL_LAPORAN: "2025-01-12",
    TANGGAL_INPUT: "2025-01-12",
    TANGGAL_OTOR_CSO: "2025-01-12",
    TANGGAL_OTOR_OPR_KEP: "2025-01-13",
    TANGGAL_OTOR_SPV_KEP: "2025-01-13",
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: "admin",
    REJECT_BY: "admin",
    TANGGAL_REJECT: "2025-01-13",
    ALASAN_REJECT: "Tidak sesuai dengan profil nasabah",
    STATUS_REJECT: "AKTIF",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-17",
    SKALA: "MEDIUM"
  }
];

// ==================== LAPORAN DATA ====================
export const MOCK_LAPORAN_DATA = [
  {
    NO: "1",
    ID_LAPORAN: "LAP001",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "Approved",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Sudah dikonfirmasi dengan nasabah",
    KET_CABANG_SPV: "Approved",
    KET_KEPATUHAN: "Valid",
    TGL_HUB_NASABAH: "2025-01-10",
    JAM_HUB_NASABAH: "10:30",
    STATUS: "9",
    DESKRIPSI_STATUS: "Approved by Kepatuhan",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: "2025-01-10",
    TANGGAL_OTOR_OPR_KEP: "2025-01-11",
    TANGGAL_OTOR_SPV_KEP: "2025-01-11",
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: "admin",
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  },
  {
    NO: "2",
    ID_LAPORAN: "LAP002",
    INDIKATOR: "ET",
    NO_CIF: "2345678901",
    NO_REK: "0234567890",
    NAMA_NASABAH: "Jane Smith",
    KETERANGAN: "Transfer elektronik dengan nominal besar",
    KETERANGAN_STATUS: "In Progress",
    CABANG: "002",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Dalam proses review",
    KET_CABANG_SPV: "",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "2025-01-11",
    JAM_HUB_NASABAH: "14:15",
    STATUS: "5",
    DESKRIPSI_STATUS: "Waiting for Approval",
    TANGGAL_LAPORAN: "2025-01-11",
    TANGGAL_INPUT: "2025-01-11",
    TANGGAL_OTOR_CSO: "2025-01-11",
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: null,
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-16",
    SKALA: "MEDIUM",
    KETERLAMBATAN: "0"
  },
  {
    NO: "3",
    ID_LAPORAN: "LAP003",
    INDIKATOR: "BOP",
    NO_CIF: "3456789012",
    NO_REK: "0345678901",
    NAMA_NASABAH: "Robert Johnson",
    KETERANGAN: "Pola transaksi berbeda dari biasanya",
    KETERANGAN_STATUS: "Rejected",
    CABANG: "003",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Tidak sesuai profil",
    KET_CABANG_SPV: "Rejected",
    KET_KEPATUHAN: "Rejected",
    TGL_HUB_NASABAH: "2025-01-12",
    JAM_HUB_NASABAH: "09:00",
    STATUS: "10",
    DESKRIPSI_STATUS: "Rejected",
    TANGGAL_LAPORAN: "2025-01-12",
    TANGGAL_INPUT: "2025-01-12",
    TANGGAL_OTOR_CSO: "2025-01-12",
    TANGGAL_OTOR_OPR_KEP: "2025-01-12",
    TANGGAL_OTOR_SPV_KEP: "2025-01-12",
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: "admin",
    REJECT_BY: "admin",
    TANGGAL_REJECT: "2025-01-12",
    ALASAN_REJECT: "Tidak sesuai dengan profil nasabah",
    STATUS_REJECT: "AKTIF",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-17",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  }
];

export const MOCK_LAPORAN_KETERLAMBATAN = [
  {
    tanggal_laporan: "2025-01-10",
    keterlambatan: 2,
    daftar_cabang: "001, 002"
  },
  {
    tanggal_laporan: "2025-01-11",
    keterlambatan: 1,
    daftar_cabang: "003"
  },
  {
    tanggal_laporan: "2025-01-12",
    keterlambatan: 0,
    daftar_cabang: ""
  }
];

// ==================== PARAMETER REDFLAG ====================
export const MOCK_PARAMETER_REDFLAG = [
  {
    NO: "1",
    KODE_INDIKATOR: "PASSBY",
    DESKRIPSI: "Transaksi Pass By",
    PRIORITAS: "HIGH",
    STATUS: "AKTIF",
    CREATED_BY: "admin",
    CREATED_AT: "2024-01-01"
  },
  {
    NO: "2",
    KODE_INDIKATOR: "ET",
    DESKRIPSI: "Electronic Transfer",
    PRIORITAS: "MEDIUM",
    STATUS: "AKTIF",
    CREATED_BY: "admin",
    CREATED_AT: "2024-01-01"
  },
  {
    NO: "3",
    KODE_INDIKATOR: "BOP",
    DESKRIPSI: "Break of Pattern",
    PRIORITAS: "HIGH",
    STATUS: "AKTIF",
    CREATED_BY: "admin",
    CREATED_AT: "2024-01-01"
  }
];

// ==================== MANUAL KEP DATA ====================
export const MOCK_MANUAL_KEP_OPR = [
  {
    NO: "1",
    ID_LAPORAN: "LAP001",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "Waiting for Kepatuhan Review",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Sudah dikonfirmasi dengan nasabah",
    KET_CABANG_SPV: "Approved",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "2025-01-10",
    JAM_HUB_NASABAH: "10:30",
    STATUS: "5",
    DESKRIPSI_STATUS: "Waiting for Kepatuhan Review",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: "2025-01-10",
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  },
  {
    NO: "2",
    ID_LAPORAN: "LAP002",
    INDIKATOR: "ET",
    NO_CIF: "2345678901",
    NO_REK: "0234567890",
    NAMA_NASABAH: "Jane Smith",
    KETERANGAN: "Transfer elektronik dengan nominal besar",
    KETERANGAN_STATUS: "Waiting for Kepatuhan Review",
    CABANG: "002",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Dalam proses review",
    KET_CABANG_SPV: "Approved",
    KET_KEPATUHAN: "",
    TGL_HUB_NASABAH: "2025-01-11",
    JAM_HUB_NASABAH: "14:15",
    STATUS: "5",
    DESKRIPSI_STATUS: "Waiting for Kepatuhan Review",
    TANGGAL_LAPORAN: "2025-01-11",
    TANGGAL_INPUT: "2025-01-11",
    TANGGAL_OTOR_CSO: "2025-01-11",
    TANGGAL_OTOR_OPR_KEP: null,
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: null,
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "TIDAK",
    TENGGAT: "2025-01-16",
    SKALA: "MEDIUM",
    KETERLAMBATAN: "0"
  }
];

export const MOCK_MANUAL_KEP_SPV = [
  {
    NO: "1",
    ID_LAPORAN: "LAP001",
    INDIKATOR: "PASSBY",
    NO_CIF: "1234567890",
    NO_REK: "0123456789",
    NAMA_NASABAH: "John Doe",
    KETERANGAN: "Transaksi mencurigakan dengan pola tidak biasa",
    KETERANGAN_STATUS: "Waiting for SPV Kepatuhan Approval",
    CABANG: "001",
    CABANG_INDUK: "001",
    KET_CABANG_OPR: "Sudah dikonfirmasi dengan nasabah",
    KET_CABANG_SPV: "Approved",
    KET_KEPATUHAN: "Transaksi valid",
    TGL_HUB_NASABAH: "2025-01-10",
    JAM_HUB_NASABAH: "10:30",
    STATUS: "7",
    DESKRIPSI_STATUS: "Waiting for SPV Kepatuhan Approval",
    TANGGAL_LAPORAN: "2025-01-10",
    TANGGAL_INPUT: "2025-01-10",
    TANGGAL_OTOR_CSO: "2025-01-10",
    TANGGAL_OTOR_OPR_KEP: "2025-01-10",
    TANGGAL_OTOR_SPV_KEP: null,
    INPUT_BY_CBG: "demo",
    OTOR_BY_CBG: "admin",
    OTOR_BY_KEP_OPR: "demo",
    OTOR_BY_KEP_SPV: null,
    REJECT_BY: "",
    TANGGAL_REJECT: "",
    ALASAN_REJECT: "",
    STATUS_REJECT: "",
    TRANSAKSI_MENCURIGAKAN: "YA",
    TENGGAT: "2025-01-15",
    SKALA: "HIGH",
    KETERLAMBATAN: "0"
  }
];

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// ==================== PARAMETER SETTINGS ====================
export const MOCK_PARAMETER_KODE_TRANSAKSI = [
  {
    NO: "1",
    REDFLAG: "PASSBY",
    JENIS_REDFLAG: "PASSBY",
    KODE_TRAN_MASUK: "101,102,103",
    KODE_TRAN_KELUAR: "201,202,203",
    KODE_TRAN_EXCLUE: "",
    KODE_TRAN_SETUN: "301",
    KODE_TRAN_NONSETUN: "302",
    KODE_TRAN_TARTUN: "401",
    KODE_TRAN_NONTARTUN: "402",
    KODETRAN_MASUK: "101,102,103",
    KODETRAN_KELUAR: "201,202,203",
    KODETRAN_SETUN: "301",
    KODETRAN_NONSETUN: "302",
    KODETRAN_TARTUN: "401",
    KODETRAN_NONTARTUN: "402",
    TGL_UPDATE: "2025-01-10",
    STATUS: "ACTIVE"
  },
  {
    NO: "2",
    REDFLAG: "ET",
    JENIS_REDFLAG: "ET",
    KODE_TRAN_MASUK: "104,105",
    KODE_TRAN_KELUAR: "204,205",
    KODE_TRAN_EXCLUE: "",
    KODE_TRAN_SETUN: "303",
    KODE_TRAN_NONSETUN: "304",
    KODE_TRAN_TARTUN: "403",
    KODE_TRAN_NONTARTUN: "404",
    KODETRAN_MASUK: "104,105",
    KODETRAN_KELUAR: "204,205",
    KODETRAN_SETUN: "303",
    KODETRAN_NONSETUN: "304",
    KODETRAN_TARTUN: "403",
    KODETRAN_NONTARTUN: "404",
    TGL_UPDATE: "2025-01-10",
    STATUS: "ACTIVE"
  }
];

export const MOCK_PARAMETER_TRANSAKSI_UMUM = [
  { KODE_TRANSAKSI: "101", DESKRIPSI: "Transfer Masuk", KETERANGAN: "Transfer Masuk" },
  { KODE_TRANSAKSI: "102", DESKRIPSI: "Setoran Tunai", KETERANGAN: "Setoran Tunai" },
  { KODE_TRANSAKSI: "103", DESKRIPSI: "Kliring Masuk", KETERANGAN: "Kliring Masuk" },
  { KODE_TRANSAKSI: "201", DESKRIPSI: "Transfer Keluar", KETERANGAN: "Transfer Keluar" },
  { KODE_TRANSAKSI: "202", DESKRIPSI: "Tarikan Tunai", KETERANGAN: "Tarikan Tunai" },
  { KODE_TRANSAKSI: "203", DESKRIPSI: "Kliring Keluar", KETERANGAN: "Kliring Keluar" }
];

export const MOCK_PARAMETER_PRIORITAS = {
  freq_redflag_perbulan: {
    high: "10",
    medium: "5",
    low: "2"
  },
  freq_redflag_sama_perbulan: {
    high: "5",
    medium: "3",
    low: "1"
  },
  redflag_list: {
    high: "PASSBY,BOP,STRUCT",
    medium: "ET,CASH",
    low: "UNUSUAL"
  }
};

export const MOCK_PARAMETER_AKTIVASI = {
  PASSBY: "1",
  PEP: "1",
  ET: "1",
  NRT: "1",
  DORMAN: "1",
  MTM: "1",
  BOP: "1",
  RBU: "1",
  RBU2: "1",
  RDS: "1",
  TUN: "1",
  DOR: "1",
  EXCEED_INCOME: "1",
  TARIK_SETOR: "1",
  JUDOL: "1",
  DB_SUSPECT: "1",
  DB_TERORIS: "1",
  TRF_SUSPECT: "1"
};

export const MOCK_PARAMETER_WATCHLIST = [
  {
    NO: "1",
    ID: 1,
    NO_CIF: "1234567890",
    NAMA_NASABAH: "John Doe",
    Nama: "John Doe",
    KATEGORI: "HIGH_RISK",
    KETERANGAN: "Nasabah dengan transaksi mencurigakan berulang",
    CREATED_BY: "admin",
    CREATED_AT: "2025-01-01",
    aktif: 1
  },
  {
    NO: "2",
    ID: 2,
    NO_CIF: "9876543210",
    NAMA_NASABAH: "Michael Brown",
    Nama: "Michael Brown",
    KATEGORI: "MEDIUM_RISK",
    KETERANGAN: "Pola transaksi tidak wajar",
    CREATED_BY: "admin",
    CREATED_AT: "2025-01-05",
    aktif: 1
  }
];
