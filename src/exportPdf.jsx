import { showStatusMessage, generateFileName } from "./utils.js";
import { getEditorHTML } from "./editor.jsx";
import "katex/dist/katex.min.css";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function setupPdfExport() {
  let exportPdfButton = document.getElementById("export-pdf");
  if (!exportPdfButton) return;

  const newButton = exportPdfButton.cloneNode(true);
  exportPdfButton.parentNode.replaceChild(newButton, exportPdfButton);
  exportPdfButton = newButton;

  exportPdfButton.addEventListener("click", async () => {
    try {
      const templateBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
      const templateDoc = await PDFDocument.load(templateBytes);
      const [templatePage] = await templateDoc.getPages();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const templatePageEmbed = await pdfDoc.embedPage(templatePage);

      const docTitle = document.getElementById("doc-title").value.trim() || "Untitled";
      const docAuthor = document.getElementById("doc-author").value.trim() || "Unknown";
      const docDate = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

      let pages = [];
      let y = 720;

      const addNewPage = () => {
        const page = pdfDoc.addPage([595, 842]);
        page.drawPage(templatePageEmbed);

        page.drawText(docTitle, {
          x: (595 - font.widthOfTextAtSize(docTitle, 16)) / 2,
          y: 790,
          size: 16,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Author: ${docAuthor}`, {
          x: 50,
          y: 770,
          size: 11,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Date: ${docDate}`, {
          x: 420,
          y: 770,
          size: 11,
          font,
          color: rgb(0, 0, 0),
        });

        pages.push(page);
        y = 720;
        return page;
      };

      let currentPage = addNewPage();

      const box = document.querySelector(".question-box");
      const html = getEditorHTML();
      const questionText = stripHtml(html);
      const difficulty = box?.querySelector(".difficulty")?.value || "medium";

      const lines = splitTextToLines(questionText, 90);

      currentPage.drawText(`1. (Difficulty: ${difficulty})`, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;

      lines.forEach((line) => {
        if (y < 100) currentPage = addNewPage();
        currentPage.drawText(line, {
          x: 60,
          y,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= 15;
      });

      pages.forEach((page, i) => {
        const footer = `Page ${i + 1}`;
        const width = font.widthOfTextAtSize(footer, 10);
        page.drawText(footer, {
          x: (595 - width) / 2,
          y: 30,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = generateFileName("pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showStatusMessage("✅ PDF exported with template!");
    } catch (err) {
      console.error("❌ PDF Export Error:", err);
      alert("Something went wrong while exporting PDF.");
    }
  });
}

// 🔤 Strip tags to export raw text
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 📏 Wrap lines if too long
function splitTextToLines(text, maxLength = 80) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  words.forEach(word => {
    if ((line + word).length <= maxLength) {
      line += word + ' ';
    } else {
      lines.push(line.trim());
      line = word + ' ';
    }
  });

  if (line.trim()) lines.push(line.trim());
  return lines;
}

setupPdfExport();
