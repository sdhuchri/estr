"use client";
import FormField, { Input, CustomListbox, Textarea, TimeInput24 } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";

interface ManualCabangFormData {
  noCif: string;
  noRek: string;
  indikator: string;
  cabang: string;
  namaNasabah: string;
  tanggalTransaksi: string | Date | null;
  keterangan: string;
  tglHubungiNasabah: Date | null;
  jamHubungiNasabah: string;
  transaksiMencurigakan: string;
  penjelasanCSO: string;
  penjelasanSPV?: string;
  penjelasanKepatuhan?: string;
}

interface ManualCabangFormProps {
  formData: ManualCabangFormData;
  onChange: (field: string, value: any) => void;
  readOnlyFields?: string[];
  showInfoBox?: boolean;
  cabangOptions?: Array<{ value: string; label: string }>;
  indikatorOptions?: Array<{ value: string; label: string; deskripsi?: string }>;
}

export default function ManualCabangForm({
  formData,
  onChange,
  readOnlyFields = [],
  showInfoBox = true,
  cabangOptions = [],
  indikatorOptions = []
}: ManualCabangFormProps) {
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  const formatDate = (date: Date | null) => {
    if (!date) return "dd-mmm-yyyy";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(/\s/g, "-");
  };

  // Handle numeric input only
  const handleNumericInput = (field: string, value: string) => {
    // Only allow numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    onChange(field, numericValue);
  };

  // Handle indikator change and auto-fill keterangan
  const handleIndikatorChange = (value: string) => {
    onChange('indikator', value);
    
    // Find selected indikator and set its deskripsi to keterangan
    const selectedIndikator = indikatorOptions.find(opt => opt.value === value);
    if (selectedIndikator && selectedIndikator.deskripsi) {
      onChange('keterangan', selectedIndikator.deskripsi);
    } else {
      onChange('keterangan', '');
    }
  };

  return (
    <>
      {/* Green Info Box */}
      {showInfoBox && (
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Transaksi Tidak Mencurigakan!</h3>
          <ol className="text-m space-y-1">
            <li>1. Nasabah dengan Produk Simpanan Pelajar (Simpel)</li>
            <li>2. Transaksi Pencairan dan Penempatan Deposito</li>
            <li>3. Transaksi Pencairan dan Pembayaran Pembiayaan</li>
            <li>4. Transaksi untuk Pengeluaran Rutin Pribadi</li>
            <li>5. Transaksi untuk Warisan</li>
            <li>6. Transaksi dengan Rekening <em>Payroll</em> Karyawan BCA Syariah</li>
            <li>7. Transaksi untuk Penjualan / Pembelian Rumah dan Kendaraan</li>
            <li>8. Lainnya</li>
          </ol>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField label="No CIF" required>
          <Input
            value={formData.noCif}
            onChange={(e) => handleNumericInput('noCif', e.target.value)}
            disabled={isReadOnly('noCif')}
            placeholder="Masukkan No CIF"
            type="text"
            inputMode="numeric"
          />
        </FormField>
        <FormField label="No Rekening">
          <Input
            value={formData.noRek}
            onChange={(e) => handleNumericInput('noRek', e.target.value)}
            disabled={isReadOnly('noRek')}
            placeholder="Masukkan No Rekening"
            type="text"
            inputMode="numeric"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField label="Nama Nasabah" required>
          <Input
            value={formData.namaNasabah}
            onChange={(e) => onChange('namaNasabah', e.target.value)}
            disabled={isReadOnly('namaNasabah')}
            placeholder="Masukkan Nama Nasabah"
          />
        </FormField>
        <FormField label="Cabang" required>
          <CustomListbox
            value={formData.cabang}
            onChange={(value) => onChange('cabang', value)}
            options={[
              { value: "", label: "Pilih Cabang" },
              ...cabangOptions
            ]}
            placeholder="Pilih Cabang"
            disabled={isReadOnly('cabang')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField label="Indikator" required>
          <CustomListbox
            value={formData.indikator}
            onChange={(value) => handleIndikatorChange(value)}
            options={[
              { value: "", label: "Pilih Indikator" },
              ...indikatorOptions
            ]}
            placeholder="Pilih Indikator"
            disabled={isReadOnly('indikator')}
          />
        </FormField>
        <FormField label="Tanggal Transaksi" required>
          <TailwindDatePicker
            value={typeof formData.tanggalTransaksi === 'string' && formData.tanggalTransaksi ? new Date(formData.tanggalTransaksi) : formData.tanggalTransaksi as Date | null}
            onChange={(date) => onChange('tanggalTransaksi', date)}
            placeholder="Pilih tanggal"
            disabled={isReadOnly('tanggalTransaksi')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: {typeof formData.tanggalTransaksi === 'string' && formData.tanggalTransaksi ? formatDate(new Date(formData.tanggalTransaksi)) : formatDate(formData.tanggalTransaksi as Date | null)}
          </p>
        </FormField>
      </div>

      <FormField label="Keterangan Indikator" className="mb-4" required>
        <Input
          value={formData.keterangan}
          onChange={(e) => onChange('keterangan', e.target.value)}
          disabled={true}
          placeholder="Pilih indikator terlebih dahulu"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField label="Tgl Menghubungi Nasabah" required>
          <TailwindDatePicker
            value={formData.tglHubungiNasabah}
            onChange={(date) => onChange('tglHubungiNasabah', date)}
            placeholder="Pilih tanggal"
            disabled={isReadOnly('tglHubungiNasabah')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: {formatDate(formData.tglHubungiNasabah)}
          </p>
        </FormField>
        <FormField label="Jam Menghubungi Nasabah" required>
          <TimeInput24
            value={formData.jamHubungiNasabah}
            onChange={(time) => onChange('jamHubungiNasabah', time)}
            placeholder="HH:MM:SS"
            disabled={isReadOnly('jamHubungiNasabah')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField label="Transaksi Mencurigakan" required>
          <CustomListbox
            value={formData.transaksiMencurigakan}
            onChange={(value) => onChange('transaksiMencurigakan', value)}
            options={[
              { value: "", label: "Pilih status" },
              { value: "Tidak", label: "Tidak" },
              { value: "Ya", label: "Ya" }
            ]}
            placeholder="Pilih status"
            disabled={isReadOnly('transaksiMencurigakan')}
          />
        </FormField>
      </div>

      <FormField label="Penjelasan CSO" className="mb-4" required>
        <Textarea
          value={formData.penjelasanCSO}
          onChange={(e) => onChange('penjelasanCSO', e.target.value)}
          rows={4}
          placeholder="Masukkan penjelasan..."
          disabled={isReadOnly('penjelasanCSO')}
        />
      </FormField>

      <FormField label="Penjelasan SPV" className="mb-4">
        <Textarea
          value={formData.penjelasanSPV || ''}
          onChange={(e) => onChange('penjelasanSPV', e.target.value)}
          rows={4}
          placeholder="Masukkan penjelasan..."
          disabled={isReadOnly('penjelasanSPV')}
        />
      </FormField>

      <FormField label="Penjelasan Kepatuhan" className="mb-4">
        <Textarea
          value={formData.penjelasanKepatuhan || ''}
          onChange={(e) => onChange('penjelasanKepatuhan', e.target.value)}
          rows={4}
          placeholder="Masukkan penjelasan..."
          disabled={isReadOnly('penjelasanKepatuhan')}
        />
      </FormField>
    </>
  );
}
