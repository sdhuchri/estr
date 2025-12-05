import * as XLSX from "xlsx";

// ==================== TYPES ====================
export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  render?: (value: any, item: any) => string | number;
}

export interface ExcelHeaderInfo {
  left: Array<{ label: string; value: string }>;
  right: Array<{ label: string; value: string }>;
}

export interface ExcelGeneratorOptions {
  title: string;
  data: any[];
  columns: ExcelColumn[];
  headerInfo?: ExcelHeaderInfo;
  fileName?: string;
  sheetName?: string;
}

// ==================== HELPER FUNCTIONS ====================
const formatDateTime = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy}_${hh}-${min}-${ss}`;
};

// ==================== MAIN EXCEL GENERATOR ====================
export async function generateExcel(
  options: ExcelGeneratorOptions
): Promise<Blob> {
  const {
    title,
    data,
    columns,
    headerInfo,
    fileName,
    sheetName = "Sheet1",
  } = options;

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const wsData: any[][] = [];

  // Add table headers only
  const headers = columns.map((col) => col.header);
  wsData.push(headers);

  // Add table data
  data.forEach((item) => {
    const row = columns.map((col) => {
      const value = item[col.key];
      return col.render ? col.render(value, item) : value ?? "-";
    });
    wsData.push(row);
  });

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: col.width || 15,
  }));
  ws["!cols"] = colWidths;

  // Style header row (first row is header)
  headers.forEach((_, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({
      r: 0,
      c: colIndex,
    });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// ==================== DOWNLOAD HELPER ====================
export function downloadExcel(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

// ==================== FORMAT HELPERS ====================
export function formatDateToDDMMYYYY(date: Date | null): string {
  if (!date) return "-";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function formatDateToIndonesian(date: Date | null): string {
  if (!date) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getDefaultFileName(prefix: string = "Export"): string {
  return `${prefix}_${formatDateTime()}.xlsx`;
}
