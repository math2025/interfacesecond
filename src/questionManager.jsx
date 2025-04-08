import { showStatusMessage } from "./utils.js";
import Sortable from "sortablejs"; // ✅ New import

let questionHistory = [];

// 🔄 Initialize SortableJS once
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
  questionBox.classList.add(
    "question-box",
    "bg-gray-50",
    "p-4",
    "rounded-lg",
    "shadow-sm",
    "mt-4",
    "relative",
    "cursor-move"
  );

  // ✨ Drag handle
  questionBox.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-2">
        <span class="drag-handle text-xl cursor-grab hover:opacity-70">⋮⋮</span>
        <label class="block text-gray-700 font-medium">Enter Question:</label>
      </div>
      <button class="delete-question bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">🗑️</button>
    </div>

    <math-field class="question w-full border rounded p-2" virtual-keyboard-mode="manual">
      ${questionData?.question || ""}
    </math-field>

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

    <label class="block text-gray-700 font-medium mt-4">Options:</label>
    <div class="options-container mt-2">
      ${(questionData?.options?.length ? questionData.options : ["", ""]).map((opt) => `
        <div class="flex items-start space-x-2 option-block mb-3">
          <math-field class="option w-full border rounded p-2" virtual-keyboard-mode="manual">${opt}</math-field>
          <div class="flex flex-col space-y-1">
            <button class="remove-option bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">❌</button>
            <button class="upload-option-image bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 text-xs">📷</button>
            <input type="file" class="option-image hidden" accept="image/*">
            <div class="option-image-preview mt-1"></div>
          </div>
        </div>
      `).join("")}
    </div>

    <button class="add-option bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-600">+ Add Option</button>
  `;

  document.getElementById("question-container").appendChild(questionBox);

  // 🖼️ Image Upload - Question
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

  // ❌ Delete this question
  questionBox.querySelector(".delete-question").addEventListener("click", () => {
    questionBox.remove();
    showStatusMessage("❌ Question deleted!", "error");
  });

  // ➕ Add Option
  questionBox.querySelector(".add-option").addEventListener("click", () => {
    const optionsContainer = questionBox.querySelector(".options-container");

    const optionDiv = document.createElement("div");
    optionDiv.classList.add("flex", "items-start", "space-x-2", "option-block", "mb-3");

    optionDiv.innerHTML = `
      <math-field class="option w-full border rounded p-2" virtual-keyboard-mode="manual"></math-field>
      <div class="flex flex-col space-y-1">
        <button class="remove-option bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">❌</button>
        <button class="upload-option-image bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 text-xs">📷</button>
        <input type="file" class="option-image hidden" accept="image/*">
        <div class="option-image-preview mt-1"></div>
      </div>
    `;

    optionsContainer.appendChild(optionDiv);

    // 🖼️ Image upload
    optionDiv.querySelector(".upload-option-image").addEventListener("click", () => {
      optionDiv.querySelector(".option-image").click();
    });
    optionDiv.querySelector(".option-image").addEventListener("change", (e) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        optionDiv.querySelector(".option-image-preview").innerHTML =
          `<img src="${ev.target.result}" class="w-16 h-16 object-cover">`;
      };
      reader.readAsDataURL(e.target.files[0]);
    });

    attachRemoveOptionHandler(optionDiv);
  });

  // 🧹 Option delete setup
  questionBox.querySelectorAll(".option-block").forEach(attachRemoveOptionHandler);
}

// ❌ Option remove logic
function attachRemoveOptionHandler(optionDiv) {
  optionDiv.querySelector(".remove-option")?.addEventListener("click", () => {
    optionDiv.remove();
    showStatusMessage("❌ Option removed", "error");
  });
}

// 🔄 Undo Placeholder
export function undoLastAction() {
  const questionContainer = document.getElementById("question-container");
  if (questionHistory.length > 0) {
    const lastDeletedHTML = questionHistory.pop();
    questionContainer.insertAdjacentHTML("beforeend", lastDeletedHTML);
    showStatusMessage("🔄 Last action undone!");
  } else {
    showStatusMessage("⚠️ No action to undo!", "error");
  }
}
