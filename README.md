# Student PhishGuard (AMD Hackathon)

Student PhishGuard is a multi-agent phishing awareness project built for students.  
It combines:

- A `FastAPI` backend for URL/email analysis and teaching responses
- A `React + Vite` frontend for student-facing pages (`/`, `/teach`, `/learn`, `/history`, `/demo`)
- A Chrome extension that scans active pages and Gmail content

The system explains *why* something is risky, gives practical tips, and includes a quick quiz-style learning step.

## Project Structure

```text
amd_hackthon/
├─ backend/          # FastAPI backend + agents
├─ frontend/         # React frontend (Vite)
└─ extension/        # Chrome extension (Manifest V3)
```

## Tech Stack

- Backend: `FastAPI`, `Uvicorn`, `Google Gemini (google-genai / ADK)`, `VirusTotal API`
- Frontend: `React 19`, `Vite`
- Extension: `Manifest V3` (background + content scripts)

## Backend Setup

1. Go to backend:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
pip install google-genai google-adk python-dotenv
```

4. Create env file from template:
```bash
copy .env.example .env
```

5. Fill keys in `backend/.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
VT_API_KEY=your_virustotal_api_key_here
```

6. Run API server:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend endpoints:

- `GET /analyze-url?url=<url>`
- `POST /analyze-email`
- `POST /chat`

## Frontend Setup

1. Open a new terminal and go to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run dev server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Keep backend (`:8000`) and frontend (`:5173`) running

The extension listens on normal web pages and Gmail, then calls backend analysis APIs.

## Security Notes

- `.env` and secret files are ignored by git.
- Use `backend/.env.example` as the template for local configuration.
- Never commit real API keys.

## Demo Flow

1. Run backend on `127.0.0.1:8000`
2. Run frontend on `localhost:5173`
3. Load extension in Chrome
4. Visit a URL or open Gmail
5. View warning + open teach page for explanation and quiz

