import { getEditorHTML } from './editor.jsx';

export function setupLatexExport() {
  const exportLatexButton = document.getElementById("export-latex");

  const newExportLatexButton = exportLatexButton.cloneNode(true);
  exportLatexButton.parentNode.replaceChild(newExportLatexButton, exportLatexButton);

  newExportLatexButton.addEventListener("click", () => {
    const title = document.getElementById("doc-title").value.trim() || "Math Questions";
    const author = document.getElementById("doc-author").value.trim() || "Unknown Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    // Get question content from Tiptap editor
    const contentHTML = getEditorHTML();
    const difficulty = document.querySelector(".question-box .difficulty")?.value || "medium";

    const questionLatex = convertHTMLToLatex(contentHTML);

    const latexContent = `
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

\\item \\textbf{(${difficulty.toUpperCase()})}
${questionLatex}

\\end{enumerate}
\\end{document}
`;

    const blob = new Blob([latexContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_${author.replace(/\s+/g, "_")}_${date}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

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

// 🧠 Convert basic HTML from Tiptap to LaTeX
function convertHTMLToLatex(html) {
  return html
    .replace(/<p>(.*?)<\/p>/g, (_, text) => escapeLatex(text) + '\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, (_, text) => `\\textbf{${escapeLatex(text)}}`)
    .replace(/<em>(.*?)<\/em>/g, (_, text) => `\\textit{${escapeLatex(text)}}`)
    .replace(/<ul>(.*?)<\/ul>/gs, (_, list) => {
      const items = list.match(/<li>(.*?)<\/li>/g) || [];
      const converted = items.map(item => `\\item ${escapeLatex(item.replace(/<\/?li>/g, ""))}`).join('\n');
      return `\\begin{itemize}\n${converted}\n\\end{itemize}`;
    })
    .replace(/<ol>(.*?)<\/ol>/gs, (_, list) => {
      const items = list.match(/<li>(.*?)<\/li>/g) || [];
      const converted = items.map(item => `\\item ${escapeLatex(item.replace(/<\/?li>/g, ""))}`).join('\n');
      return `\\begin{enumerate}\n${converted}\n\\end{enumerate}`;
    })
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?[^>]+>/g, ''); // Remove any leftover tags
}
