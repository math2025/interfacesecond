import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

export let tiptapEditor = null;

export function initTiptapEditor(targetElement, content = '') {
  if (!targetElement) return;

  tiptapEditor = new Editor({
    element: targetElement,
    extensions: [StarterKit],
    content:
      content ||
      '<p>You can type English and use $inline \\text{math}$ or $$\\frac{a}{b}$$ for block math.</p>',
    onUpdate: ({ editor }) => {
      // Render math expressions live
      renderMathInElement(targetElement, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    },
  });

  // Save reference inside DOM for later access (e.g., save/load/export)
  targetElement.__tiptapEditor = tiptapEditor;

  // Initial math render
  renderMathInElement(targetElement, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}

export function getEditorJson() {
  return tiptapEditor?.getJSON();
}

export function getEditorHTML() {
  return tiptapEditor?.getHTML();
}
