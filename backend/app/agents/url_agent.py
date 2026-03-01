# backend/app/agents/url_agent.py
from google.adk.agents import Agent
from ..utils.gemini_client import get_gemini_client
from ..utils.vt_client import check_url_with_virustotal

url_risk_agent = Agent(
    name="URL_Risk_Agent",
    model="gemini-2.5-flash",
    description=(
        "Analyzes URLs for phishing / malware risk using VirusTotal stats and "
        "handcrafted heuristics, then produces a plain-language explanation."
    ),
    tools=[]
)

def analyze_url(url: str) -> dict:
    """
    Called by FastAPI endpoint.
    Returns structured risk + reasons for the browser extension.
    """
    vt_stats = check_url_with_virustotal(url)  # {maliciousCount, totalEngines}
    malicious = vt_stats["maliciousCount"]
    total = vt_stats["totalEngines"]

    # Simple heuristics (could also be computed in Python)
    # For speed, we keep some basic heuristics here; for now focus on VT+LLM explanation.
    client = get_gemini_client()

    prompt = f"""
You are a security analyst helping first-year university students.

TASK:
Given the VirusTotal stats and URL, decide a risk level and explain in plain language.

URL:
{url}

VIRUSTOTAL STATS:
malicious_count = {malicious}
total_engines = {total}

RULES:
- Output JSON only.
- Fields:
  - risk_level: "high", "medium", or "safe"
  - reasons: list of short reasons for the decision
  - explanation: 2-3 sentences, plain language, no jargon
  - tips: 3 bullet-point tips for the student

Respond ONLY in this JSON format:

{{
  "risk_level": "...",
  "reasons": [],
  "explanation": "",
  "tips": []
}}
"""

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    raw_text = resp.text.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
    raw_text = raw_text.replace("json\n", "").strip()

    import json
    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON from URL_Risk_Agent:\n" + resp.text)

    # Attach VT stats for extension context
    data["vt_stats"] = vt_stats
    return data
