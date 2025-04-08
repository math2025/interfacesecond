// ✅ Generate clean file name from metadata
export function generateFileName(fileType) {
  let title =
    document.getElementById("doc-title").value.trim() || "MathQuestions";
  let author =
    document.getElementById("doc-author").value.trim() || "UnknownAuthor";
  let date =
    document.getElementById("doc-date").value ||
    new Date().toISOString().split("T")[0];

  function toCamelCase(str) {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  }

  title = toCamelCase(title);
  author = toCamelCase(author);

  return `${title}_${author}_${date}.${fileType}`;
}

// ✅ Show status messages at top
export function showStatusMessage(message, type = "success") {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = message;
  statusMessage.className = `text-center mt-4 p-2 rounded-lg ${
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`;
  statusMessage.classList.remove("hidden");
  setTimeout(() => statusMessage.classList.add("hidden"), 3000);
}
