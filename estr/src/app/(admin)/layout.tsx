// layout.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect, useRef } from "react";
import Watermark from "@/components/watermark/watermark";
import Cookies from "js-cookie";
import { useInactivityLogout } from "@/services/sessionTimeout";
import { Toast } from "primereact/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const userId = Cookies.get("userId");
  const toastRef = useRef<Toast>(null);

  const showTimeoutToast = () => {
    toastRef.current?.show({
      severity: "warn",
      summary: "Session Timeout",
      detail: "Anda telah logout karena tidak aktif selama 10 menit.",
      life: 3000,
    });
  };

  useInactivityLogout(15, showTimeoutToast);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[280px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    if (!userId) return;

    const now = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = days[now.getDay()];
    const pad = (n: number) => String(n).padStart(2, "0");

    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const watermarkText = `${userId} / ${dayName} / ${dateStr} / ${timeStr}`;

    const timeout = setTimeout(() => {
      Watermark.init({
        targetSelector: ".watermark-area",
        imageUrl: "/estr/images/logo/BCA_Syariah_logo.png",
        text: watermarkText,
        opacity: 0.1,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [userId]);

  return (
    <div className="min-h-screen xl:flex">
      <Toast ref={toastRef} position="top-right" />
      <AppSidebar />
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-l) md:p-6 watermark-area">
          {children}
        </div>
      </div>
    </div>
  );
}
