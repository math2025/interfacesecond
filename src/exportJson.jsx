import { ckeditors } from "./editor.jsx";

export function setupExportListeners() {
  const exportJsonButton = document.getElementById("export-json");

  // 🔄 Replace to prevent duplicate listeners
  const newExportJsonButton = exportJsonButton.cloneNode(true);
  exportJsonButton.parentNode.replaceChild(newExportJsonButton, exportJsonButton);

  newExportJsonButton.addEventListener("click", () => {
    const title = document.getElementById("doc-title").value.trim() || "Untitled";
    const author = document.getElementById("doc-author").value.trim() || "Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    const questions = [];

    document.querySelectorAll(".question-box").forEach((box, index) => {
      const difficulty = box.querySelector(".difficulty")?.value || "medium";

      // 🧠 Find the CKEditor instance for this question
      const questionEditorEntry = ckeditors.find(
        (entry) => entry.type === "question" && entry.editor.sourceElement.closest(".question-box") === box
      );
      const questionHTML = questionEditorEntry ? questionEditorEntry.editor.getData().trim() : "";

      // 🧠 Find option editors within this box
      const optionEditors = ckeditors.filter(
        (entry) => entry.type === "option" && entry.editor.sourceElement.closest(".question-box") === box
      );

      const options = optionEditors.map((entry) => entry.editor.getData().trim());

      questions.push({
        question_number: index + 1,
        question: questionHTML,
        difficulty,
        options,
      });
    });

    const jsonData = { title, author, date, questions };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_${author.replace(/\s+/g, "_")}_${date}.json`;
    link.click();
  });
}
