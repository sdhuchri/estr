// services/emailQueue.ts

const API_BASE_URL = "http://10.125.22.11:8080";

// ==================== INTERFACES ====================
export interface SendEmailRequest {
  email: string;
  action: string;
  user_input: string;
}

export interface SendEmailResponse {
  status: string;
  message: string;
}

// ==================== SEND EMAIL ====================
/**
 * Queue email to be sent
 * @param email - Email address to send to
 * @param action - Action type (e.g., "test", "notification")
 * @param userInput - User input or identifier
 * @returns Promise with response
 * 
 * @example
 * const response = await sendEmail("user@example.com", "test", "estr1");
 */
export async function sendEmail(
  email: string,
  action: string,
  userInput: string
): Promise<SendEmailResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/helper/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        action,
        user_input: userInput,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      status: "error",
      message: "Gagal mengirim email",
    };
  }
}

// ==================== SEND MULTIPLE EMAILS ====================
/**
 * Queue multiple emails to be sent
 * @param emails - Array of email addresses
 * @param action - Action type
 * @param userInput - User input or identifier
 * @returns Promise with array of responses
 */
export async function sendMultipleEmails(
  emails: string[],
  action: string,
  userInput: string
): Promise<SendEmailResponse[]> {
  try {
    const promises = emails.map((email) =>
      sendEmail(email, action, userInput)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error sending multiple emails:", error);
    return emails.map(() => ({
      status: "error",
      message: "Gagal mengirim email",
    }));
  }
}

// ==================== HARDCODED EMAIL RECIPIENTS ====================
export const DEFAULT_EMAIL_RECIPIENTS = [
  "bagus_eko@bcasyariah.co.id",
  "suryana_dhuchri@bcasyariah.co.id",
];
