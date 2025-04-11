import "../style.css";
import "./init.jsx"; // Initialize full app logic

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");

  // 🌙 Apply saved theme
  if (savedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // 🌞 Update theme toggle icon
  const themeBtn = document.getElementById("theme-toggle-icon");
  if (themeBtn) {
    themeBtn.textContent = savedTheme === "dark" ? "🌞" : "🌙";

    themeBtn.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "🌞" : "🌙";
    });
  }
});
