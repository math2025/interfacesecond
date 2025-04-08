import "../style.css";
import "./init.jsx"; // Load app logic

// ✅ Register MathLive globally (for WYSIWYG math editing)
import { MathfieldElement } from "mathlive";
customElements.define("math-field", MathfieldElement);

// ✅ Auto apply saved dark mode theme on hydration
const savedTheme = localStorage.getItem("theme");
const root = document.documentElement;
if (savedTheme === "dark") {
  root.classList.add("dark");
} else {
  root.classList.remove("dark");
}

// 🌓 Optional: Set correct icon on reload
const themeBtn = document.getElementById("theme-toggle-icon");
if (themeBtn) {
  themeBtn.textContent = savedTheme === "dark" ? "🌞" : "🌙";
}
