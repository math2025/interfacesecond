import { getEditorJson } from './editor.jsx';

export function setupExportListeners() {
  const exportJsonButton = document.getElementById("export-json");

  // Avoid duplicate listeners
  const newExportJsonButton = exportJsonButton.cloneNode(true);
  exportJsonButton.parentNode.replaceChild(newExportJsonButton, exportJsonButton);

  newExportJsonButton.addEventListener("click", () => {
    const title = document.getElementById("doc-title").value.trim() || "Untitled";
    const author = document.getElementById("doc-author").value.trim() || "Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    const questionBox = document.querySelector(".question-box");
    if (!questionBox) return alert("No question found!");

    const editorContainer = questionBox.querySelector(".editor-content");
    const content = getEditorJson(); // from editor.jsx

    const difficulty = questionBox.querySelector(".difficulty")?.value || "medium";

    const jsonData = {
      title,
      author,
      date,
      questions: [
        {
          question_number: 1,
          difficulty,
          content_json: content,
        },
      ],
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_${author.replace(/\s+/g, "_")}_${date}.json`;
    link.click();
  });
}
