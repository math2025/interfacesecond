// exportJson.jsx

export function setupExportListeners() {
  const exportJsonButton = document.getElementById("export-json");

  // Remove duplicate listeners safely
  const newExportJsonButton = exportJsonButton.cloneNode(true);
  exportJsonButton.parentNode.replaceChild(newExportJsonButton, exportJsonButton);

  newExportJsonButton.addEventListener("click", () => {
    const title = document.getElementById("doc-title").value.trim() || "Untitled";
    const author = document.getElementById("doc-author").value.trim() || "Author";
    const date = document.getElementById("doc-date").value || new Date().toISOString().split("T")[0];

    const questions = [];

    document.querySelectorAll(".question-box").forEach((box, index) => {
      const questionField = box.querySelector("math-field.question");
      const question = questionField ? questionField.value.trim() : "";

      const difficulty = box.querySelector(".difficulty").value;

      const options = [];
      box.querySelectorAll("math-field.option").forEach((optField) => {
        options.push(optField.value.trim());
      });

      questions.push({
        question_number: index + 1,
        question,
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
