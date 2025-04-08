import { tiptapEditors } from "./editor.jsx";
import MathExtension from "@aarkue/tiptap-math-extension";
import "katex/dist/katex.min.css";

export function setupLatexExport() {
  const exportLatexButton = document.getElementById("export-latex");

  // ✅ Prevent duplicate bindings
  const newExportLatexButton = exportLatexButton.cloneNode(true);
  exportLatexButton.parentNode.replaceChild(newExportLatexButton, exportLatexButton);

  newExportLatexButton.addEventListener("click", () => {
    console.log("📜 Exporting LaTeX...");

    const title = document.getElementById("doc-title").value.trim() || "Math Questions";
    const author = document.getElementById("doc-author").value.trim() || "Unknown Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    let latexContent = `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{enumitem}
\\usepackage[margin=1in]{geometry}
\\title{${escapeLatex(title)}}
\\author{${escapeLatex(author)}}
\\date{${date}}
\\begin{document}
\\maketitle
\\begin{enumerate}
`;

    document.querySelectorAll(".question-box").forEach((box, index) => {
      const questionEditorInstance = tiptapEditors.find(
        (editor) => editor.container === box && editor.type === "question"
      );

      const question = questionEditorInstance
        ? escapeLatex(stripHtml(questionEditorInstance.editor.getHTML()))
        : "";

      const difficulty = box.querySelector(".difficulty")?.value || "medium";

      const options = [];
      box.querySelectorAll(".ck-option").forEach((optionDiv) => {
        const optionEditorInstance = tiptapEditors.find(
          (editor) =>
            editor.container === box &&
            editor.type === "option" &&
            editor.editor.options.element === optionDiv
        );
        if (optionEditorInstance) {
          const rawHtml = optionEditorInstance.editor.getHTML();
          options.push(escapeLatex(stripHtml(rawHtml)));
        }
      });

      if (question) {
        latexContent += `
\\item \\textbf{Question:} ${question} \\textbf{(${difficulty.toUpperCase()})}
\\begin{enumerate}[label=(\\alph*)]
`;
        options.forEach((option) => {
          latexContent += `\\item ${option}\n`;
        });

        latexContent += `\\end{enumerate}\n`;
      }
    });

    latexContent += `\\end{enumerate}\n\\end{document}`;

    const blob = new Blob([latexContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_${author.replace(/\s+/g, "_")}_${date}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ LaTeX file exported successfully!");
  });
}

// 🔐 Escape LaTeX special characters
function escapeLatex(str) {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/_/g, "\\_")
    .replace(/\$/g, "\\$")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}");
}

// 🧹 Strip HTML safely
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

setupLatexExport();
