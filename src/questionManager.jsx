import { showStatusMessage } from "./utils.js";
import { initTiptapEditor } from "./editor.jsx";
import Sortable from "sortablejs";

let questionHistory = [];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("question-container");
  if (container && !container.dataset.sortableApplied) {
    Sortable.create(container, {
      handle: ".drag-handle",
      animation: 150,
      ghostClass: "opacity-50",
    });
    container.dataset.sortableApplied = true;
  }
});

export function createQuestionBlock(questionData = null) {
  const questionBox = document.createElement("div");
  questionBox.className = "question-box bg-gray-50 p-4 rounded-lg shadow-sm mt-4 relative cursor-move";

  questionBox.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-2">
        <span class="drag-handle text-xl cursor-grab hover:opacity-70">⋮⋮</span>
        <label class="block text-gray-700 font-medium">Enter Question:</label>
      </div>
      <button class="delete-question bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">🗑️</button>
    </div>

    <div class="editor-content border p-3 bg-white rounded mb-3" style="min-height: 150px;"></div>

    <div class="mt-3">
      <input type="file" class="question-image hidden" accept="image/*">
      <button class="upload-question-image bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">📷 Upload Image</button>
      <div class="question-image-preview mt-2">
        ${questionData?.image ? `<img src="${questionData.image}" class="w-24 h-24 object-cover">` : ""}
      </div>
    </div>

    <label class="block text-gray-700 font-medium mt-4">Difficulty Level:</label>
    <select class="difficulty w-full p-2 border border-gray-300 rounded-md mt-1">
      <option value="easy" ${questionData?.difficulty === "easy" ? "selected" : ""}>Easy</option>
      <option value="medium" ${questionData?.difficulty === "medium" ? "selected" : ""}>Medium</option>
      <option value="hard" ${questionData?.difficulty === "hard" ? "selected" : ""}>Hard</option>
    </select>
  `;

  document.getElementById("question-container").appendChild(questionBox);

  // ✅ Initialize Tiptap Editor
  const editorTarget = questionBox.querySelector(".editor-content");
  initTiptapEditor(editorTarget, questionData?.question || '');

  // 🖼️ Question Image Upload
  questionBox.querySelector(".upload-question-image").addEventListener("click", () => {
    questionBox.querySelector(".question-image").click();
  });
  questionBox.querySelector(".question-image").addEventListener("change", (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      questionBox.querySelector(".question-image-preview").innerHTML =
        `<img src="${ev.target.result}" class="w-24 h-24 object-cover">`;
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  // ❌ Delete Question
  questionBox.querySelector(".delete-question").addEventListener("click", () => {
    questionBox.remove();
    showStatusMessage("❌ Question deleted!", "error");
  });
}

export function undoLastAction() {
  const container = document.getElementById("question-container");
  if (questionHistory.length > 0) {
    const lastHTML = questionHistory.pop();
    container.insertAdjacentHTML("beforeend", lastHTML);
    showStatusMessage("🔄 Last action undone!");
  } else {
    showStatusMessage("⚠️ No action to undo!", "error");
  }
}
