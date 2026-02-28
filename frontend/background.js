const API_BASE = "http://localhost:8000";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "analyze") {
    fetch(`${API_BASE}/analyze/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message.text,
        conversation: message.conversation ?? [],
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then(sendResponse)
      .catch((err) => {
        console.warn("[Aegis] Background fetch failed:", err.message);
        sendResponse(null);
      });
    return true; // keep channel open for async sendResponse
  }
});
