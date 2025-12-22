# Panduan Deploy ke Vercel

## Opsi 1: Deploy via Website Vercel (Paling Mudah)

### Langkah-langkah:

1. **Buka Vercel**
   - Kunjungi https://vercel.com
   - Klik **"Sign Up"** atau **"Login"**
   - Login dengan akun GitHub Anda

2. **Import Project**
   - Setelah login, klik **"Add New..."** → **"Project"**
   - Pilih **"Import Git Repository"**
   - Cari repository **"estr"** dari list
   - Klik **"Import"**

3. **Configure Project**
   - **Project Name**: `estr-demo` (atau nama lain)
   - **Framework Preset**: Next.js (otomatis terdeteksi)
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: `npm run build` (otomatis)
   - **Output Directory**: `.next` (otomatis)
   - **Install Command**: `npm install` (otomatis)

4. **Environment Variables** (Opsional)
   - Tidak ada environment variables yang diperlukan untuk versi demo ini
   - Klik **"Deploy"**

5. **Tunggu Deploy Selesai**
   - Proses build biasanya 2-5 menit
   - Setelah selesai, Anda akan mendapat URL seperti:
     - `https://estr-demo.vercel.app`
     - `https://estr-demo-username.vercel.app`

6. **Akses Aplikasi**
   - Buka URL yang diberikan
   - Tambahkan `/estr/signin` di akhir URL
   - Contoh: `https://estr-demo.vercel.app/estr/signin`

---

## Opsi 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login ke Vercel

```bash
vercel login
```

### Deploy

```bash
# Deploy ke production
vercel --prod

# Atau deploy preview
vercel
```

### Ikuti Prompt:
- Set up and deploy? **Y**
- Which scope? Pilih akun Anda
- Link to existing project? **N**
- What's your project's name? **estr-demo**
- In which directory is your code located? **./** (enter)
- Want to override the settings? **N**

---

## Opsi 3: Deploy Tanpa basePath (Recommended untuk Vercel)

Jika Anda ingin aplikasi bisa diakses langsung di root URL (tanpa `/estr`):

### 1. Update `next.config.ts`

Hapus atau comment baris `basePath`:

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: false,
  // basePath: "/estr",  // Comment atau hapus baris ini
  // ... konfigurasi lainnya
};
```

### 2. Commit dan Push

```bash
git add next.config.ts
git commit -m "Remove basePath for Vercel deployment"
git push origin main
```

### 3. Deploy Ulang di Vercel

Vercel akan otomatis detect perubahan dan deploy ulang.

### 4. Akses Aplikasi

Sekarang bisa diakses langsung di:
- `https://estr-demo.vercel.app/signin` (tanpa /estr)

---

## Konfigurasi Custom Domain (Opsional)

Setelah deploy berhasil:

1. Buka project di Vercel Dashboard
2. Klik tab **"Settings"**
3. Pilih **"Domains"**
4. Klik **"Add"**
5. Masukkan domain Anda (misalnya: `estr.yourdomain.com`)
6. Ikuti instruksi untuk update DNS

---

## Troubleshooting

### Build Error: Module not found

Pastikan semua dependencies sudah terinstall:

```bash
npm install
npm run build
```

Jika berhasil lokal, push ke GitHub dan deploy ulang.

### 404 Error setelah Deploy

Jika menggunakan `basePath: "/estr"`, pastikan akses dengan:
- `https://your-app.vercel.app/estr/signin`

Bukan:
- `https://your-app.vercel.app/signin` ❌

### Aplikasi Lambat

Vercel free tier sudah cukup cepat. Jika lambat:
- Cek region deployment (pilih yang terdekat)
- Upgrade ke Vercel Pro jika perlu

---

## URL Akses Setelah Deploy

Dengan `basePath: "/estr"`:
- **Login**: `https://your-app.vercel.app/estr/signin`
- **Home**: `https://your-app.vercel.app/estr/home`

Tanpa `basePath`:
- **Login**: `https://your-app.vercel.app/signin`
- **Home**: `https://your-app.vercel.app/home`

---

## Kredensial Login

```
Username: demo
Password: demo123

atau

Username: admin
Password: admin123
```

---

## Auto Deploy

Setiap kali Anda push ke branch `main` di GitHub, Vercel akan otomatis:
1. Detect perubahan
2. Build aplikasi
3. Deploy versi terbaru

Tidak perlu deploy manual lagi! 🎉

---

## Monitoring

Setelah deploy, Anda bisa monitor:
- **Analytics**: Lihat traffic dan performance
- **Logs**: Debug jika ada error
- **Deployments**: History semua deployment

Semua tersedia di Vercel Dashboard.

---

**Selamat! Aplikasi Anda siap online! 🚀**
