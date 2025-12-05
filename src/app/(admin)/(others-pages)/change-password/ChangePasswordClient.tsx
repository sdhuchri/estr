"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Toast } from "primereact/toast";
import FormField, { Input } from "@/components/common/FormField";
import { Eye, EyeOff } from "lucide-react";
import { changePassword, validateOldPassword } from "@/services/changePassword";

export default function ChangePasswordClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = (): boolean => {
    // Validasi 1: Password tidak boleh kosong
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword ||
        formData.oldPassword.trim() === "" || formData.newPassword.trim() === "" || formData.confirmPassword.trim() === "") {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password tidak boleh kosong",
        life: 3000
      });
      return false;
    }

    // Validasi 2: Password lama dan baru tidak boleh sama
    if (formData.oldPassword === formData.newPassword) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password lama dan Password baru tidak boleh sama",
        life: 3000
      });
      return false;
    }

    // Validasi 3: Password tidak boleh kurang dari 9 karakter
    if (formData.newPassword.length < 9) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password tidak boleh kurang dari 9 karakter",
        life: 3000
      });
      return false;
    }

    // Validasi 4: Password tidak boleh lebih dari 10 karakter
    if (formData.newPassword.length > 10) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password tidak boleh lebih dari 10 karakter",
        life: 3000
      });
      return false;
    }

    // Validasi 5: Password Baru tidak sama dengan Konfirmasi
    if (formData.newPassword !== formData.confirmPassword) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password Baru tidak sama",
        life: 3000
      });
      return false;
    }

    // Validasi 6: Password harus gabungan dari huruf dan angka
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9@]+)$/;
    if (!passwordPattern.test(formData.newPassword)) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password harus gabungan dari huruf dan angka",
        life: 3000
      });
      return false;
    }

    return true;
  };

  const handleReset = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!session?.userId) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Session tidak ditemukan. Silakan login kembali.",
        life: 3000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Validate old password by attempting login
      const validationResult = await validateOldPassword(
        session.userId,
        formData.oldPassword
      );

      if (!validationResult.isValid) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: validationResult.message,
          life: 3000
        });
        setIsSubmitting(false);
        return;
      }

      // Step 2: If old password is valid, proceed to change password
      const response = await changePassword(
        session.userId,
        formData.newPassword
      );

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil",
          detail: response.message || "Password berhasil diubah",
          life: 3000
        });

        // Reset form
        handleReset();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal mengubah password",
          life: 3000
        });
      }

    } catch (error) {
      console.error("Error changing password:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error instanceof Error ? error.message : "Gagal mengubah password",
        life: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
              <p className="text-gray-600 mt-1">Ubah password akun Anda</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="max-w-2xl">
                <div className="space-y-4">
                  {/* Password Lama */}
                  <FormField label="Password Lama">
                    <div className="relative">
                      <Input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                        placeholder="Masukkan password lama"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormField>

                  {/* Password Baru */}
                  <FormField label="Password Baru">
                    <div className="relative">
                      <Input
                        type={showPasswords.newPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Masukkan password baru"
                        className="pr-10"
                        maxLength={10}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormField>

                  {/* Konfirmasi Password */}
                  <FormField label="Konfirmasi Password">
                    <div className="relative">
                      <Input
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Masukkan ulang password baru"
                        className="pr-10"
                        maxLength={10}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormField>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting ? "Menyimpan..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
