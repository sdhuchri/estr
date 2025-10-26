"use client";
import React, { useEffect } from "react";
import Watermark from "@/components/watermark/watermark";
import Cookies from "js-cookie";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  "4xl": "max-w-7xl"
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "xl",
  headerClassName = "",
  contentClassName = "",
  footerClassName = ""
}: ModalProps) {
  const userId = Cookies.get("userId");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow when modal closes
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const now = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayName = days[now.getDay()];
    const pad = (n: number) => String(n).padStart(2, "0");

    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const watermarkText = `${userId} / ${dayName} / ${dateStr} / ${timeStr}`;

    const timeout = setTimeout(() => {
      Watermark.init({
        targetSelector: ".modal-watermark-area",
        imageUrl: "/estr/images/logo/BCA_Syariah_logo.png",
        text: watermarkText,
        opacity: 0.1,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} my-8 modal-container`}>
          {/* Modal Header */}
          <div className={`px-6 py-4 border-b rounded-t-lg ${headerClassName}`} style={{ backgroundColor: '#18448C' }}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className={`p-6 modal-watermark-area ${contentClassName}`}>
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div className={`flex justify-center gap-4 px-6 py-4 border-t bg-gray-50 rounded-b-lg ${footerClassName}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}