// src/ckeditorConfig.js
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MathType from "@wiris/mathtype-ckeditor5";

// Export the editor base
export const Editor = ClassicEditor;

// Export the plugin list
export const mathTypePlugins = [MathType, ...ClassicEditor.builtinPlugins];

// Export toolbars
export const questionToolbar = [
  "heading",
  "|",
  "bold",
  "italic",
  "link",
  "bulletedList",
  "numberedList",
  "|",
  "MathType",
  "ChemType",
  "|",
  "undo",
  "redo",
];

export const optionToolbar = [
  "bold",
  "italic",
  "|",
  "MathType",
  "ChemType",
  "|",
  "undo",
  "redo",
];
