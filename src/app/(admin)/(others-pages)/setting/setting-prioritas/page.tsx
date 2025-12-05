import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getParameterPrioritas } from "@/services/parameterRedflag";
import SettingPrioritasClient from "./SettingPrioritasClient";

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

interface ParameterPrioritasResponse {
  freq_redflag_perbulan: {
    high: string;
    low: string;
    medium: string;
  };
  freq_redflag_sama_perbulan: {
    high: string;
    low: string;
    medium: string;
  };
  redflag_list: {
    high: string;
    low: string;
    medium: string;
  };
}

// Server Component for data fetching
async function SettingPrioritasData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let parameters: PrioritasData = {
    high: "",
    medium: "",
    low: "",
    highSama: "",
    mediumSama: "",
    lowSama: "",
    redFlagHigh: "",
    redFlagMedium: "",
    redFlagLow: ""
  };

  try {
    
    const response = await getParameterPrioritas();
    if (response.status === "success" && response.data) {
      const apiData = response.data as ParameterPrioritasResponse;

      // Map API data to form state
      parameters = {
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
    }
  } catch (error) {
    console.error("Error fetching prioritas data:", error);
    // Return empty data on error
  }

  return <SettingPrioritasClient initialData={parameters} />;
}

// Loading component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Parameter Prioritas</h1>
                  <p className="text-gray-600 mt-1">Kelola parameter prioritas untuk aktivasi red flag</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-10 bg-blue-600 rounded-lg w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-blue-200 p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <div className="w-5 h-5 bg-white/40 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-white/40 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 3 }, (_, fieldIndex) => (
                      <div key={fieldIndex} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
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

// Main page component with PPR
export default function SettingPrioritasPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SettingPrioritasData />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Setting Parameter Prioritas",
  description: "Kelola parameter prioritas untuk aktivasi red flag"
};
