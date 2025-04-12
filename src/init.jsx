import { setupExportListeners } from "./exportJson.jsx";
import { setupLatexExport } from "./exportLatex.jsx";
import { setupPdfExport } from "./exportPdf.jsx";
import { createQuestionBlock, undoLastAction } from "./questionManager.jsx";
import {
  loadSavedQuestions,
  saveQuestionsToLocal,
  resetAll,
} from "./storage.js";
import { showStatusMessage } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Avoid duplicate initialization
  if (window.scriptLoaded) return;
  window.scriptLoaded = true;

  console.log("✅ App Initialized with Tiptap");

  // Load saved questions from localStorage
  loadSavedQuestions();

  // Add a default question block if none exist
  const questionContainer = document.getElementById("question-container");
  if (questionContainer && questionContainer.children.length === 0) {
    createQuestionBlock();
  }

  // ➕ Add Question Button
  document.getElementById("add-question")?.addEventListener("click", () => {
    createQuestionBlock();
    showStatusMessage("✅ Question added!");
  });

  // 🔄 Undo Button
  document.getElementById("undo-action")?.addEventListener("click", () => {
    undoLastAction();
    showStatusMessage("🔄 Last action undone!");
  });

  // 💾 Save Button
  document.getElementById("save-progress")?.addEventListener("click", () => {
    saveQuestionsToLocal();
    showStatusMessage("✅ Progress saved successfully!");
  });

  // ♻️ Reset Page Button
  document.getElementById("reset-page")?.addEventListener("click", () => {
    if (confirm("⚠️ Are you sure you want to reset everything?")) {
      resetAll();
      showStatusMessage("🔄 Page reset successfully!");
    }
  });

  // 🧾 Setup Export Handlers
  setupExportListeners();  // JSON
  setupLatexExport();      // LaTeX
  setupPdfExport();        // PDF
});
