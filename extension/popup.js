document.addEventListener("DOMContentLoaded", () => {
  const runBtn = document.getElementById("runBtn");
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const modeSelect = document.getElementById("modeSelect");
  const outputSection = document.getElementById("outputSection");
  const copyBtn = document.getElementById("copyBtn");
  const pinBtn = document.getElementById("pinBtn");
  const historyList = document.getElementById("historyList");
  const themeToggle = document.getElementById("themeToggle");

  // Load history from localStorage
  const history = JSON.parse(localStorage.getItem("lexisage-history") || "[]");
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `[${item.mode}] ${item.output}`;
    historyList.appendChild(li);
  });

  runBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    const mode = modeSelect.value;
    if (!text) return;

    try {
      const res = await fetch("http://localhost:3000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      outputText.textContent = data.output;
      outputSection.classList.remove("hidden");

      // Save to history
      const updated = [{ text, output: data.output, mode }, ...history];
      localStorage.setItem("lexisage-history", JSON.stringify(updated));
    } catch (err) {
      outputText.textContent = "❌ Error: " + err.message;
      outputSection.classList.remove("hidden");
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.textContent);
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy"), 2000);
  });

  pinBtn.addEventListener("click", () => {
    alert("📌 Output pinned (not implemented)");
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const current = document.body.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  // Load theme
  document.body.dataset.theme = localStorage.getItem("theme") || "light";
});
