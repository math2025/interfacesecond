import { createQuestionBlock } from "./questionManager.jsx";
import { tiptapEditors } from "./questionManager.jsx";
import { showStatusMessage } from "./utils.js";

export function saveQuestionsToLocal() {
  const title = document.getElementById("doc-title").value.trim();
  const author = document.getElementById("doc-author").value.trim();
  const date = document.getElementById("doc-date").value;

  const questions = [];

  document.querySelectorAll(".question-box").forEach((box, index) => {
    const questionEditorInstance = tiptapEditors.find(
      (editor) => editor.container === box && editor.type === "question"
    );
    const questionContent = questionEditorInstance
      ? questionEditorInstance.editor.getHTML()
      : "";

    const difficulty = box.querySelector(".difficulty").value;

    const options = [];
    box.querySelectorAll(".tiptap-option").forEach((optEl) => {
      const optionEditorInstance = tiptapEditors.find(
        (editor) =>
          editor.container === box &&
          editor.type === "option" &&
          editor.editor.options.element === optEl
      );
      options.push(optionEditorInstance ? optionEditorInstance.editor.getHTML() : "");
    });

    questions.push({
      question_number: index + 1,
      question: questionContent,
      difficulty,
      options,
    });
  });

  const dataToSave = { title, author, date, questions };
  localStorage.setItem("savedQuestions", JSON.stringify(dataToSave));
  showStatusMessage("✅ Progress saved successfully!");
}

export function loadSavedQuestions() {
  const savedData = JSON.parse(localStorage.getItem("savedQuestions"));
  if (!savedData) return;

  document.getElementById("doc-title").value = savedData.title || "";
  document.getElementById("doc-author").value = savedData.author || "";
  document.getElementById("doc-date").value = savedData.date || "";

  savedData.questions.forEach((q) => createQuestionBlock(q));
}

export function resetAll() {
  localStorage.removeItem("savedQuestions");
  document.getElementById("doc-title").value = "";
  document.getElementById("doc-author").value = "";
  document.getElementById("doc-date").value = "";
  document.getElementById("question-container").innerHTML = "";
  createQuestionBlock();
  showStatusMessage("🔄 Page reset successfully!", "success");
}
