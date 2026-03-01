# backend/app/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.url_agent import analyze_url
from app.agents.community_agent import analyze_community_url
from app.agents.email_agent import analyze_email
from app.agents.teacher_agent import build_teaching_plan
from app.utils.gemini_client import get_gemini_client

app = FastAPI(title="Student Multi-Agent Security Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "chrome-extension://*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"chrome-extension://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- URL ANALYSIS (already used by extension/React) ----------

@app.get("/analyze-url")
async def analyze_url_endpoint(url: str = Query(...)):
    url_res = analyze_url(url)
    comm_res = analyze_community_url(url)
    teaching = build_teaching_plan(url_res, comm_res, email_result=None)
    return {
        "url_result": url_res,
        "community_result": comm_res,
        "teaching_plan": teaching
    }


# ---------- EMAIL ANALYSIS (new) ----------

class EmailPayload(BaseModel):
    sender: str
    display_name: str
    subject: str
    body_text: str


class ChatPayload(BaseModel):
    message: str
    context: str = ""


class ChatResponse(BaseModel):
    reply: str

@app.post("/analyze-email")
async def analyze_email_endpoint(payload: EmailPayload):
    email_dict = payload.model_dump()

    # 1) Email analysis (student-centric phishing)
    email_res = analyze_email(email_dict)

    # 2) For now, only analyze the first suspicious link with URL + community
    url_res = None
    comm_res = None
    suspicious_links = email_res.get("suspicious_links") or []
    if suspicious_links:
        first_link = suspicious_links[0]
        url_res = analyze_url(first_link)
        comm_res = analyze_community_url(first_link)

    # 3) Teaching plan combining email + (optional) URL + community
    teaching = build_teaching_plan(url_res, comm_res, email_res)

    return {
        "email_result": email_res,
        "url_result": url_res,
        "community_result": comm_res,
        "teaching_plan": teaching
    }


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatPayload):
    message = (payload.message or "").strip()
    if not message:
        return ChatResponse(reply="Please type a message so I can help.")

    client = get_gemini_client()
    context = (payload.context or "").strip()
    prompt = f"""
You are a student-friendly cybersecurity mentor.
Keep replies practical, simple, and concise.
If there is a scam risk, explain why and list safe next actions.

Conversation context:
{context or "No prior context provided."}

Student message:
{message}
"""
    resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    reply = (resp.text or "").strip() or "I could not generate a response right now."
    return ChatResponse(reply=reply)
