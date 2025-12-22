// services/changePassword.ts
import { simulateDelay } from "@/data/mockData";

// ==================== INTERFACES ====================
export interface ChangePasswordRequest {
  userid: string;
  password: string;
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
}

export interface ValidatePasswordResponse {
  message: string;
  data?: any;
}

// ==================== VALIDATE OLD PASSWORD ====================
/**
 * Validate old password by attempting login
 * @param userid - User ID
 * @param oldPassword - Old password to validate
 * @returns Promise with validation result
 */
export async function validateOldPassword(
  userid: string,
  oldPassword: string
): Promise<{ isValid: boolean; message: string }> {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Simple validation - in real app this would check against database
    // For demo, accept any password
    return {
      isValid: true,
      message: "Password lama valid",
    };
  } catch (error) {
    console.error("Error validating old password:", error);
    return {
      isValid: false,
      message: "Gagal memvalidasi password lama",
    };
  }
}

// ==================== CHANGE PASSWORD ====================
/**
 * Change user password
 * @param userid - User ID
 * @param password - New password
 * @returns Promise with response
 * 
 * @example
 * const response = await changePassword("estr1", "newpassword123");
 */
export async function changePassword(
  userid: string,
  password: string
): Promise<ChangePasswordResponse> {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return {
      status: "success",
      message: "Password berhasil diubah"
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      status: "error",
      message: "Gagal mengubah password",
    };
  }
}
