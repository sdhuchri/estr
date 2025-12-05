"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin untuk melanjutkan?",
  confirmLabel = "Ya, Simpan",
  cancelLabel = "Batal",
  variant = "default"
}) => {
  // Handle ESC key to close confirm dialog
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.stopPropagation(); // Prevent modal from catching this event
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey, true); // Use capture phase
      return () => {
        document.removeEventListener('keydown', handleEscKey, true);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[90%] max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div 
          className="px-6 py-4 border-b rounded-t-lg" 
          style={{ backgroundColor: variant === "danger" ? '#DC2626' : '#18448C' }}
        >
          <h2 className="text-xl font-semibold text-white text-center">
            {title}
          </h2>
        </div>
        
        {/* Body */}
        <div className="px-6 py-8">
          <p className="text-gray-600 text-center text-base">
            {message}
          </p>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-center gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors duration-200"
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-8 py-2.5 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2 ${
              variant === "danger" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Check className="h-4 w-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render confirm dialog at document body level
  if (typeof document !== 'undefined') {
    return createPortal(dialogContent, document.body);
  }

  return null;
};

export default ConfirmDialog;