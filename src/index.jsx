import "../style.css";
import "./init.jsx"; // App initialization (mount editor, load data)

// 🌓 Apply saved dark mode theme
const savedTheme = localStorage.getItem("theme");
const root = document.documentElement;

if (savedTheme === "dark") {
  root.classList.add("dark");
} else {
  root.classList.remove("dark");
}

// 🌙 Update theme icon on reload
const themeBtn = document.getElementById("theme-toggle-icon");
if (themeBtn) {
  themeBtn.textContent = savedTheme === "dark" ? "🌞" : "🌙";
}
