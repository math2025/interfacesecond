//exportjson.jsx
import { tiptapEditors } from "./editor.jsx";

export function setupExportListeners() {
  const exportJsonButton = document.getElementById("export-json");

  // 🔁 Replace to remove duplicate listeners
  const newExportJsonButton = exportJsonButton.cloneNode(true);
  exportJsonButton.parentNode.replaceChild(newExportJsonButton, exportJsonButton);

  newExportJsonButton.addEventListener("click", () => {
    const title = document.getElementById("doc-title").value.trim() || "Untitled";
    const author = document.getElementById("doc-author").value.trim() || "Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    const questions = [];

    document.querySelectorAll(".question-box").forEach((box, index) => {
      // 📝 Get question HTML from Tiptap instance
      const questionEditorInstance = tiptapEditors.find(
        (editor) => editor.container === box && editor.type === "question"
      );

      const question = questionEditorInstance
        ? questionEditorInstance.editor.getHTML().trim()
        : "";

      const difficulty = box.querySelector(".difficulty").value;

      // ✅ Get options HTML from Tiptap
      const options = [];
      box.querySelectorAll(".ck-option").forEach((optionDiv) => {
        const optionEditorInstance = tiptapEditors.find(
          (editor) =>
            editor.container === box &&
            editor.type === "option" &&
            editor.editor.options.element === optionDiv
        );
        if (optionEditorInstance) {
          options.push(optionEditorInstance.editor.getHTML().trim());
        } else {
          options.push("");
        }
      });

      questions.push({
        question_number: index + 1,
        question,
        difficulty,
        options,
      });
    });

    // 📁 Prepare and download JSON
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
