// editor.jsx
import 'mathlive';

// Store global reference to fields if needed
export let mathFields = [];

export function createMathEditor(element, type, container, index = null, content = "") {
  if (!element) return;

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.classList.add("editor-wrapper", "mb-4");

  // Create <math-field>
  const mathField = document.createElement("math-field");
  mathField.setAttribute("virtual-keyboard-mode", "onfocus");
  mathField.className = "w-full bg-white border border-gray-300 p-2 rounded";
  mathField.style.minHeight = type === "question" ? "120px" : "60px";
  mathField.value = content;

  // Optional: Preview
  const preview = document.createElement("div");
  preview.className = "katex-preview mt-2 p-2 border border-dashed rounded text-sm bg-gray-50";
  preview.innerHTML = "<em>Live equation will show here</em>";

  // Update preview on input
  mathField.addEventListener("input", () => {
    preview.innerHTML = mathField.getValue("latex-expanded");
    renderMathInElement(preview, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  });

  // Insert wrapper with math field and preview
  wrapper.appendChild(mathField);
  wrapper.appendChild(preview);
  element.appendChild(wrapper);

  mathFields.push({ type, mathField, container, index });
}
