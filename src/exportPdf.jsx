import { showStatusMessage, generateFileName } from "./utils.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ckeditors } from "./editor.jsx";

export async function setupPdfExport() {
  const exportPdfButton = document.getElementById("export-pdf");
  if (!exportPdfButton) return;

  const newButton = exportPdfButton.cloneNode(true);
  exportPdfButton.parentNode.replaceChild(newButton, exportPdfButton);

  newButton.addEventListener("click", async () => {
    try {
      // Load PDF template
      const templateBytes = await fetch("/template.pdf").then(res => res.arrayBuffer());
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

        // Header
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

      // Group CKEditor instances
      const grouped = {};
      ckeditors.forEach(({ type, editor }) => {
        const container = editor.sourceElement.closest(".question-box");
        if (!container) return;

        if (!grouped[container]) {
          grouped[container] = { container, question: "", options: [] };
        }

        if (type === "question") {
          grouped[container].question = editor.getData();
        } else if (type === "option") {
          grouped[container].options.push(editor.getData());
        }
      });

      let questionNumber = 1;
      for (const key in grouped) {
        const { container, question, options } = grouped[key];
        const difficulty = container.querySelector(".difficulty")?.value || "medium";
        const questionText = `${questionNumber}. ${stripHtml(question)} (${difficulty})`;

        if (y < 120) currentPage = addNewPage();

        currentPage.drawText(questionText, {
          x: 50,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 20;

        options.forEach((opt, i) => {
          const label = String.fromCharCode(97 + i); // a, b, c...
          currentPage.drawText(`   (${label}) ${stripHtml(opt)}`, {
            x: 70,
            y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
          y -= 15;
        });

        y -= 10;
        questionNumber++;
      }

      // Add page numbers
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

      // Save & Download
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

// 🧽 Clean HTML tags to plain text
function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

setupPdfExport();
