"use client";
import React from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js App Router
import { Plus, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function CustomerConsentPage() {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "ESTR | Home";
    
    const userId = Cookies.get("userId");
    
    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
    }else{
      setIsLoading(false);
    }

  }, []);

  return (
    <div className="min-h-screen">
      {/* Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
