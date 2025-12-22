"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/common/FormField";
import { Settings, Flag, Search, CheckCircle, XCircle } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { otorisasiParameterPrioritas, getParameterPrioritasOtorisasi } from "@/services/parameterRedflag";

interface PrioritasData {
  // Frekuensi Red Flag per Bulan
  high: string;
  medium: string;
  low: string;

  // Frekuensi Red Flag Sama per Bulan
  highSama: string;
  mediumSama: string;
  lowSama: string;

  // Red Flag List
  redFlagHigh: string;
  redFlagMedium: string;
  redFlagLow: string;
  
  // Status
  status: string;
}

interface OtorisasiPrioritasClientProps {
  initialData: PrioritasData;
}

export default function OtorisasiPrioritasClient({ initialData }: OtorisasiPrioritasClientProps) {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameters, setParameters] = useState<PrioritasData>(initialData);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject">("approve");
  
  // Check if buttons should be enabled (only when status is "input")
  const canApproveOrReject = parameters.status === "input";

  // Fetch latest data
  const fetchLatestData = async () => {
    try {
      const response = await getParameterPrioritasOtorisasi();
      if (response.status === "success" && response.data) {
        const apiData = response.data;
        setParameters({
          high: apiData.freq_redflag_perbulan.high || "",
          medium: apiData.freq_redflag_perbulan.medium || "",
          low: apiData.freq_redflag_perbulan.low || "",
          highSama: apiData.freq_redflag_sama_perbulan.high || "",
          mediumSama: apiData.freq_redflag_sama_perbulan.medium || "",
          lowSama: apiData.freq_redflag_sama_perbulan.low || "",
          redFlagHigh: apiData.redflag_list.high || "",
          redFlagMedium: apiData.redflag_list.medium || "",
          redFlagLow: apiData.redflag_list.low || "",
          status: apiData.STATUS || ""
        });
      }
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const handleApproveClick = () => {
    setConfirmAction("approve");
    setShowConfirmDialog(true);
  };

  const handleRejectClick = () => {
    setConfirmAction("reject");
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    
    try {
      // Get user_otor from cookie (client-side)
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return "";
      };

      const userId = getCookieValue("userId") || "USER001";

      const requestData = {
        action: confirmAction,
        user_otor: userId
      };

      console.log(`${confirmAction === "approve" ? "Approving" : "Rejecting"} prioritas parameters:`, requestData);

      const response = await otorisasiParameterPrioritas(requestData);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || `Parameter prioritas berhasil ${confirmAction === "approve" ? "disetujui" : "ditolak"}!`,
          life: 3000
        });
        
        // Fetch updated data
        await fetchLatestData();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || `Gagal ${confirmAction === "approve" ? "menyetujui" : "menolak"} parameter prioritas!`,
          life: 3000
        });
      }
    } catch (error) {
      console.error(`Error ${confirmAction === "approve" ? "approving" : "rejecting"} parameters:`, error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: `Gagal ${confirmAction === "approve" ? "menyetujui" : "menolak"} parameter prioritas!`,
        life: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
  };

  // Convert comma-separated string to chips array
  const stringToChips = (str: string): string[] => {
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  // Disabled Chip Display Component
  const ChipDisplay = ({
    field,
    label,
    operator = ""
  }: {
    field: keyof PrioritasData;
    label: string;
    operator?: string;
  }) => {
    const chips = stringToChips(parameters[field]);

    return (
      <FormField label={label}>
        <div className="border border-gray-300 rounded-lg p-3 min-h-[50px] bg-gray-50 cursor-not-allowed">
          <div className="flex items-center gap-2">
            {/* Operator */}
            {operator && (
              <span className="text-gray-400 text-sm font-medium flex-shrink-0">
                {operator}
              </span>
            )}

            {/* Display chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              {chips.length > 0 ? (
                chips.map((chip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full"
                  >
                    {chip}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Tidak ada data</span>
              )}
            </div>
          </div>
        </div>
      </FormField>
    );
  };

  const parameterSections = [
    {
      title: "Frekuensi Red Flag per Bulan",
      color: "bg-indigo-500",
      fields: [
        {
          key: "high" as keyof PrioritasData,
          label: "High",
          operator: "≥"
        },
        {
          key: "medium" as keyof PrioritasData,
          label: "Medium",
          operator: "="
        },
        {
          key: "low" as keyof PrioritasData,
          label: "Low",
          operator: "≤"
        }
      ]
    },
    {
      title: "Frekuensi Red Flag Sama per Bulan",
      color: "bg-orange-500",
      fields: [
        {
          key: "highSama" as keyof PrioritasData,
          label: "High",
          operator: "≥"
        },
        {
          key: "mediumSama" as keyof PrioritasData,
          label: "Medium",
          operator: "="
        },
        {
          key: "lowSama" as keyof PrioritasData,
          label: "Low",
          operator: "≤"
        }
      ]
    },
    {
      title: "Red Flag List",
      color: "bg-emerald-500",
      fields: [
        {
          key: "redFlagHigh" as keyof PrioritasData,
          label: "High",
          operator: ""
        },
        {
          key: "redFlagMedium" as keyof PrioritasData,
          label: "Medium",
          operator: ""
        },
        {
          key: "redFlagLow" as keyof PrioritasData,
          label: "Low",
          operator: ""
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmAction === "approve" ? "Konfirmasi Approve" : "Konfirmasi Reject"}
        message={`Apakah Anda yakin ingin ${confirmAction === "approve" ? "menyetujui" : "menolak"} parameter prioritas ini?`}
        confirmLabel={confirmAction === "approve" ? "Ya, Approve" : "Ya, Reject"}
        cancelLabel="Batal"
        variant={confirmAction === "reject" ? "danger" : "default"}
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">Otorisasi Parameter Prioritas</h1>
                    {parameters.status && (
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        parameters.status.toLowerCase() === "input" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : parameters.status.toLowerCase() === "approve" || parameters.status.toLowerCase() === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        Status: {parameters.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">Review dan otorisasi perubahan parameter prioritas</p>
                </div>
              </div>

              {/* Search and Action Buttons - Right Side */}
              <div className="flex items-center gap-4">
                {/* Search Parameter */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search anything.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    maxLength={255}
                  />
                </div>

                {/* Reject Button */}
                <button
                  onClick={handleRejectClick}
                  disabled={isProcessing || !canApproveOrReject}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg"
                  title={!canApproveOrReject ? "Tidak dapat melakukan otorisasi (status bukan input)" : ""}
                >
                  {isProcessing && confirmAction === "reject" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Reject
                    </>
                  )}
                </button>

                {/* Approve Button */}
                <button
                  onClick={handleApproveClick}
                  disabled={isProcessing || !canApproveOrReject}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg"
                  title={!canApproveOrReject ? "Tidak dapat melakukan otorisasi (status bukan input)" : ""}
                >
                  {isProcessing && confirmAction === "approve" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Parameter Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {parameterSections
                .filter(section => {
                  if (!searchTerm.trim()) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    section.title.toLowerCase().includes(searchLower) ||
                    section.fields.some(field =>
                      field.label.toLowerCase().includes(searchLower)
                    )
                  );
                })
                .map((section, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className={`${section.color} p-4`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Flag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      {section.fields.map((field, fieldIndex) => (
                        <ChipDisplay
                          key={fieldIndex}
                          field={field.key}
                          label={field.label}
                          operator={field.operator}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
