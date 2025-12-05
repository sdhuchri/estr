// services/changePassword.ts

const API_BASE_URL = "http://10.125.22.11:8080";
const API_AUTH_URL = "http://10.125.22.11:8080";

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
    const res = await fetch(`${API_AUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
        password: oldPassword,
      }),
      cache: "no-store",
    });

    const result: ValidatePasswordResponse = await res.json();

    if (result.message === "Success") {
      return {
        isValid: true,
        message: "Password lama valid",
      };
    } else {
      return {
        isValid: false,
        message: "Password lama salah",
      };
    }
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
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
        password,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      status: "error",
      message: "Gagal mengubah password",
    };
  }
}
