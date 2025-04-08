// editor.jsx

import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import MathExtension from "@aarkue/tiptap-math-extension";
import "katex/dist/katex.min.css";
import { HighlightLatex } from "./highlightLatex.js";

export let tiptapEditors = [];

const mathTemplates = [
  { label: "Fraction", latex: "$$\\frac{a}{b}$$" },
  { label: "Square Root", latex: "$$\\sqrt{x}$$" },
  { label: "Summation", latex: "$$\\sum_{i=1}^{n} i$$" },
  { label: "Integral", latex: "$$\\int_a^b x^2 dx$$" },
  { label: "Limit", latex: "$$\\lim_{x \\to \\infty} f(x)$$" },
  { label: "Quadratic", latex: "$$ax^2 + bx + c = 0$$" },
  { label: "Pythagoras", latex: "$$x^2 + y^2 = z^2$$" },
];

export function createTiptapEditor(element, type, container, index = null, content = "") {
  if (!element) return;

  const wrapper = document.createElement("div");
  wrapper.classList.add("editor-wrapper", "mb-5", "relative");

  const mathButton = document.createElement("button");
  mathButton.textContent = "➕ Math Equation";
  mathButton.className =
    "mb-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 border border-blue-300";

  const dropdown = document.createElement("div");
  dropdown.className = "math-dropdown hidden absolute z-10 bg-white border border-gray-300 rounded shadow mt-1";
  dropdown.style.minWidth = "200px";

  // KaTeX Preview Area
  const previewBox = document.createElement("div");
  previewBox.className = "katex-preview mt-3 p-3 border border-dashed rounded bg-gray-50 text-sm text-gray-800";
  previewBox.innerHTML = "<em>Live equation preview will appear here...</em>";

  // Dropdown buttons
  mathTemplates.forEach((item) => {
    const btn = document.createElement("button");
    btn.textContent = item.label;
    btn.className = "w-full text-left px-3 py-2 hover:bg-blue-50 text-sm";
    btn.addEventListener("click", () => {
      editor.commands.insertContent(item.latex);
      dropdown.classList.add("hidden");
    });
    dropdown.appendChild(btn);
  });

  mathButton.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("hidden");
  });

  // Place elements
  const parent = element.parentNode;
  parent.replaceChild(wrapper, element);
  wrapper.appendChild(mathButton);
  wrapper.appendChild(dropdown);
  wrapper.appendChild(element);
  wrapper.appendChild(previewBox);

  const editor = new Editor({
    element,
    content,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: type === "question" ? "Write your question..." : "Write an option...",
      }),
      MathExtension.configure({ evaluation: true }),
      HighlightLatex,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm p-2 border border-gray-300 rounded min-h-[80px] bg-white",
      },
    },
    onUpdate: () => {
      // Render inside editor
      renderMathInElement(element, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });

      // Render preview pane
      previewBox.innerHTML = element.innerHTML;
      renderMathInElement(previewBox, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    },
    onCreate: () => {
      renderMathInElement(element, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    },
  });

  tiptapEditors.push({ type, editor, container, index });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}
