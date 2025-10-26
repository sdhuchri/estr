"use client";
import React from "react";
import { Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin untuk melanjutkan?",
  confirmLabel = "Ya, Simpan",
  cancelLabel = "Batal"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl border border-gray-200">
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-4"></div>
        
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;