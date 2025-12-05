# Folder Rename Changelog

## Manual Cabang Routes - Folder Restructuring

### Perubahan yang Dilakukan

#### 1. Manual Cabang Edit → To Do List
**Sebelum:**
```
src/app/(admin)/(others-pages)/manual-cabang/edit/
├── page.tsx
├── ManualCabangEditClient.tsx
└── loading.tsx
```

**Sesudah:**
```
src/app/(admin)/(others-pages)/manual-cabang/to-do-list/
├── page.tsx
├── ManualCabangToDoListClient.tsx
└── loading.tsx
```

**Route Changes:**
- `/manual-cabang/edit` → `/manual-cabang/to-do-list`

**Component Changes:**
- `ManualCabangEditClient` → `ManualCabangToDoListClient`
- Title: "Manual Cabang Edit" → "Manual Cabang To Do List"

---

#### 2. Manual Cabang Input → Input Manual
**Sebelum:**
```
src/app/(admin)/(others-pages)/manual-cabang/input/
├── page.tsx
├── InputClient.tsx
└── loading.tsx
```

**Sesudah:**
```
src/app/(admin)/(others-pages)/manual-cabang/input-manual/
├── page.tsx
├── InputManualClient.tsx
└── loading.tsx
```

**Route Changes:**
- `/manual-cabang/input` → `/manual-cabang/input-manual`

**Component Changes:**
- `InputClient` → `InputManualClient`
- Title: "Manual Cabang Input" → "Manual Cabang Input Manual"

---

### Struktur Folder Manual Cabang (Final)

```
src/app/(admin)/(others-pages)/manual-cabang/
├── input-manual/
│   ├── page.tsx
│   ├── InputManualClient.tsx
│   └── loading.tsx
├── to-do-list/
│   ├── page.tsx
│   ├── ManualCabangToDoListClient.tsx
│   └── loading.tsx
├── loading.tsx
└── page.tsx
```

---

### Routes yang Tersedia

1. **To Do List**: `/manual-cabang/to-do-list`
   - Kelola data laporan manual cabang
   - Edit transaksi nasabah
   - Update status transaksi mencurigakan

2. **Input Manual**: `/manual-cabang/input-manual`
   - Tambah data laporan baru
   - Input transaksi manual
   - Kelola data nasabah

---

### Update yang Diperlukan

#### 1. Update Menu/Navigation
Pastikan menu sidebar atau navigation menggunakan route yang baru:
```typescript
// Old routes (deprecated)
"/manual-cabang/edit"
"/manual-cabang/input"

// New routes (current)
"/manual-cabang/to-do-list"
"/manual-cabang/input-manual"
```

#### 2. Update Links
Cari dan ganti semua link yang mengarah ke route lama:
```typescript
// Before
<Link href="/manual-cabang/edit">Edit</Link>
<Link href="/manual-cabang/input">Input</Link>

// After
<Link href="/manual-cabang/to-do-list">To Do List</Link>
<Link href="/manual-cabang/input-manual">Input Manual</Link>
```

#### 3. Update Redirects (jika ada)
Jika ada redirect rules, update untuk mengarahkan route lama ke route baru.

---

### Testing Checklist

- [x] Folder `edit` berhasil dihapus
- [x] Folder `input` berhasil dihapus
- [x] Folder `to-do-list` berhasil dibuat dengan semua file
- [x] Folder `input-manual` berhasil dibuat dengan semua file
- [x] Tidak ada diagnostic errors pada file-file baru
- [ ] Test route `/manual-cabang/to-do-list` di browser
- [ ] Test route `/manual-cabang/input-manual` di browser
- [ ] Update menu sidebar dengan route baru
- [ ] Test navigation dari menu sidebar
- [ ] Test semua functionality pada halaman baru

---

### Notes

- Semua functionality tetap sama, hanya nama folder dan route yang berubah
- Component logic tidak berubah
- API calls tetap menggunakan service yang sama
- Styling dan UI tidak berubah

---

### Migration Date
**Date**: November 2, 2025
**Status**: ✅ Completed
