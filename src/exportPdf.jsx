import { tiptapEditors } from "./editor.jsx";
import { showStatusMessage, generateFileName } from "./utils.js";
import "katex/dist/katex.min.css";

export async function setupPdfExport() {
  let exportPdfButton = document.getElementById("export-pdf");
  if (!exportPdfButton) return;

  const newButton = exportPdfButton.cloneNode(true);
  exportPdfButton.parentNode.replaceChild(newButton, exportPdfButton);
  exportPdfButton = newButton;

  exportPdfButton.addEventListener("click", async () => {
    try {
      const { PDFDocument, rgb, StandardFonts } = PDFLib;

      const templateBytes = await fetch("template.pdf").then((res) =>
        res.arrayBuffer()
      );
      const templateDoc = await PDFDocument.load(templateBytes);
      const [templatePage] = await templateDoc.getPages();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const templatePageEmbed = await pdfDoc.embedPage(templatePage);

      const docTitle =
        document.getElementById("doc-title").value.trim() || "Untitled";
      const docAuthor =
        document.getElementById("doc-author").value.trim() || "Unknown";
      const docDate =
        document.getElementById("doc-date").value ||
        new Date().toISOString().split("T")[0];

      let pages = [];
      let y = 720;

      const addNewPage = () => {
        const page = pdfDoc.addPage([595, 842]);
        page.drawPage(templatePageEmbed);

        const titleWidth = font.widthOfTextAtSize(docTitle, 16);
        page.drawText(docTitle, {
          x: (595 - titleWidth) / 2,
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

      const grouped = {};
      tiptapEditors.forEach((entry) => {
        const id = entry.container.dataset.qid || entry.container;
        if (!grouped[id]) grouped[id] = { options: [], container: entry.container };

        const data = stripHtml(entry.editor.getHTML());
        if (entry.type === "question") {
          grouped[id].question = data;
        } else {
          grouped[id].options[entry.index] = data;
        }
      });

      let index = 1;
      for (const q of Object.values(grouped)) {
        const difficulty = q.container.querySelector(".difficulty")?.value || "medium";
        const question = q.question || "";
        const options = q.options || [];

        const questionText = `${index}. ${question} (${difficulty})`;

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
          currentPage.drawText(`   (${label}) ${opt}`, {
            x: 70,
            y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
          y -= 15;
        });

        y -= 10;
        index++;
      }

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

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

setupPdfExport();
