import { showStatusMessage, generateFileName } from "./utils.js";
import "katex/dist/katex.min.css";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";


export async function setupPdfExport() {
  let exportPdfButton = document.getElementById("export-pdf");
  if (!exportPdfButton) return;

  const newButton = exportPdfButton.cloneNode(true);
  exportPdfButton.parentNode.replaceChild(newButton, exportPdfButton);
  exportPdfButton = newButton;
  console.log("111");

  exportPdfButton.addEventListener("click", async () => {
    console.log("222");
    try {
     // const { PDFDocument, rgb, StandardFonts } = PDFLib;
     
      const templateBytes = await fetch("template.pdf").then((res) => res.arrayBuffer());
      console.log("333");
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

      const questionBoxes = document.querySelectorAll(".question-box");

      questionBoxes.forEach((box, index) => {
        const questionField = box.querySelector("math-field.question");
        const questionLatex = questionField?.value?.trim() || "";
        const difficulty = box.querySelector(".difficulty")?.value || "medium";

        const options = [];
        box.querySelectorAll("math-field.option").forEach((opt) => {
          options.push(opt.value.trim());
        });

        const questionText = `${index + 1}. ${stripLatex(questionLatex)} (${difficulty})`;

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
          const label = String.fromCharCode(97 + i);
          currentPage.drawText(`   (${label}) ${stripLatex(opt)}`, {
            x: 70,
            y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
          y -= 15;
        });

        y -= 10;
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

// 🧽 Strip LaTeX commands for plain fallback
function stripLatex(latex) {
  return latex
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}$]/g, "")
    .replace(/_/g, " ")
    .trim();
}

setupPdfExport();
