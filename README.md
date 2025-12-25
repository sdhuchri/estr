# E-STR Demo - Sistem Transaksi Mencurigakan

[E-STR]

E-STR (Electronic Suspicious Transaction Report) adalah aplikasi demo untuk sistem pelaporan dan monitoring transaksi mencurigakan. Aplikasi ini dibangun menggunakan **Next.js 16, React 19, TypeScript, dan Tailwind CSS V4**.

> **Catatan**: Ini adalah versi demo portfolio yang menggunakan data dummy. Tidak ada koneksi ke backend atau database real.

## 📋 Tentang Aplikasi

E-STR Demo adalah sistem monitoring dan pelaporan transaksi mencurigakan yang mencakup:

- **Dashboard Home**: Statistik dan ringkasan transaksi mencurigakan
- **Manual Cabang**: Pengelolaan laporan dari cabang (To Do List, Tracking, Input Manual, Otorisasi)
- **Manual Kepatuhan**: Pengelolaan oleh tim kepatuhan (Operator & Supervisor)
- **BI-Fast Transaction**: Monitoring transaksi BI-Fast (To Do List, Status, Laporan Aktivitas)
- **List Reject**: Daftar transaksi yang ditolak (Aktif, Operator, Supervisor)
- **Setting**: Pengaturan parameter sistem
- **Setting Parameter**: Konfigurasi otorisasi dan prioritas
- **Laporan**: Laporan transaksi dan keterlambatan
- **Manual Job**: Trigger job manual (UAT Only)

## 🚀 Teknologi

### Frontend
Aplikasi ini dibangun dengan:

- **Next.js 16.x** - React framework dengan App Router
- **React 19.2** - Library UI terbaru
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS V4** - Utility-first CSS framework
- **ApexCharts 4.3** - Visualisasi data dan grafik
- **PrimeReact 10.9** - UI component library
- **Flatpickr** - Date picker
- **jsPDF & jsPDF-AutoTable** - PDF generation
- **Mock Data** - Semua data menggunakan dummy data (untuk versi demo)

### Backend (Implementasi Asli)
Backend aplikasi ini telah diimplementasikan menggunakan:

- **Golang** - Bahasa pemrograman backend yang cepat dan efisien
- **Gin Framework** - Web framework Golang yang ringan dan performa tinggi
- **RESTful API** - Arsitektur API yang terstruktur
- **JWT Authentication** - Sistem autentikasi berbasis token
- **SQL Server Database** - Database untuk menyimpan data transaksi
- **WebSocket** - Real-time communication untuk monitoring job progress
- **CORS Middleware** - Handling cross-origin requests
- **Structured Logging** - Logging terstruktur untuk monitoring dan debugging

> **Catatan**: Versi demo ini menggunakan mock data di frontend. Backend Golang dengan Gin framework sudah diimplementasikan dan berjalan di production environment, namun tidak disertakan dalam repository demo ini untuk alasan keamanan.

## 📦 Instalasi

### Prasyarat

Pastikan Anda telah menginstal:
- Node.js 18.x atau lebih baru (disarankan Node.js 20.x atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

> Gunakan flag `--legacy-peer-deps` jika mengalami error peer-dependency saat instalasi.

3. Jalankan development server:
```bash
npm run dev
# atau
yarn dev
```

4. Buka browser dan akses:
```
http://localhost:3000/estr/signin
```

> Jika port 3000 sudah digunakan, aplikasi akan berjalan di port lain (misalnya 3001). Perhatikan output di terminal.

## 🔐 Cara Login

Aplikasi ini menyediakan 2 akun demo:

### Akun Operator
```
Username: demo
Password: demo123
Role: Operator Kepatuhan
```

### Akun Supervisor
```
Username: admin
Password: admin123
Role: Supervisor Kepatuhan
```

### Langkah Login:
1. Buka halaman login di `/estr/signin`
2. Masukkan username dan password sesuai akun di atas
3. Klik tombol "Sign In"
4. Anda akan diarahkan ke dashboard home

## 📱 Fitur Utama

### 1. Dashboard Home
- Statistik transaksi mencurigakan dari cabang dan kepatuhan
- Grafik visualisasi data
- Ringkasan status transaksi

### 2. Manual Cabang
- **To Do List**: Daftar transaksi yang perlu ditindaklanjuti
- **Tracking**: Pelacakan status transaksi
- **Input Manual**: Input laporan transaksi manual
- **Otorisasi**: Otorisasi transaksi oleh supervisor

### 3. Manual Kepatuhan
- **Operator Kepatuhan**: Review transaksi oleh operator
- **Supervisor Kepatuhan**: Approval final oleh supervisor

### 4. BI-Fast Transaction
- Monitoring transaksi BI-Fast real-time
- Status transaksi
- Laporan aktivitas

### 5. List Reject
- Daftar transaksi yang ditolak
- Filter berdasarkan status (Aktif, Operator, Supervisor)

### 6. Setting & Parameter
- Konfigurasi parameter sistem
- Setting kode transaksi
- Setting prioritas
- Setting aktivasi
- Otorisasi parameter

### 7. Laporan
- Laporan transaksi mencurigakan
- Laporan keterlambatan
- Export data

## 🎨 Fitur UI/UX

- **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile
- **Sidebar Navigation**: Navigasi yang mudah dengan collapsible sidebar
- **Data Tables**: Tabel data dengan sorting, filtering, dan pagination
- **Charts & Graphs**: Visualisasi data dengan ApexCharts
- **Modal & Alerts**: Komponen interaktif untuk notifikasi
- **Form Elements**: Input, select, datepicker, dan form validation

## 📂 Struktur Data

Semua data dummy tersimpan di `src/data/mockData.ts` yang mencakup:

- User authentication data
- Dashboard statistics
- Manual Cabang (Todo, Tracking, Otorisasi)
- Manual Kepatuhan (Operator & Supervisor)
- BI-Fast transactions
- List Reject data
- Laporan & Keterlambatan
- Parameter settings
- Cabang & Indikator reference data

## 🔧 Konfigurasi

### Base Path
Aplikasi menggunakan base path `/estr` untuk semua route. Konfigurasi ada di `next.config.ts`:

```typescript
basePath: '/estr'
```

### Environment
Tidak ada environment variables yang diperlukan karena aplikasi menggunakan mock data.

## 🛠️ Development

### Build untuk Production
```bash
npm run build
# atau
yarn build
```

### Menjalankan Production Build
```bash
npm run start
# atau
yarn start
```

### Linting
```bash
npm run lint
# atau
yarn lint
```

## 🏗️ Arsitektur Sistem

### Versi Production (dengan Backend)
```
┌─────────────────────┐
│   Next.js App       │ (Frontend)
│   (Port 3000)       │
└────────┬────────────┘
         │ HTTP/REST API
         │ WebSocket
         ▼
┌─────────────────────┐
│  Golang + Gin       │ (Backend API)
│   (Port 8080)       │
└────────┬────────────┘
         │ SQL Queries
         ▼
┌─────────────────────┐
│ SQL Server Database │
└─────────────────────┘
```

### Versi Demo (Mock Data)
```
┌─────────────────┐
│   Next.js App   │ (Frontend)
│   (Port 3000)   │
│                 │
│  + Mock Data    │ (src/data/mockData.ts)
│  + API Routes   │ (Next.js API Routes)
└─────────────────┘
```

### Endpoint API Backend (Golang + Gin)
Backend yang telah diimplementasikan menyediakan endpoint berikut:

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/validate` - Validasi session token

#### Dashboard
- `GET /api/dashboard/home` - Data statistik dashboard
- `GET /api/dashboard/stats` - Statistik transaksi

#### Manual Cabang
- `GET /api/manual-cabang/todo` - Daftar todo list
- `GET /api/manual-cabang/tracking` - Tracking transaksi
- `POST /api/manual-cabang/input` - Input manual transaksi
- `PUT /api/manual-cabang/otorisasi/:id` - Otorisasi transaksi

#### Manual Kepatuhan
- `GET /api/manual-kep/operator` - Data untuk operator
- `GET /api/manual-kep/supervisor` - Data untuk supervisor
- `PUT /api/manual-kep/review/:id` - Review transaksi

#### BI-Fast Transaction
- `GET /api/bifast/todo` - Todo list BI-Fast
- `GET /api/bifast/status` - Status transaksi
- `GET /api/bifast/laporan` - Laporan aktivitas

#### List Reject
- `GET /api/list-reject/aktif` - Daftar reject aktif
- `GET /api/list-reject/operator` - Reject by operator
- `GET /api/list-reject/supervisor` - Reject by supervisor

#### Parameter Settings
- `GET /api/parameter/redflag` - Parameter redflag
- `PUT /api/parameter/redflag/:id` - Update parameter
- `GET /api/parameter/kode-transaksi` - Kode transaksi
- `GET /api/parameter/prioritas` - Setting prioritas
- `GET /api/parameter/aktivasi` - Setting aktivasi

#### Laporan
- `GET /api/laporan/transaksi` - Laporan transaksi
- `GET /api/laporan/keterlambatan` - Laporan keterlambatan
- `POST /api/laporan/export` - Export laporan

#### WebSocket
- `WS /ws/job-progress` - Real-time job progress monitoring

## 📝 Catatan Penting

- Aplikasi ini adalah **demo portfolio** dan menggunakan **data dummy**
- Backend asli menggunakan **Golang dengan Gin framework** dan **SQL Server Database**
- Versi demo ini tidak terkoneksi ke backend untuk alasan keamanan
- Semua data akan reset setiap kali refresh halaman
- Tidak ada persistensi data di versi demo
- Session login menggunakan cookies dengan durasi 8 jam

## 📄 Lisensi

Aplikasi ini dibuat untuk keperluan portfolio dan demo.

## 👨‍💻 Pengembang

Dikembangkan sebagai portfolio project menggunakan template TailAdmin Next.js.

---

**E-STR Demo Portfolio** © 2025
