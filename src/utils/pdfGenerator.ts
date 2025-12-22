import { PDFDocument, StandardFonts, rgb, degrees, PDFPage } from "pdf-lib";

// ==================== TYPES ====================
export interface PDFColumn {
  header: string;
  key: string;
  width: number;
  render?: (value: any, item: any) => string;
  align?: "left" | "center" | "right";
}

export interface PDFHeaderInfo {
  left: Array<{ label: string; value: string }>;
  right: Array<{ label: string; value: string }>;
}

export interface PDFSignature {
  positions: Array<{
    name: string;
    title: string;
    x: number;
  }>;
}

export interface PDFGeneratorOptions {
  title: string;
  data: any[];
  columns: PDFColumn[];
  headerInfo?: PDFHeaderInfo;
  signatures?: PDFSignature;
  fileName?: string;
  orientation?: "landscape" | "portrait";
  watermarkImagePath?: string;
  watermarkText?: string;
  customPageSize?: [number, number];
  titleSize?: number;
}

// ==================== HELPER FUNCTIONS ====================
const formatDateTime = () => {
  const now = new Date();
  const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return {
    dayName,
    dateStr: `${dd}-${mm}-${yyyy}`,
    timeStr: `${hh}:${min}:${ss}`,
    fullDateTime: `${dayName}, ${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`,
  };
};

const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  font: any
): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (textWidth <= maxWidth - 8) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // If a single word is too long, break it into chunks without truncation
        const wordWidth = font.widthOfTextAtSize(word, fontSize);
        if (wordWidth > maxWidth - 8) {
          let remainingWord = word;
          while (remainingWord.length > 0) {
            let chunkSize = remainingWord.length;
            let chunk = remainingWord;
            
            // Find the maximum chunk that fits
            while (chunkSize > 0 && font.widthOfTextAtSize(chunk, fontSize) > maxWidth - 8) {
              chunkSize--;
              chunk = remainingWord.substring(0, chunkSize);
            }
            
            if (chunkSize === 0) {
              // If even a single character doesn't fit, take at least one character
              chunkSize = 1;
              chunk = remainingWord.substring(0, 1);
            }
            
            lines.push(chunk);
            remainingWord = remainingWord.substring(chunkSize);
          }
        } else {
          currentLine = word;
        }
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
};

// ==================== MAIN PDF GENERATOR ====================
export async function generatePDF(options: PDFGeneratorOptions): Promise<Blob> {
  const {
    title,
    data,
    columns,
    headerInfo,
    signatures,
    fileName,
    orientation = "landscape",
    watermarkImagePath = "", // Removed logo for demo
    watermarkText,
    customPageSize,
    titleSize = 18,
  } = options;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page dimensions
  const pageSize: [number, number] = customPageSize ||
    (orientation === "landscape" ? [995, 595.28] : [595.28, 841.89]);
  const pageWidth = pageSize[0];
  const pageHeight = pageSize[1];

  // Load watermark image
  const watermarkImage = await (async () => {
    try {
      const imageBytes = await fetch(watermarkImagePath).then((res) =>
        res.arrayBuffer()
      );
      return await pdfDoc.embedPng(imageBytes);
    } catch {
      return null;
    }
  })();

  const { dateStr, timeStr, dayName } = formatDateTime();
  const defaultWatermarkText = watermarkText || `${dayName} / ${dateStr} / ${timeStr}`;

  // Watermark function
  const applyWatermark = (targetPage: PDFPage) => {
    if (!watermarkImage) return;

    const spacing = 180;
    const watermarkWidth = 230;
    const watermarkHeight = 40;

    for (let x = -pageWidth; x < pageWidth * 2; x += spacing) {
      for (let yPos = -pageHeight; yPos < pageHeight * 2; yPos += spacing) {
        targetPage.drawImage(watermarkImage, {
          x,
          y: yPos,
          width: watermarkWidth,
          height: watermarkHeight,
          rotate: degrees(45),
          opacity: 0.08,
        });

        targetPage.drawText(defaultWatermarkText, {
          x: x + 10,
          y: yPos - 10,
          size: 12,
          rotate: degrees(45),
          opacity: 0.08,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
  };

  let page = pdfDoc.addPage(pageSize);
  let y = pageHeight - 50;

  const createNewPage = (): PDFPage => {
    const newPage = pdfDoc.addPage(pageSize);
    y = pageHeight - 50;
    applyWatermark(newPage);
    return newPage;
  };

  applyWatermark(page);

  // Title
  const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (pageWidth - titleWidth) / 2,
    y,
    size: titleSize,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.8),
  });

  y -= 40;

  // Header information
  if (headerInfo) {
    // Calculate total table width for alignment
    const totalTableWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const tableStartX = (pageWidth - totalTableWidth) / 2;
    const tableEndX = tableStartX + totalTableWidth;
    
    const lineHeight = 18;
    const maxLines = Math.max(
      headerInfo.left.length,
      headerInfo.right.length
    );

    for (let i = 0; i < maxLines; i++) {
      // Left side - align with table start
      if (headerInfo.left[i]) {
        const { label, value } = headerInfo.left[i];
        page.drawText(label, { x: tableStartX, y, size: 10, font: boldFont });
        const labelWidth = boldFont.widthOfTextAtSize(label, 10);
        page.drawText(value, {
          x: tableStartX + labelWidth,
          y,
          size: 10,
          font,
        });
      }

      // Right side - align with table end
      if (headerInfo.right[i]) {
        const { label, value } = headerInfo.right[i];
        const labelWidth = boldFont.widthOfTextAtSize(label, 10);
        const valueWidth = font.widthOfTextAtSize(value, 10);
        const totalWidth = labelWidth + valueWidth;

        page.drawText(label, {
          x: tableEndX - totalWidth,
          y,
          size: 10,
          font: boldFont,
        });
        page.drawText(value, {
          x: tableEndX - totalWidth + labelWidth,
          y,
          size: 10,
          font,
        });
      }

      y -= lineHeight;
    }
  }

  y -= 20;

  // Table headers - increased height for multi-line support
  const headerRowHeight = 30;
  const dataRowHeight = 20;
  const marginLeft = 30;
  const marginRight = 30;
  
  // Calculate total table width
  const totalTableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
  // Center the table
  const tableStartX = (pageWidth - totalTableWidth) / 2;
  let x = tableStartX;

  columns.forEach((col, i) => {
    page.drawRectangle({
      x,
      y,
      width: col.width,
      height: headerRowHeight,
      color: rgb(0.2, 0.4, 0.8),
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 0.5,
    });

    // Wrap header text if needed
    const headerLines = wrapText(col.header, col.width, 8, boldFont);
    const lineHeight = 10;
    const totalTextHeight = headerLines.length * lineHeight;
    const startY = y + (headerRowHeight + totalTextHeight) / 2 - lineHeight;

    headerLines.forEach((line, lineIndex) => {
      const headerTextWidth = boldFont.widthOfTextAtSize(line, 8);
      let textX = x + 4; // default left align
      
      if (col.align === "center") {
        textX = x + (col.width - headerTextWidth) / 2;
      } else if (col.align === "right") {
        textX = x + col.width - headerTextWidth - 4;
      }

      page.drawText(line, {
        x: textX,
        y: startY - (lineIndex * lineHeight),
        size: 8,
        font: boldFont,
        color: rgb(1, 1, 1),
      });
    });

    x += col.width;
  });

  // Table data
  data.forEach((item, index) => {
    const rowData = columns.map((col) => {
      const value = item[col.key];
      return col.render ? col.render(value, item) : String(value || "-");
    });

    // Calculate wrapped text and row height
    const wrappedTexts = rowData.map((text, i) =>
      wrapText(String(text), columns[i].width, 8, font)
    );
    const maxLines = Math.max(...wrappedTexts.map((lines) => lines.length));
    const dynamicRowHeight = Math.max(dataRowHeight, maxLines * 12);

    // Check if new page needed
    if (y - dynamicRowHeight < 60) {
      page = createNewPage();
      y -= 40;
    }

    let rowX = tableStartX;

    // Draw table row
    wrappedTexts.forEach((lines, i) => {
      // Draw border only, no background fill to show watermark
      page.drawRectangle({
        x: rowX,
        y: y - dynamicRowHeight,
        width: columns[i].width,
        height: dynamicRowHeight,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 0.5,
      });

      // Calculate vertical centering
      const totalTextHeight = lines.length * 12;
      const verticalOffset = (dynamicRowHeight - totalTextHeight) / 2;
      
      lines.forEach((line, lineIndex) => {
        const textY = y - verticalOffset - 8 - lineIndex * 12;
        
        // Calculate text position based on alignment
        const lineTextWidth = font.widthOfTextAtSize(line, 8);
        let textX = rowX + 4; // default left align
        
        if (columns[i].align === "center") {
          textX = rowX + (columns[i].width - lineTextWidth) / 2;
        } else if (columns[i].align === "right") {
          textX = rowX + columns[i].width - lineTextWidth - 4;
        }
        
        page.drawText(line, {
          x: textX,
          y: textY,
          size: 8,
          font,
          color: rgb(0, 0, 0),
        });
      });

      rowX += columns[i].width;
    });

    y -= dynamicRowHeight;
  });

  // Signatures
  if (signatures) {
    y -= 40;

    signatures.positions.forEach((sig, index) => {
      const label = index === 0 ? "Dibuat oleh," : "Mengetahui,";
      page.drawText(label, {
        x: sig.x,
        y,
        size: 10,
        font,
      });
    });

    y -= 80;

    signatures.positions.forEach((sig) => {
      page.drawText(`(${sig.name})`, {
        x: sig.x,
        y,
        size: 10,
        font,
      });
    });

    y -= 15;

    signatures.positions.forEach((sig) => {
      page.drawText(sig.title, {
        x: sig.x,
        y,
        size: 10,
        font,
      });
    });
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

// ==================== DOWNLOAD HELPER ====================
export function downloadPDF(blob: Blob, fileName: string) {
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
