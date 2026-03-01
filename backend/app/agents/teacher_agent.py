# backend/app/agents/teacher_agent.py
import json
from google.adk.agents import Agent
from app.utils.gemini_client import get_gemini_client

teacher_agent = Agent(
    name="Teacher_Agent",
    model="gemini-2.5-flash",
    description=(
        "Explains security risks to first-year students in plain language, "
        "and creates a teaching plan with explanation, tips, and a quiz."
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


def build_teaching_plan(url_result: dict | None,
                        community_result: dict | None,
                        email_result: dict | None) -> dict:
    """
    Any of url_result / community_result / email_result can be None.
    Teacher agent decides final risk and explanation from all signals.
    """
    client = get_gemini_client()

    prompt = f"""
You are a friendly cybersecurity mentor for first-year university students.

TASK:
Given URL analysis, community intel, and/or email analysis, create a teaching plan.

URL_ANALYSIS_JSON (may be null):
{json.dumps(url_result, indent=2)}

COMMUNITY_INTEL_JSON (may be null):
{json.dumps(community_result, indent=2)}

EMAIL_ANALYSIS_JSON (may be null):
{json.dumps(email_result, indent=2)}

RULES:
- Avoid technical jargon (no 'DNSSEC', 'SPF', etc.).
- Explain in simple, conversational language.
- Focus on what the student should look out for next time.
- Output JSON only.

OUTPUT FORMAT:
{{
  "risk_level": "high|medium|safe",
  "main_message": "",
  "explanation": "",
  "tips": [],
  "quiz": {{
    "question": "",
    "options": [],
    "correct_index": 0,
    "feedback": ""
  }}
}}
"""

    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    data = _parse_json_response(resp.text)
    data["agent"] = "teacher_agent"
    return data
