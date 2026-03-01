/**
 * Aegis - Inline AI safety analysis for ChatGPT
 * Injects analysis panels below assistant responses
 */

const AEGIS_ATTR = "data-aegis-injected";
const STREAMING_DEBOUNCE_MS = 800;

/** Returns low | medium | high for value 0–1 (higher = better) */
function meterColorClass(value) {
  const pct = (value ?? 0) * 100;
  if (pct >= 67) return "high";
  if (pct >= 34) return "medium";
  return "low";
}

/**
 * extracts the response text from the container by checking the following:
 * - if the container has a markdown class
 * - if the container has a prose class
 * - if the container has a markdown class with a space and a class
 * - return the inner text of the container or an empty string if no text is found
 * @param {HTMLElement} container 
 * @returns {string} the response text
 */
function extractResponseText(container) {
  const markdown = container.querySelector(".markdown, .prose, [class*='markdown']");
  return (markdown || container).innerText?.trim() || "";
}

function getConversationThread() {
  const turns = [];
  const articles = document.querySelectorAll("article[data-turn-id]");

  for (const article of articles) {
    const user = article.querySelector("[data-message-author-role='user']");
    const assistant = article.querySelector("[data-message-author-role='assistant']");

    if (user) {
      const text = extractResponseText(user);
      if (text) turns.push({ role: "user", content: text });
    }
    if (assistant) {
      const text = extractResponseText(assistant);
      if (text) turns.push({ role: "assistant", content: text });
    }
  }
  return turns;
}

/**
 * detects if the container is streaming or not by checking the following:
 * - if the container is an article
 * - if the article has a data-writing-block
 * - if the article has a has-data-writing-block class
 * - if the article contains a stop-generating-button
 * - return true if the container is streaming
 * - return false if the container is not streaming
 * @param {HTMLElement} container 
 * @returns {boolean} true if the container is streaming, false otherwise
 */
function isStreaming(container) {
  const article = container.closest("article");
  if (!article) return false;
  if (article.querySelector("[data-writing-block]")) return true;
  if (article.classList.contains("has-data-writing-block")) return true;
  const stopBtn = document.querySelector("[data-testid='stop-generating-button']");
  if (stopBtn && article.contains(stopBtn.closest("article"))) return true;
  return false;
}

/**
 * waits for the streaming to complete by calling the isStreaming function and checking the following:
 * - if the text has changed
 * - if the streaming has stopped
 * - if the text is stable for the debounce time
 * - if the elapsed time has exceeded the max wait time
 * - return true if the streaming is complete
 * - return false if the streaming is not complete
 * @param {HTMLElement} container 
 * @returns {Promise<void>} resolves when the streaming is complete
 */
function waitForStreamingComplete(container) {
  return new Promise((resolve) => {
    const pollInterval = 150;
    const maxWaitMs = 60000;
    let lastText = "";
    let stableSince = Date.now();
    const startTime = Date.now();

    const check = () => {
      const text = extractResponseText(container);
      const streaming = isStreaming(container);

      if (text !== lastText) {
        lastText = text;
        stableSince = Date.now();
      }

      const stableDuration = Date.now() - stableSince;
      const elapsed = Date.now() - startTime;
      const done =
        !streaming &&
        text.length > 0 &&
        (stableDuration >= STREAMING_DEBOUNCE_MS || elapsed >= maxWaitMs);

      if (done) {
        resolve();
        return;
      }

      setTimeout(check, pollInterval);
    };

    check();
  });
}

/**
 * Calls the API via the background script (avoids Chrome blocking localhost from page context).
 * @param {string} responseText
 * @param {Array} conversation
 * @returns {Promise<Object|null>} the analysis or null on failure
 */
async function fetchAnalysis(responseText, conversation = []) {
  try {
    const result = await chrome.runtime.sendMessage({
      type: "analyze",
      text: responseText,
      conversation,
    });
    return result ?? null;
  } catch (err) {
    console.warn("[Aegis] API unavailable, using mock:", err.message);
    return null;
  }
}

// Mock analysis data (fallback when API unavailable)
function getMockAnalysis() {
  return {
    riskLevel: "high", // low | medium | high
    label: "High confidence gap",
    confidence: 0.85,
    evidence: 0.45,
    domain: "general",
    decision_delegation_detected: false,
    missingContext: [
      "Response assumes current data; may be outdated",
      "No citation of sources or studies",
      "Geographic scope unclear"
    ],
    assumptions: [
      "General patterns apply to individual cases",
      "Training data is representative and up to date"
    ],
    biasSummary: "Likely confirmation bias / one-sided framing",
    failureModes: [
      "Training data cutoff may omit recent developments",
      "Overgeneralization from limited examples",
      "Nuance lost in favor of concise answer",
      "Context-dependent claims presented as universal"
    ]
  };
}

const shieldIcon = `<svg class="aegis-shield" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
</svg>`;

const chevronIcon = `<svg class="aegis-chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="aegis-meter-bar aegis-meter-confidence aegis-meter-bar--${meterColorClass(analysis.confidence)}" style="width: ${analysis.confidence * 100}%"></div>
          </div>
          <span class="aegis-meter-value aegis-meter-value--${meterColorClass(analysis.confidence)}">${Math.round(analysis.confidence * 100)}%</span>
        </div>
        <div class="aegis-meter-row">
          <span class="aegis-meter-label">Evidence</span>
          <div class="aegis-meter-bar-wrap">
            <div class="aegis-meter-bar aegis-meter-evidence aegis-meter-bar--${meterColorClass(analysis.evidence)}" style="width: ${analysis.evidence * 100}%"></div>
          </div>
          <span class="aegis-meter-value aegis-meter-value--${meterColorClass(analysis.evidence)}">${Math.round(analysis.evidence * 100)}%</span>
        </div>
      </div>
    </div>
    <div class="aegis-context-section">
      <div class="aegis-section-title">Missing context</div>
      <ul class="aegis-context-list">
        ${(analysis.missingContext ?? []).map(c => `<li>${escapeHtml(c)}</li>`).join("")}
      </ul>
    </div>
    ${(analysis.assumptions ?? []).length ? `
    <div class="aegis-assumptions-section">
      <div class="aegis-section-title">Assumptions</div>
      <ul class="aegis-context-list">
        ${(analysis.assumptions ?? []).map(a => `<li>${escapeHtml(a)}</li>`).join("")}
      </ul>
    </div>
    ` : ""}
    <div class="aegis-bias-section">
      ${escapeHtml(analysis.biasSummary)}
    </div>
    <div class="aegis-actions">
      <button class="aegis-btn aegis-btn-primary" data-action="recalibrate">Recalibrate response</button>
      <button class="aegis-btn aegis-btn-secondary" data-action="failures">What could make this wrong</button>
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
  card.querySelector('[data-action="recalibrate"]').addEventListener("click", async (e) => {
    e.stopPropagation();
    const wrap = card.querySelector(".aegis-recalibrated-wrap");
    const btn = card.querySelector('[data-action="recalibrate"]');
    if (wrap.hidden) {
      wrap.hidden = false;
      wrap.innerHTML = `<div class="aegis-recalibrated aegis-recalibrated--loading">Recalibrating…</div>`;
      btn.disabled = true;
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: "recalibrate",
            text: analysis.originalText ?? "",
            confidence: analysis.confidence ?? 0.5,
            evidence: analysis.evidence ?? 0.5,
            domain: analysis.domain ?? "general",
            decision_delegation_detected: analysis.decision_delegation_detected ?? false,
          },
          resolve
        );
      });
      btn.disabled = false;
      const text = result?.recalibratedText ?? "";
      wrap.innerHTML = text
        ? `
        <div class="aegis-recalibrated">
          <div class="aegis-recalibrated-title">Safer version</div>
          ${escapeHtml(text)}
        </div>
      `
        : `<div class="aegis-recalibrated aegis-recalibrated--error">Recalibration unavailable. Check backend.</div>`;
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

function mapApiToAnalysis(api) {
  if (!api || !api.risk) return null;
  const level = api.risk.level || "medium";
  const confidence =
    api.heuristics?.confidence_score ??
    api.llm_analysis?.factual_confidence ??
    0.5;
  const evidence =
    api.heuristics?.evidence_score ?? 1 - (api.llm_analysis?.factual_confidence ?? 0.5);
  return {
    riskLevel: level,
    label: api.risk.factors?.length
      ? `${level.charAt(0).toUpperCase() + level.slice(1)}: ${api.risk.factors[0]}`
      : `${level.charAt(0).toUpperCase() + level.slice(1)} confidence gap`,
    confidence,
    evidence,
    domain: api.heuristics?.domain ?? "general",
    decision_delegation_detected: api.llm_analysis?.decision_delegation_detected ?? false,
    missingContext: api.llm_analysis?.missing_context ?? [],
    assumptions: api.llm_analysis?.assumptions ?? [],
    biasSummary:
      api.llm_analysis?.bias_explanation ??
      api.llm_analysis?.bias_type ??
      "No significant bias detected",
    failureModes: api.llm_analysis?.failure_modes ?? [],
  };
}

async function injectPanelForContainer(container) {
  if (container.querySelector(".aegis-panel")) return;
  if (container.hasAttribute("data-aegis-pending")) return;

  container.setAttribute("data-aegis-pending", "true");

  try {
    await waitForStreamingComplete(container);
    const responseText = extractResponseText(container);
    const conversation = getConversationThread();

    const apiResult = await fetchAnalysis(responseText, conversation);
    const analysis = mapApiToAnalysis(apiResult) ?? getMockAnalysis();
    analysis.originalText = responseText;

    const panel = createAegisPanel(analysis);
    container.appendChild(panel);
  } catch (err) {
    console.warn("[Aegis] Injection failed:", err);
    const panel = createAegisPanel(getMockAnalysis());
    container.appendChild(panel);
  } finally {
    container.removeAttribute("data-aegis-pending");
  }
}

function injectPanels() {
  const responseDivs = document.querySelectorAll("[data-message-author-role='assistant']");
  for (const container of responseDivs) {
    injectPanelForContainer(container);
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
