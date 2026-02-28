/**
 * Aegis - Inline AI safety analysis for ChatGPT
 * Injects analysis panels below assistant responses
 */

const AEGIS_ATTR = "data-aegis-injected";

// Mock analysis data (replace with API call to backend)
function getMockAnalysis() {
  return {
    riskLevel: "high", // low | medium | high
    label: "High confidence gap",
    confidence: 0.85,
    evidence: 0.45,
    missingContext: [
      "Response assumes current data; may be outdated",
      "No citation of sources or studies",
      "Geographic scope unclear"
    ],
    biasSummary: "Likely confirmation bias / one-sided framing",
    recalibratedText: "Here's a more cautious version: The answer above reflects general patterns, but I'm not certain about the specific claims. Key assumptions: (1) the data I was trained on may be incomplete; (2) individual cases can differ; (3) I don't have access to current, verified sources. I'd recommend fact-checking any specific numbers or claims against authoritative sources.",
    failureModes: [
      "Training data cutoff may omit recent developments",
      "Overgeneralization from limited examples",
      "Nuance lost in favor of concise answer",
      "Context-dependent claims presented as universal"
    ]
  };
}

const shieldIcon = `<svg class="aegis-shield" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.5">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
</svg>`;

const chevronIcon = `<svg class="aegis-chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2">
  <path d="M6 9l6 6 6-6"/>
</svg>`;

function createAegisPanel(analysis) {
  const riskClass = `aegis-risk-${analysis.riskLevel}`;
  const panel = document.createElement("div");
  panel.className = "aegis-panel";
  panel.setAttribute(AEGIS_ATTR, "true");

  const row = document.createElement("div");
  row.className = "aegis-row";

  row.innerHTML = `
    <span class="aegis-shield-wrap">${shieldIcon}</span>
    <span class="aegis-label">Aegis analysis: ${analysis.label}</span>
    <span class="aegis-risk-pill ${riskClass}">${analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}</span>
    <span class="aegis-chevron-wrap">${chevronIcon}</span>
  `;

  const card = document.createElement("div");
  card.className = "aegis-card";
  card.hidden = true;

  card.innerHTML = `
    <div class="aegis-meter-section">
      <div class="aegis-section-title">Confidence vs Evidence</div>
      <div class="aegis-meter">
        <div class="aegis-meter-row">
          <span class="aegis-meter-label">Confidence</span>
          <div class="aegis-meter-bar-wrap">
            <div class="aegis-meter-bar aegis-meter-confidence" style="width: ${analysis.confidence * 100}%"></div>
          </div>
          <span class="aegis-meter-value">${Math.round(analysis.confidence * 100)}%</span>
        </div>
        <div class="aegis-meter-row">
          <span class="aegis-meter-label">Evidence</span>
          <div class="aegis-meter-bar-wrap">
            <div class="aegis-meter-bar aegis-meter-evidence" style="width: ${analysis.evidence * 100}%"></div>
          </div>
          <span class="aegis-meter-value">${Math.round(analysis.evidence * 100)}%</span>
        </div>
      </div>
    </div>
    <div class="aegis-context-section">
      <div class="aegis-section-title">Missing context / assumptions</div>
      <ul class="aegis-context-list">
        ${analysis.missingContext.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
      </ul>
    </div>
    <div class="aegis-bias-section">
      ${escapeHtml(analysis.biasSummary)}
    </div>
    <div class="aegis-actions">
      <button class="aegis-btn aegis-btn-primary" data-action="recalibrate">Recalibrate response</button>
      <button class="aegis-btn aegis-btn-secondary" data-action="failures">What could make this wrong?</button>
    </div>
    <div class="aegis-recalibrated-wrap" hidden></div>
    <div class="aegis-failures-wrap" hidden></div>
  `;

  panel.appendChild(row);
  panel.appendChild(card);

  // Expand / collapse
  row.addEventListener("click", () => {
    const isExpanded = !card.hidden;
    card.hidden = isExpanded;
    row.classList.toggle("expanded", !isExpanded);
  });

  // Recalibrate
  card.querySelector('[data-action="recalibrate"]').addEventListener("click", (e) => {
    e.stopPropagation();
    const wrap = card.querySelector(".aegis-recalibrated-wrap");
    if (wrap.hidden) {
      wrap.hidden = false;
      wrap.innerHTML = `
        <div class="aegis-recalibrated">
          <div class="aegis-recalibrated-title">Safer version</div>
          ${escapeHtml(analysis.recalibratedText)}
        </div>
      `;
    } else {
      wrap.hidden = true;
      wrap.innerHTML = "";
    }
  });

  // What could make this wrong
  card.querySelector('[data-action="failures"]').addEventListener("click", (e) => {
    e.stopPropagation();
    const wrap = card.querySelector(".aegis-failures-wrap");
    if (wrap.hidden) {
      wrap.hidden = false;
      wrap.innerHTML = `
        <div class="aegis-failures">
          <div class="aegis-failures-title">Potential failure modes</div>
          <ul class="aegis-failures-list">
            ${analysis.failureModes.map(f => `<li>${escapeHtml(f)}</li>`).join("")}
          </ul>
        </div>
      `;
    } else {
      wrap.hidden = true;
      wrap.innerHTML = "";
    }
  });

  return panel;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function injectPanels() {
  const responseDivs = document.querySelectorAll("[data-message-author-role='assistant']");
  for (const container of responseDivs) {
    if (container.querySelector(".aegis-panel")) continue;

    const analysis = getMockAnalysis();
    const panel = createAegisPanel(analysis);
    container.appendChild(panel);
  }
}

function observeAndInject() {
  const observer = new MutationObserver(() => {
    injectPanels();
  });

  const target = document.querySelector("main") || document.body;
  observer.observe(target, { childList: true, subtree: true });
  injectPanels();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeAndInject);
} else {
  observeAndInject();
}
