"use client";
import { useState, useRef } from "react";
import { Settings } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { insertParameterAktivasi, getParameterAktivasi } from "@/services/parameterRedflag";

interface AktivasiData {
  passby: boolean;
  pep: boolean;
  et: boolean;
  nrt: boolean;
  dorman: boolean;
  mtm: boolean;
  bop: boolean;
  rbu: boolean;
  rbu2: boolean;
  rds: boolean;
  tun: boolean;
  dor: boolean;
  exceedIncome: boolean;
  tarikSetor: boolean;
  judol: boolean;
  dbSuspect: boolean;
  dbTeroris: boolean;
  trfSuspect: boolean;
}

interface SettingAktivasiClientProps {
  initialData: AktivasiData;
  userId: string;
}

export default function SettingAktivasiClient({ initialData, userId }: SettingAktivasiClientProps) {
  const toast = useRef<Toast>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aktivasi, setAktivasi] = useState<AktivasiData>(initialData);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleToggle = (field: keyof AktivasiData) => {
    setAktivasi(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmDialogOpen(false);
    handleSave();
  };

  const handleCancelSave = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map aktivasi data to API format (boolean to "ON"/"OFF")
      const apiData = {
        passby: aktivasi.passby ? "ON" : "OFF",
        pep: aktivasi.pep ? "ON" : "OFF",
        et: aktivasi.et ? "ON" : "OFF",
        nrt: aktivasi.nrt ? "ON" : "OFF",
        dorman: aktivasi.dorman ? "ON" : "OFF",
        mtm: aktivasi.mtm ? "ON" : "OFF",
        bop: aktivasi.bop ? "ON" : "OFF",
        rbu: aktivasi.rbu ? "ON" : "OFF",
        rbu2: aktivasi.rbu2 ? "ON" : "OFF",
        rds: aktivasi.rds ? "ON" : "OFF",
        tun: aktivasi.tun ? "ON" : "OFF",
        dor: aktivasi.dor ? "ON" : "OFF",
        exceed_income: aktivasi.exceedIncome ? "ON" : "OFF",
        tarik_setor: aktivasi.tarikSetor ? "ON" : "OFF",
        judol: aktivasi.judol ? "ON" : "OFF",
        db_suspect: aktivasi.dbSuspect ? "ON" : "OFF",
        db_teroris: aktivasi.dbTeroris ? "ON" : "OFF",
        trf_suspect: aktivasi.trfSuspect ? "ON" : "OFF",
        user_input: userId
      };

      const response = await insertParameterAktivasi(apiData);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Pengaturan aktivasi berhasil disimpan!",
          life: 3000
        });

        // Fetch updated data from API
        const updatedResponse = await getParameterAktivasi();
        if (updatedResponse.status === "success" && updatedResponse.data) {
          const apiData = updatedResponse.data;
          
          // Update state with fresh data from API
          setAktivasi({
            passby: apiData.PASSBY === "ON",
            pep: apiData.PEP === "ON",
            et: apiData.ET === "ON",
            nrt: apiData.NRT === "ON",
            dorman: apiData.DORMAN === "ON",
            mtm: apiData.MTM === "ON",
            bop: apiData.BOP === "ON",
            rbu: apiData.RBU === "ON",
            rbu2: apiData.RBU2 === "ON",
            rds: apiData.RDS === "ON",
            tun: apiData.TUN === "ON",
            dor: apiData.DOR === "ON",
            exceedIncome: apiData.EXCEED_INCOME === "ON",
            tarikSetor: apiData.TARIK_SETOR === "ON",
            judol: apiData.JUDOL === "ON",
            dbSuspect: apiData.DB_SUSPECT === "ON",
            dbTeroris: apiData.DB_TERORIS === "ON",
            trfSuspect: apiData.TRF_SUSPECT === "ON"
          });
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menyimpan pengaturan aktivasi!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error saving activation settings:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat menyimpan pengaturan aktivasi!",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      style={{ transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      className={`relative inline-flex h-8 w-16 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked ? 'bg-[#3dacf5] focus:ring-[#3dacf5]' : 'bg-gray-300 focus:ring-gray-400'
      }`}
    >
      <span
        style={{ 
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: checked ? '0.15s' : '0s'
        }}
        className={`absolute text-[10px] font-semibold ${
          checked ? 'left-2 text-white opacity-100 scale-100' : 'left-2 text-white opacity-0 scale-90'
        }`}
      >
        ON
      </span>
      <span
        style={{ 
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: checked ? '0s' : '0.15s'
        }}
        className={`absolute text-[10px] font-semibold ${
          checked ? 'right-2 text-gray-500 opacity-0 scale-90' : 'right-2 text-gray-500 opacity-100 scale-100'
        }`}
      >
        OFF
      </span>
      <span
        style={{ transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md ${
          checked ? 'translate-x-9' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const aktivasiItems = [
    { key: 'passby' as keyof AktivasiData, label: 'PASSBY' },
    { key: 'pep' as keyof AktivasiData, label: 'PEP' },
    { key: 'et' as keyof AktivasiData, label: 'ET' },
    { key: 'nrt' as keyof AktivasiData, label: 'NRT' },
    { key: 'dorman' as keyof AktivasiData, label: 'DORMAN' },
    { key: 'mtm' as keyof AktivasiData, label: 'MTM' },
    { key: 'bop' as keyof AktivasiData, label: 'BOP' },
    { key: 'rbu' as keyof AktivasiData, label: 'RBU' },
    { key: 'rbu2' as keyof AktivasiData, label: 'RBU2' },
    { key: 'rds' as keyof AktivasiData, label: 'RDS' },
    { key: 'tun' as keyof AktivasiData, label: 'TUN' },
    { key: 'dor' as keyof AktivasiData, label: 'DOR' },
    { key: 'exceedIncome' as keyof AktivasiData, label: 'EXCEED INCOME' },
    { key: 'tarikSetor' as keyof AktivasiData, label: 'TARIK SETOR' },
    { key: 'judol' as keyof AktivasiData, label: 'JUDOL' },
    { key: 'dbSuspect' as keyof AktivasiData, label: 'DB SUSPECT' },
    { key: 'dbTeroris' as keyof AktivasiData, label: 'DB TERORIS' },
    { key: 'trfSuspect' as keyof AktivasiData, label: 'TRF SUSPECT' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelSave}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan perubahan aktivasi parameter ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        variant="default"
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Aktivasi Parameter</h1>
                  <p className="text-gray-600 mt-1">Kelola aktivasi parameter deteksi red flag</p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Aktivasi
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              {aktivasiItems.map((item, index) => (
                <div 
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-base font-medium text-gray-900">
                    {item.label}
                  </span>
                  <ToggleSwitch
                    checked={aktivasi[item.key]}
                    onChange={() => handleToggle(item.key)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
