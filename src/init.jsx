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

document.addEventListener("DOMContentLoaded", () => {
  // 🔁 Prevent duplicate execution
  if (window.scriptLoaded) return;
  window.scriptLoaded = true;

  console.log("✅ App Initialized with CKEditor + MathType");

  // 🧠 Load saved questions from localStorage
  loadSavedQuestions();

  // ➕ Add initial question if none exist
  const questionContainer = document.getElementById("question-container");
  if (questionContainer && questionContainer.children.length === 0) {
    createQuestionBlock();
  }

  // ➕ Add Question
  document.getElementById("add-question")?.addEventListener("click", () => {
    createQuestionBlock();
    showStatusMessage("✅ Question added!");
  });

  // 🔄 Undo
  document.getElementById("undo-action")?.addEventListener("click", () => {
    undoLastAction();
    showStatusMessage("🔄 Last action undone!");
  });

  // 💾 Save Progress
  document.getElementById("save-progress")?.addEventListener("click", () => {
    saveQuestionsToLocal();
    showStatusMessage("✅ Progress saved!");
  });

  // ♻️ Reset
  document.getElementById("reset-page")?.addEventListener("click", () => {
    if (confirm("⚠️ Are you sure you want to reset everything?")) {
      resetAll();
      showStatusMessage("🔄 Page reset.");
    }
  });

  // 📤 Setup export handlers (JSON, LaTeX, PDF)
  setupExportListeners();
  setupLatexExport();
  setupPdfExport();
});
