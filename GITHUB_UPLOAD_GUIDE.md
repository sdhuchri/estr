# Panduan Upload ke GitHub

## Persiapan

File-file berikut sudah disiapkan:
- ✅ `.gitignore` - Mengabaikan file yang tidak perlu (node_modules, .env, dll)
- ✅ `.gitattributes` - Mengatur line endings untuk konsistensi
- ✅ `README.md` - Dokumentasi lengkap dalam Bahasa Indonesia
- ✅ `LICENSE` - MIT License

## Langkah-langkah Upload

### 1. Buat Repository Baru di GitHub

1. Buka https://github.com
2. Klik tombol **"New"** atau **"+"** di pojok kanan atas
3. Pilih **"New repository"**
4. Isi detail repository:
   - **Repository name**: `estr-demo` (atau nama lain yang Anda inginkan)
   - **Description**: `E-STR Demo - Sistem Transaksi Mencurigakan (Next.js 16 + Golang + Gin)`
   - **Visibility**: Pilih **Public** (untuk portfolio)
   - **JANGAN** centang "Initialize this repository with a README" (karena sudah ada)
5. Klik **"Create repository"**

### 2. Upload dari Local ke GitHub

Jalankan perintah berikut di terminal (di folder project):

```bash
# Stage semua perubahan
git add .

# Commit perubahan
git commit -m "Initial commit: E-STR Demo with mock data"

# Tambahkan remote repository (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git push -u origin master
```

**Atau jika branch utama adalah `main`:**

```bash
git branch -M main
git push -u origin main
```

### 3. Verifikasi Upload

1. Refresh halaman repository di GitHub
2. Pastikan semua file sudah terupload
3. Cek README.md tampil dengan baik di halaman utama

## File yang TIDAK akan diupload (sudah di .gitignore)

- `node_modules/` - Dependencies (akan diinstall dengan `npm install`)
- `.next/` - Build output Next.js
- `.env*` - Environment variables
- `*.log` - Log files
- `.vscode/`, `.idea/` - IDE settings
- `*.7z`, `*.zip` - Archive files
- `tsconfig.tsbuildinfo` - TypeScript build info

## Tips

### Jika Repository Sudah Ada

Jika Anda sudah punya repository dan ingin update:

```bash
git add .
git commit -m "Update: Convert to mock data demo"
git push
```

### Jika Ada Konflik

Jika ada konflik saat push:

```bash
git pull origin master --rebase
# Resolve conflicts jika ada
git push
```

### Membuat Branch Baru

Untuk development:

```bash
git checkout -b development
git push -u origin development
```

## Setelah Upload

1. **Tambahkan Topics** di GitHub:
   - `nextjs`
   - `react`
   - `typescript`
   - `tailwindcss`
   - `golang`
   - `gin-framework`
   - `portfolio`
   - `demo`

2. **Update Repository Settings**:
   - Tambahkan website URL jika sudah deploy
   - Aktifkan GitHub Pages jika perlu

3. **Deploy** (opsional):
   - Vercel: https://vercel.com (recommended untuk Next.js)
   - Netlify: https://netlify.com
   - GitHub Pages: Untuk static export

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Atau langsung dari GitHub:
1. Buka https://vercel.com
2. Import repository dari GitHub
3. Vercel akan otomatis detect Next.js dan deploy

---

**Selamat! Project Anda siap dipublish ke GitHub! 🎉**
