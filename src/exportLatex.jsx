import { ckeditors } from "./editor.jsx";

export function setupLatexExport() {
  const exportLatexButton = document.getElementById("export-latex");

  const newExportLatexButton = exportLatexButton.cloneNode(true);
  exportLatexButton.parentNode.replaceChild(newExportLatexButton, exportLatexButton);

  newExportLatexButton.addEventListener("click", () => {
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
      const questionEditor = ckeditors.find(
        (e) => e.type === "question" && e.editor.sourceElement.closest(".question-box") === box
      );
      const questionHTML = questionEditor ? questionEditor.editor.getData() : "";
      const questionLatex = htmlToLatex(questionHTML);

      const difficulty = box.querySelector(".difficulty")?.value || "medium";

      const optionEditors = ckeditors.filter(
        (e) => e.type === "option" && e.editor.sourceElement.closest(".question-box") === box
      );
      const options = optionEditors.map((e) => htmlToLatex(e.editor.getData()));

      latexContent += `
\\item \\textbf{Question:} ${questionLatex} \\textbf{(${difficulty.toUpperCase()})}
\\begin{enumerate}[label=(\\alph*)]
`;
      options.forEach(opt => {
        latexContent += `\\item ${opt}\n`;
      });

      latexContent += `\\end{enumerate}\n`;
    });

    latexContent += `\\end{enumerate}\n\\end{document}`;

    const blob = new Blob([latexContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_${author.replace(/\s+/g, "_")}_${date}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// 🔁 Convert CKEditor HTML to LaTeX
function htmlToLatex(html) {
  let output = html;

  // Replace MathML or inline equations if available
  output = output.replace(/<math[^>]*?>.*?<\/math>/gs, (match) => {
    return `\\[${escapeLatex(match)}\\]`; // fallback: wrap math in LaTeX display math
  });

  // Convert basic formatting (bold, italic, etc.)
  output = output.replace(/<strong>(.*?)<\/strong>/g, "\\textbf{$1}");
  output = output.replace(/<b>(.*?)<\/b>/g, "\\textbf{$1}");
  output = output.replace(/<em>(.*?)<\/em>/g, "\\textit{$1}");
  output = output.replace(/<i>(.*?)<\/i>/g, "\\textit{$1}");

  // Remove all other HTML tags
  output = output.replace(/<\/?[^>]+(>|$)/g, "");

  return escapeLatex(output.trim());
}

// 🔐 Escape special LaTeX characters
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

setupLatexExport();
