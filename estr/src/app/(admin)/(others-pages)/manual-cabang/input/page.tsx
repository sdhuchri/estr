"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Cookies from "js-cookie";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField, { Input, CustomListbox, Textarea } from "@/components/common/FormField";

// Sample data structure - replace with your actual data interface
interface InputData {
  id: string;
  nasabah: string;
  cif: string;
  indikator: string;
  tanggal: string;
  status: string;
}

export default function ManualCabangInputPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<InputData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "ESTR | Manual Cabang Input";

    const userId = Cookies.get("userId");

    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
      return;
    }

    // Simulate data loading
    setTimeout(() => {
      setData([
        {
          id: "1",
          nasabah: "John Doe",
          cif: "123456789",
          indikator: "Transaksi Besar",
          tanggal: "2024-01-15",
          status: "Pending"
        },
        {
          id: "2",
          nasabah: "Jane Smith",
          cif: "987654321",
          indikator: "Transaksi Mencurigakan",
          tanggal: "2024-01-16",
          status: "Review"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const handleRowAction = (action: string, item: InputData) => {
    if (action === "view") {
      console.log("View item:", item);
    } else if (action === "delete") {
      console.log("Delete item:", item);
    }
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  // Define table columns
  const columns = [
    {
      key: "id",
      label: "No",
      className: "text-center",
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      key: "nasabah",
      label: "Nama Nasabah",
      className: "font-medium"
    },
    {
      key: "cif",
      label: "No CIF"
    },
    {
      key: "indikator",
      label: "Indikator"
    },
    {
      key: "tanggal",
      label: "Tanggal Input"
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Review' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
          {value}
        </span>
      )
    }
  ];

  // Define table actions
  const actions = [
    {
      label: "View",
      action: "view",
      className: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      label: "Delete",
      action: "delete",
      className: "bg-red-500 hover:bg-red-600 text-white"
    }
  ];

  // Define search fields
  const searchFields = ["nasabah", "cif", "indikator"];

  const addButton = (
    <button
      onClick={handleAddNew}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
    >
      <Plus size={16} />
      Tambah Data
    </button>
  );

  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      {/* Left side - Cancel button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Cancel
      </button>
      
      {/* Right side - Save button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium"
      >
        Save
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6">
        {/* Data Table with integrated header */}
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          loading={isLoading}
          emptyMessage="Belum ada data yang diinput"
          title="Input Manual Cabang"
          description="Tambah dan kelola data laporan manual cabang"
          headerActions={addButton}
        />
      </div>

      {/* Add New Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Data Baru"
        footer={modalFooter}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Nama Nasabah" required>
            <Input placeholder="Masukkan nama nasabah" />
          </FormField>

          <FormField label="No CIF" required>
            <Input placeholder="Masukkan nomor CIF" />
          </FormField>

          <FormField label="Indikator" required>
            <CustomListbox
              value=""
              onChange={(value) => console.log("Selected:", value)}
              options={[
                { value: "transaksi_besar", label: "Transaksi Besar" },
                { value: "transaksi_mencurigakan", label: "Transaksi Mencurigakan" },
                { value: "lainnya", label: "Lainnya" }
              ]}
              placeholder="Pilih Indikator"
            />
          </FormField>

          <FormField label="Keterangan">
            <Textarea
              rows={3}
              placeholder="Masukkan keterangan tambahan..."
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
