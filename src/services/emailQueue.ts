// services/emailQueue.ts
import { simulateDelay } from "@/data/mockData";

// ==================== INTERFACES ====================
export interface SendEmailRequest {
  action: string;
  user_input: string;
  cabang: string;
}

export interface SendEmailResponse {
  status: string;
  message: string;
}

// ==================== SEND EMAIL NOTIFICATION ====================
/**
 * Queue email notification to be sent
 * @param action - Action type (e.g., "manual_cabang_update", "manual_cabang_approve")
 * @param userInput - User input or identifier
 * @param cabang - Kode cabang from user login
 * @returns Promise with response
 * 
 * @example
 * const response = await sendEmailNotification("manual_cabang_update", "estr1", "001");
 */
export async function sendEmailNotification(
  action: string,
  userInput: string,
  cabang: string
): Promise<SendEmailResponse> {
  try {
    // Simulate API delay
    await simulateDelay(300);

    console.log(`Email notification queued: ${action} for ${userInput} at ${cabang}`);

    return {
      status: "success",
      message: "Email notification berhasil dikirim"
    };
  } catch (error) {
    console.error("Error sending email notification:", error);
    return {
      status: "error",
      message: "Gagal mengirim notifikasi email",
    };
  }
}
