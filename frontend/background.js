const API_BASE = "http://localhost:8000";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "analyze") {
    fetch(`${API_BASE}/analyze/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message.text,
        conversation: message.conversation ?? [],
        numberOfSourcesUsed: message.numberOfSourcesUsed ?? 0,
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
  if (message.type === "recalibrate") {
    fetch(`${API_BASE}/recalibrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: message.text,
        confidence: message.confidence,
        evidence: message.evidence,
        domain: message.domain ?? "general",
        decision_delegation_detected: message.decision_delegation_detected ?? false,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => sendResponse({ recalibratedText: data?.recalibrated_text ?? "" }))
      .catch((err) => {
        console.warn("[Aegis] Recalibrate fetch failed:", err.message);
        sendResponse({ recalibratedText: "" });
      });
    return true;
  }
});
