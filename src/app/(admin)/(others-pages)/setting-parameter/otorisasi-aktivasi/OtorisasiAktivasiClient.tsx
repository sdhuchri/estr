"use client";
import { useState, useRef } from "react";
import { Settings, CheckCircle, XCircle } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { otorisasiParameterAktivasi, getParameterAktivasiOtorisasi } from "@/services/parameterRedflag";

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

interface OtorisasiAktivasiClientProps {
  initialData: AktivasiData;
  userId: string;
  status: string;
}

export default function OtorisasiAktivasiClient({ initialData, userId, status: initialStatus }: OtorisasiAktivasiClientProps) {
  const toast = useRef<Toast>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aktivasi, setAktivasi] = useState<AktivasiData>(initialData);
  const [status, setStatus] = useState(initialStatus);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  
  // Check if buttons should be disabled (status is not "input")
  const isButtonsDisabled = status.toLowerCase() !== "input";

  const handleApproveClick = () => {
    setActionType("approve");
    setIsConfirmDialogOpen(true);
  };

  const handleRejectClick = () => {
    setActionType("reject");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsConfirmDialogOpen(false);
    setIsProcessing(true);

    try {
      const response = await otorisasiParameterAktivasi({
        action: actionType,
        user_otor: userId
      });

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || `Aktivasi parameter berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}!`,
          life: 3000
        });

        // Fetch updated data from API
        const updatedResponse = await getParameterAktivasiOtorisasi();
        if (updatedResponse.status === "success" && updatedResponse.data) {
          const apiData = updatedResponse.data;
          
          // Update status
          setStatus(apiData.STATUS || "input");
          
          // Update aktivasi data
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
          detail: response.message || `Gagal ${actionType === "approve" ? "menyetujui" : "menolak"} aktivasi parameter!`,
          life: 3000
        });
      }
    } catch (error) {
      console.error(`Error ${actionType}ing aktivasi:`, error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: `Terjadi kesalahan saat ${actionType === "approve" ? "menyetujui" : "menolak"} aktivasi parameter!`,
        life: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = () => {
    setIsConfirmDialogOpen(false);
  };

  // Disabled Toggle Switch Component
  const ToggleSwitch = ({ 
    checked
  }: { 
    checked: boolean;
  }) => (
    <button
      type="button"
      disabled
      style={{ transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      className={`relative inline-flex h-8 w-16 items-center rounded-full cursor-not-allowed opacity-60 ${
        checked ? 'bg-[#3dacf5]' : 'bg-gray-300'
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
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={actionType === "approve" ? "Konfirmasi Approve" : "Konfirmasi Reject"}
        message={`Apakah Anda yakin ingin ${actionType === "approve" ? "menyetujui" : "menolak"} perubahan aktivasi parameter ini?`}
        confirmLabel={actionType === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
        cancelLabel="Batal"
        variant={actionType === "reject" ? "danger" : "default"}
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Otorisasi Aktivasi Parameter</h1>
                    {/* Status Badge */}
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      status.toLowerCase() === "input" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : status.toLowerCase() === "approve"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      Status: {status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Review dan otorisasi perubahan aktivasi parameter</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {/* Reject Button */}
                <button
                  onClick={handleRejectClick}
                  disabled={isProcessing || isButtonsDisabled}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isProcessing && actionType === "reject" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Reject
                    </>
                  )}
                </button>

                {/* Approve Button */}
                <button
                  onClick={handleApproveClick}
                  disabled={isProcessing || isButtonsDisabled}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isProcessing && actionType === "approve" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              {aktivasiItems.map((item) => (
                <div 
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-base font-medium text-gray-900">
                    {item.label}
                  </span>
                  <ToggleSwitch checked={aktivasi[item.key]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
