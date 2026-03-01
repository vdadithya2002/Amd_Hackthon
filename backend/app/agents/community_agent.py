# backend/app/agents/community_agent.py
import json
from google.adk.agents import Agent
from app.utils.gemini_client import get_gemini_client

community_agent = Agent(
    name="Community_Safety_Agent",
    model="gemini-2.5-flash",
    description=(
        "Reviews community / threat-intel signals about a URL (reports, feeds, trends) "
        "and explains risk in student-friendly language."
    ),
    tools=[]
)


def _parse_json_response(raw_text: str) -> dict:
    raw = (raw_text or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def analyze_community_url(url: str, raw_intel: dict | None = None) -> dict:
    """
    raw_intel: placeholder for future DB/threat-feed data.
    For now we assume no prior reports and ask Gemini to treat it as low/no community intel.
    """
    url = (url or "").strip()
    if not url:
        return {
            "agent": "community_agent",
            "url": "",
            "risk_level": "not_applicable",
            "reasons": ["No URL provided for community analysis."],
            "student_tip": "Provide a URL to check whether other students have reported it."
        }

    client = get_gemini_client()

    prompt = f"""
You are a community safety analyst for university students.

TASK:
Given a URL and limited community/threat-intel information, summarize what we know.

URL:
{url}

COMMUNITY / THREAT INTEL (JSON, may be empty):
{json.dumps(raw_intel or {}, indent=2)}

ASSUME:
- If no intel entries, that only means 'not yet reported', not '100% safe'.

RULES:
- Output JSON only.
- Keep language simple and practical.
- Focus on whether other users or feeds have flagged this URL/domain.

OUTPUT FORMAT:
{{
  "risk_level": "high|medium|safe",
  "reasons": [],
  "student_tip": ""
}}
"""

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    data = _parse_json_response(resp.text)
    data["agent"] = "community_agent"
    data["url"] = url
    return data
