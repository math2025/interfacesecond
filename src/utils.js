// ✅ Generate clean file name based on metadata
export function generateFileName(fileType) {
  let title = document.getElementById("doc-title")?.value.trim() || "MathQuestions";
  let author = document.getElementById("doc-author")?.value.trim() || "UnknownAuthor";
  let date = document.getElementById("doc-date")?.value || new Date().toISOString().split("T")[0];

  function toCamelCase(str) {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special chars
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  }

  title = toCamelCase(title) || "document";
  author = toCamelCase(author) || "user";

  return `${title}_${author}_${date}.${fileType}`;
}

// ✅ Show a status message in top header bar
export function showStatusMessage(message, type = "success") {
  const statusMessage = document.getElementById("status-message");
  if (!statusMessage) return;

  statusMessage.textContent = message;

  const typeClasses = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  statusMessage.className = `text-center mt-4 p-2 rounded-lg ${typeClasses[type] || "bg-gray-200 text-gray-800"}`;
  statusMessage.classList.remove("hidden");

  setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 3000);

  // Optionally scroll into view
  statusMessage.scrollIntoView({ behavior: "smooth", block: "start" });
}
