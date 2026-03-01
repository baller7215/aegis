"""Recalibration: align confidence with evidence via epistemic correction."""

import os

import httpx
from openai import AsyncOpenAI

RECALIBRATE_SYSTEM = """You are an epistemic calibration corrector. Your job is to rewrite AI responses so their certainty aligns with the strength of supporting evidence.

You adjust epistemic posture, NOT tone. You do not:
- Add "maybe" everywhere
- Water down every answer
- Agree with the user automatically
- Be overly cautious when evidence is strong

You DO:
- Add evidentiary framing where claims lack explicit evidence
- Explicitly state assumptions where relevant
- Clarify scope limits and boundaries of knowledge
- Identify uncertainty or disagreement in research when applicable
- Avoid unconditional agreement with the user's premise
- Preserve correctness when the original answer is already well-supported

Critical: Do not introduce new external facts. Only operate on the content provided."""

RECALIBRATE_USER_TEMPLATE = """Rewrite the following AI response to align its confidence with the strength of supporting evidence.

**Calibration context:**
- Confidence score (how certain the original sounds): {confidence:.0%}
- Evidence score (how well-supported): {evidence:.0%}
- Confidence-evidence gap: {gap:.0%} (positive = overconfident)
- Domain: {domain}
- Decision delegation detected: {decision_delegation}

**Strength of recalibration:** {strength}

**Requirements:**
- If claims lack explicit evidence, clarify uncertainty.
- Explicitly state assumptions where relevant.
- Avoid definitive or absolute phrasing unless strongly supported.
- Include boundaries of knowledge where appropriate.
- Do not weaken well-supported claims unnecessarily.
- Do not automatically agree with the user's premise.

Return ONLY the recalibrated response. No preamble or meta-commentary."""


def _recalibration_strength(gap: float, domain: str) -> str:
    """
    determine recalibration strength from confidence_gap + domain (B approach)

    @param {float} gap - the confidence gap
    @param {str} domain - the domain
    @return {str} the recalibration strength
    """
    high_risk_domains = ("medical", "legal", "financial")
    domain_risk = domain.lower() in high_risk_domains

    if gap < 0.15 and not domain_risk:
        return "LIGHT: Only minor refinement if needed. Preserve well-supported claims."
    if gap < 0.3 and not domain_risk:
        return "MODERATE: Add evidentiary framing and clarify uncertainty where claims are unsupported."
    if gap >= 0.3 or domain_risk:
        return "STRONG: Significant epistemic correction. Explicitly state assumptions, evidence limits, and scope. Ground confidence in evidence."


async def run_recalibration(
    text: str,
    confidence: float,
    evidence: float,
    domain: str = "general",
    decision_delegation_detected: bool = False,
) -> str:
    """
    recalibrate the response to align confidence with evidence

    @param {string} text - the original AI response text
    @param {float} confidence - the confidence score 0–1
    @param {float} evidence - the evidence score 0–1
    @param {str} domain - the domain (medical, legal, financial, general, etc.)
    @param {bool} decision_delegation_detected - whether the response encourages high-stakes decisions without caveats
    @return {str} the recalibrated text
    """
    if not text or not text.strip():
        return ""

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return ""

    gap = max(0.0, confidence - evidence)
    strength = _recalibration_strength(gap, domain)

    user_prompt = RECALIBRATE_USER_TEMPLATE.format(
        confidence=confidence,
        evidence=evidence,
        gap=gap,
        domain=domain,
        decision_delegation="yes" if decision_delegation_detected else "no",
        strength=strength,
    ).strip() + "\n\n---\n\n" + (text[:8000] if len(text) > 8000 else text)

    async with httpx.AsyncClient() as http_client:
        client = AsyncOpenAI(api_key=api_key, http_client=http_client)
        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": RECALIBRATE_SYSTEM},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
            )
            return (response.choices[0].message.content or "").strip()
        except Exception:
            return ""
