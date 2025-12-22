"use client";
import { useState, useRef, useEffect } from "react";
import FormField from "@/components/common/FormField";
import MultiSelect from "@/components/common/MultiSelect";
import { Flag, Search, X } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { insertParameterPrioritas, getParameterPrioritas, getListIndikator } from "@/services/parameterRedflag";

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
}

interface SettingPrioritasClientProps {
  initialData: PrioritasData;
}

export default function SettingPrioritasClient({ initialData }: SettingPrioritasClientProps) {
  const toast = useRef<Toast>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameters, setParameters] = useState<PrioritasData>(initialData);
  const [initialParameters] = useState<PrioritasData>(initialData);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [indikatorOptions, setIndikatorOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingIndikator, setIsLoadingIndikator] = useState(true);

  // Fetch list indikator from API
  useEffect(() => {
    const fetchIndikator = async () => {
      try {
        const response = await getListIndikator();
        if (response.status === "success" && response.data?.data) {
          const options = response.data.data.map((item: any) => ({
            value: item.kode_indikator,
            label: item.kode_indikator
          }));
          setIndikatorOptions(options);
        }
      } catch (error) {
        console.error("Error fetching indikator:", error);
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: "Gagal memuat list indikator",
          life: 3000
        });
      } finally {
        setIsLoadingIndikator(false);
      }
    };

    fetchIndikator();
  }, []);

  // Check if there are any changes
  const hasChanges = () => {
    return JSON.stringify(parameters) !== JSON.stringify(initialParameters);
  };

  // Fetch latest data
  const fetchLatestData = async () => {
    try {
      const response = await getParameterPrioritas();
      if (response.status === "success" && response.data) {
        const apiData = response.data;
        const newData = {
          high: apiData.freq_redflag_perbulan.high || "",
          medium: apiData.freq_redflag_perbulan.medium || "",
          low: apiData.freq_redflag_perbulan.low || "",
          highSama: apiData.freq_redflag_sama_perbulan.high || "",
          mediumSama: apiData.freq_redflag_sama_perbulan.medium || "",
          lowSama: apiData.freq_redflag_sama_perbulan.low || "",
          redFlagHigh: apiData.redflag_list.high || "",
          redFlagMedium: apiData.redflag_list.medium || "",
          redFlagLow: apiData.redflag_list.low || ""
        };
        setParameters(newData);
      }
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const handleInputChange = (field: keyof PrioritasData, value: string) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle MultiSelect change (for Red Flag List)
  const handleMultiSelectChange = (field: keyof PrioritasData, selected: string[]) => {
    // Check for duplicates across priorities
    const otherFields: Array<keyof PrioritasData> = [];
    
    if (field === 'redFlagHigh') {
      otherFields.push('redFlagMedium', 'redFlagLow');
    } else if (field === 'redFlagMedium') {
      otherFields.push('redFlagHigh', 'redFlagLow');
    } else if (field === 'redFlagLow') {
      otherFields.push('redFlagHigh', 'redFlagMedium');
    }
    
    // Get values from other priority fields
    const otherValues = otherFields.flatMap(f => stringToChips(parameters[f]));
    
    // Check if any selected value exists in other priorities
    const duplicates = selected.filter(val => otherValues.includes(val));
    
    if (duplicates.length > 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: `Indikator "${duplicates.join(', ')}" sudah ada di prioritas lain!`,
        life: 3000
      });
      return; // Don't update if there are duplicates
    }
    
    // Convert array to comma-separated string
    const value = selected.join(', ');
    handleInputChange(field, value);
  };

  // Convert comma-separated string to chips array
  const stringToChips = (str: string): string[] => {
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  // Convert chips array to comma-separated string
  const chipsToString = (chips: string[]): string => {
    return chips.join(', ');
  };

  // Add new chip
  const addChip = (field: keyof PrioritasData, newChip: string) => {
    if (!newChip.trim()) return;

    const trimmedChip = newChip.trim().toUpperCase();
    
    // Check max length for frequency fields (25 characters)
    if (field === 'high' || field === 'medium' || field === 'low' || 
        field === 'highSama' || field === 'mediumSama' || field === 'lowSama') {
      if (trimmedChip.length > 25) {
        toast.current?.show({
          severity: "warn",
          summary: "Peringatan!",
          detail: "Maksimal 25 karakter per nilai!",
          life: 3000
        });
        return;
      }
    }
    
    const currentChips = stringToChips(parameters[field]);

    // Check if chip already exists
    if (currentChips.includes(trimmedChip)) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: `"${trimmedChip}" sudah ada!`,
        life: 3000
      });
      return;
    }

    // Add valid chip
    const updatedChips = [...currentChips, trimmedChip];
    handleInputChange(field, chipsToString(updatedChips));
  };

  // Remove chip
  const removeChip = (field: keyof PrioritasData, chipToRemove: string) => {
    const currentChips = stringToChips(parameters[field]);
    const updatedChips = currentChips.filter(chip => chip !== chipToRemove);
    handleInputChange(field, chipsToString(updatedChips));
  };

  // Chip Input Component
  const ChipInput = ({
    field,
    label,
    placeholder,
    maxChips = undefined,
    operator = ""
  }: {
    field: keyof PrioritasData;
    label: string;
    placeholder: string;
    maxChips?: number;
    operator?: string;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const chips = stringToChips(parameters[field]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        
        // Check if max chips reached
        if (maxChips && chips.length >= maxChips) {
          toast.current?.show({
            severity: "warn",
            summary: "Peringatan!",
            detail: `Maksimal ${maxChips} nilai untuk field ini!`,
            life: 3000
          });
          return;
        }

        addChip(field, inputValue);
        setInputValue("");
        // Keep focus on input after adding chip
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };

    const handleBlur = () => {
      if (inputValue.trim()) {
        // Check if max chips reached
        if (maxChips && chips.length >= maxChips) {
          setInputValue("");
          return;
        }
        addChip(field, inputValue);
        setInputValue("");
      }
    };

    return (
      <FormField label={label}>
        <div className="border border-gray-300 rounded-lg p-3 min-h-[50px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <div className="flex items-center gap-2">
            {/* Operator */}
            {operator && (
              <span className="text-gray-500 text-sm font-medium flex-shrink-0">
                {operator}
              </span>
            )}

            {/* Display chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              {chips.map((chip, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {chip}
                  <button
                    type="button"
                    onClick={() => removeChip(field, chip)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {/* Input for new chips - only show if not at max */}
              {(!maxChips || chips.length < maxChips) && (
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={chips.length === 0 ? placeholder : ""}
                  maxLength={25}
                  className="flex-1 min-w-[100px] border-none outline-none text-sm"
                />
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {maxChips === 1 
            ? "Tekan Enter atau koma untuk menambah nilai (maksimal 1 nilai, 25 karakter)"
            : "Tekan Enter atau koma untuk menambah nilai (maksimal 25 karakter)"}
        </p>
      </FormField>
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get user_input from cookie (client-side)
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return "";
      };
      
      const userId = getCookieValue("userId") || "USER001";

      // Map form data to API format
      // Multiple chips are already comma-separated in the parameters state
      const apiData = {
        high: {
          freq_redflag_perbulan: parameters.high,
          freq_redflag_sama_perbulan: parameters.highSama,
          redflag_list: parameters.redFlagHigh
        },
        medium: {
          freq_redflag_perbulan: parameters.medium,
          freq_redflag_sama_perbulan: parameters.mediumSama,
          redflag_list: parameters.redFlagMedium
        },
        low: {
          freq_redflag_perbulan: parameters.low,
          freq_redflag_sama_perbulan: parameters.lowSama,
          redflag_list: parameters.redFlagLow
        },
        user_input: userId
      };

      console.log("Saving prioritas parameters:", apiData);

      const response = await insertParameterPrioritas(apiData);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Parameter prioritas berhasil disimpan!",
          life: 3000
        });
        
        // Fetch latest data
        await fetchLatestData();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menyimpan parameter prioritas!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error saving parameters:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal menyimpan parameter prioritas!",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    await handleSave();
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const parameterSections = [
    {
      title: "Frekuensi Red Flag per Bulan",
      color: "bg-indigo-500",
      fields: [
        {
          key: "high" as keyof PrioritasData,
          label: "High",
          operator: "≥",
          placeholder: ""
        },
        {
          key: "medium" as keyof PrioritasData,
          label: "Medium",
          operator: "=",
          placeholder: ""
        },
        {
          key: "low" as keyof PrioritasData,
          label: "Low",
          operator: "≤",
          placeholder: ""
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
          operator: "≥",
          placeholder: ""
        },
        {
          key: "mediumSama" as keyof PrioritasData,
          label: "Medium",
          operator: "=",
          placeholder: ""
        },
        {
          key: "lowSama" as keyof PrioritasData,
          label: "Low",
          operator: "≤",
          placeholder: ""
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
          operator: "",
          placeholder: "PEP, MTM"
        },
        {
          key: "redFlagMedium" as keyof PrioritasData,
          label: "Medium",
          operator: "",
          placeholder: "RDS, TUN, DOR"
        },
        {
          key: "redFlagLow" as keyof PrioritasData,
          label: "Low",
          operator: "",
          placeholder: "ET, IRBU"
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
        onClose={handleCancelSave}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan parameter prioritas ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Parameter Prioritas</h1>
                  <p className="text-gray-600 mt-1">Kelola parameter prioritas untuk aktivasi red flag</p>
                </div>
              </div>

              {/* Search and Save Button - Right Side */}
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

                {/* Save Button */}
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasChanges()}
                  className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Parameter
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
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-visible">
                    {/* Card Header */}
                    <div className={`${section.color} p-4 rounded-t-xl`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Flag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      {section.fields.map((field, fieldIndex) => {
                        // Use MultiSelect for Red Flag List section
                        if (section.title === "Red Flag List") {
                          const selectedValues = stringToChips(parameters[field.key]);
                          
                          // Filter out options that are already selected in other priorities
                          const otherFields: Array<keyof PrioritasData> = [];
                          if (field.key === 'redFlagHigh') {
                            otherFields.push('redFlagMedium', 'redFlagLow');
                          } else if (field.key === 'redFlagMedium') {
                            otherFields.push('redFlagHigh', 'redFlagLow');
                          } else if (field.key === 'redFlagLow') {
                            otherFields.push('redFlagHigh', 'redFlagMedium');
                          }
                          
                          const otherSelectedValues = otherFields.flatMap(f => stringToChips(parameters[f]));
                          const filteredOptions = indikatorOptions.filter(opt => 
                            !otherSelectedValues.includes(opt.value)
                          );
                          
                          return (
                            <FormField key={fieldIndex} label={field.label}>
                              <MultiSelect
                                options={filteredOptions}
                                value={selectedValues}
                                onChange={(selected) => handleMultiSelectChange(field.key, selected)}
                                placeholder={isLoadingIndikator ? "Memuat..." : field.placeholder || "Pilih indikator..."}
                                disabled={isLoadingIndikator}
                              />
                            </FormField>
                          );
                        }

                        // Use ChipInput for Frekuensi sections
                        if (section.title === "Frekuensi Red Flag per Bulan" || section.title === "Frekuensi Red Flag Sama per Bulan") {
                          // Medium can have multiple chips, High and Low only 1
                          const maxChips = field.label === "Medium" ? undefined : 1;
                          return (
                            <ChipInput
                              key={fieldIndex}
                              field={field.key}
                              label={field.label}
                              placeholder={field.placeholder || "Masukkan nilai..."}
                              maxChips={maxChips}
                              operator={field.operator}
                            />
                          );
                        }

                        // Fallback to regular input (shouldn't reach here)
                        return (
                          <FormField key={fieldIndex} label={field.label}>
                            <div className="relative">
                              {field.operator && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                                  {field.operator}
                                </span>
                              )}
                              <input
                                type="text"
                                value={parameters[field.key]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.key, e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.operator ? 'pl-8' : ''}`}
                                placeholder={field.placeholder || "Masukkan nilai..."}
                                maxLength={25}
                              />
                            </div>
                          </FormField>
                        );
                      })}
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
