# backend/app/agents/email_agent.py
import json
from google.adk.agents import Agent
from app.utils.gemini_client import get_gemini_client

email_agent = Agent(
    name="Email_Phishing_Agent",
    model="gemini-2.5-flash",
    description=(
        "Analyzes emails for phishing risk, especially student scenarios "
        "(fake scholarships, credential theft, fake professor/job emails), "
        "and extracts suspicious links."
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


def analyze_email(email: dict) -> dict:
    """
    email = {
      "sender": str,
      "display_name": str,
      "subject": str,
      "body_text": str
    }
    """
    sender = (email.get("sender") or "").strip()
    display_name = (email.get("display_name") or "").strip()
    subject = (email.get("subject") or "").strip()
    body_text = (email.get("body_text") or "").strip()

    if not subject and not body_text:
        return {
            "agent": "email_agent",
            "risk_level": "not_applicable",
            "reasons": ["No email content provided."],
            "suspicious_links": [],
        }

    client = get_gemini_client()

    prompt = f"""
You are an email phishing analyst helping first-year university students.

TASK:
Analyze this email for phishing or scam risk, focusing on student-centric scenarios:

- Fake scholarship offers
- Phishing for student portal credentials
- Fake job or internship offers
- Malicious assignment/attachment downloads
- Fake professor or university admin emails

EMAIL JSON:
{json.dumps({
    "sender": sender,
    "display_name": display_name,
    "subject": subject,
    "body_text": body_text
}, indent=2)}

RULES:
- Consider sender identity, tone, urgency, links, and requests.
- Extract any suspicious links in the body.
- Output JSON only.

OUTPUT FORMAT:
{{
  "risk_level": "high|medium|safe",
  "reasons": [],
  "suspicious_links": []
}}
"""

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    data = _parse_json_response(resp.text)
    data["agent"] = "email_agent"
    return data
