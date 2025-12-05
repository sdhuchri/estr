# PDF Generator Utility

Komponen reusable untuk generate PDF dengan watermark dan format yang konsisten.

## Fitur

- ✅ Support landscape & portrait orientation
- ✅ Auto watermark dengan logo dan timestamp
- ✅ Auto pagination
- ✅ Text wrapping otomatis
- ✅ Custom columns dengan render function
- ✅ Header info (kiri & kanan)
- ✅ Signature section (opsional)

## Cara Pakai

### 1. Import

```typescript
import { generatePDF, downloadPDF, formatDateToDDMMYYYY, PDFColumn } from "@/utils/pdfGenerator";
```

### 2. Define Columns

```typescript
const pdfColumns: PDFColumn[] = [
  { header: "No", key: "NO", width: 35 },
  { header: "Nama", key: "nama", width: 120 },
  { 
    header: "Tanggal", 
    key: "tanggal", 
    width: 80,
    render: (value: string) => formatDate(value) // Custom render
  }
];
```

### 3. Generate & Download

```typescript
const handleDownloadPDF = async () => {
  try {
    const pdfBlob = await generatePDF({
      title: "Laporan Data",
      data: yourData,
      columns: pdfColumns,
      headerInfo: {
        left: [
          { label: "Periode", value: " : 01/01/2025 - 31/01/2025" }
        ],
        right: [
          { label: "User", value: " : John Doe" }
        ]
      },
      orientation: "landscape"
    });

    downloadPDF(pdfBlob, `laporan-${dateStr}.pdf`);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## Options

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| title | string | ✅ | - | Judul PDF |
| data | any[] | ✅ | - | Data yang akan ditampilkan |
| columns | PDFColumn[] | ✅ | - | Definisi kolom tabel |
| headerInfo | PDFHeaderInfo | ❌ | - | Info header (kiri & kanan) |
| signatures | PDFSignature | ❌ | - | Section tanda tangan |
| fileName | string | ❌ | - | Nama file (tidak digunakan di function) |
| orientation | "landscape" \| "portrait" | ❌ | "landscape" | Orientasi halaman |
| watermarkImagePath | string | ❌ | "/siap/images/logo/BCA_Syariah_logo.png" | Path logo watermark |
| watermarkText | string | ❌ | Auto generated | Text watermark |

## Contoh Implementasi

Lihat: `src/app/(admin)/(others-pages)/manual-cabang/tracking/ManualCabangTrackingClient.tsx`
