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

    const boxes = document.querySelectorAll(".question-box");

    boxes.forEach((box, index) => {
      const questionField = box.querySelector("math-field.question");
      const question = questionField ? escapeLatex(questionField.value.trim()) : "";

      const difficulty = box.querySelector(".difficulty")?.value || "medium";

      const options = [];
      box.querySelectorAll("math-field.option").forEach((optionField) => {
        const opt = optionField.value.trim();
        options.push(escapeLatex(opt));
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
  });
}

// 🔐 Escape LaTeX characters safely
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
