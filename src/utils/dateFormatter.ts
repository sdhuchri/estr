/**
 * Format Date object to YYYY-MM-DD string without timezone conversion
 * This prevents the date from shifting when converting to ISO string
 * 
 * @param date - Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 * 
 * @example
 * const date = new Date(2025, 11, 10); // December 10, 2025
 * formatDateToYYYYMMDD(date); // Returns "2025-12-10"
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format Date object to DD-MMM-YYYY string (e.g., "10-Dec-2025")
 * 
 * @param date - Date object to format
 * @param locale - Locale for month name (default: "id-ID")
 * @returns Formatted date string in DD-MMM-YYYY format
 */
export function formatDateToDDMMMYYYY(date: Date | null, locale: string = "id-ID"): string {
  if (!date) return "dd-mmm-yyyy";
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString(locale, { month: "short" });
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

/**
 * Parse date string from API (YYYY-MM-DD) to Date object
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object or null if invalid
 */
export function parseDateFromAPI(dateString: string | null): Date | null {
  if (!dateString || dateString === "1970-01-01") return null;
  
  // Parse as local date to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}
