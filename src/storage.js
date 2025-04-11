import { createQuestionBlock, ckeditors } from "./questionManager.jsx";
import { showStatusMessage } from "./utils.js";

// 💾 Save CKEditor-based content to localStorage
export function saveQuestionsToLocal() {
  const title = document.getElementById("doc-title").value.trim();
  const author = document.getElementById("doc-author").value.trim();
  const date = document.getElementById("doc-date").value;

  const questions = [];

  document.querySelectorAll(".question-box").forEach((box, index) => {
    const difficulty = box.querySelector(".difficulty")?.value || "medium";

    // Get question editor instance
    const questionEditor = ckeditors.find(
      (e) => e.container === box && e.type === "question"
    );
    const questionHTML = questionEditor ? questionEditor.editor.getData().trim() : "";

    // Get option editor instances
    const optionEditors = ckeditors.filter(
      (e) => e.container === box && e.type === "option"
    );
    const options = optionEditors.map((opt) => opt.editor.getData().trim());

    // Optional: store image base64 for question if exists
    const imgEl = box.querySelector(".question-image-preview img");
    const image = imgEl ? imgEl.src : "";

    questions.push({
      question_number: index + 1,
      question: questionHTML,
      difficulty,
      image,
      options,
    });
  });

  const dataToSave = { title, author, date, questions };
  localStorage.setItem("savedQuestions", JSON.stringify(dataToSave));
  showStatusMessage("✅ Progress saved successfully!");
}

// 🔄 Load from localStorage
export function loadSavedQuestions() {
  const savedData = JSON.parse(localStorage.getItem("savedQuestions"));
  if (!savedData) return;

  document.getElementById("doc-title").value = savedData.title || "";
  document.getElementById("doc-author").value = savedData.author || "";
  document.getElementById("doc-date").value = savedData.date || "";

  savedData.questions.forEach((q) => createQuestionBlock(q));
}

// ♻️ Reset everything
export function resetAll() {
  localStorage.removeItem("savedQuestions");
  document.getElementById("doc-title").value = "";
  document.getElementById("doc-author").value = "";
  document.getElementById("doc-date").value = "";
  document.getElementById("question-container").innerHTML = "";
  createQuestionBlock(); // Add a fresh block
  showStatusMessage("🔄 Page reset successfully!", "success");
}
