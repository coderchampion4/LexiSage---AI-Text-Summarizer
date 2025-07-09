document.addEventListener("mouseup", async () => {
  const selected = window.getSelection().toString();
  if (!selected.trim()) return;

  const tooltip = document.createElement("div");
  tooltip.id = "aiTooltip";
  tooltip.innerText = "🧠 Summarize";
  Object.assign(tooltip.style, {
    position: "fixed",
    top: `${event.pageY}px`,
    left: `${event.pageX}px`,
    background: "#222",
    color: "#fff",
    padding: "6px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 99999,
  });
  document.body.appendChild(tooltip);

  tooltip.onclick = async () => {
    const res = await fetch("http://localhost:3000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selected, mode: "summarize" }),
    });
    const data = await res.json();
    alert(`Summary:\n\n${data.output}`);
    tooltip.remove();
  };

  setTimeout(() => tooltip.remove(), 5000);
});

chrome.storage.local.get("pinnedSummary", (res) => {
  if (res.pinnedSummary) {
    const pinBox = document.createElement("div");
    pinBox.textContent = res.pinnedSummary;
    Object.assign(pinBox.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      background: "#333",
      color: "#fff",
      padding: "10px",
      borderRadius: "10px",
      maxWidth: "300px",
      zIndex: 9999,
    });
    document.body.appendChild(pinBox);
  }
});