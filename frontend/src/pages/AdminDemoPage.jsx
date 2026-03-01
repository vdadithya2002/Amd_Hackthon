import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageContainer from "../components/layout/PageContainer";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function AdminDemoPage() {
  const [url, setUrl] = useState("https://example.com");
  const [email, setEmail] = useState(`{
  "sender": "helpdesk@university-alerts.com",
  "display_name": "University Helpdesk",
  "subject": "Urgent account verification",
  "body_text": "Click this link now to avoid suspension."
}`);
  const [json, setJson] = useState("");

  async function analyzeUrl() {
    const res = await fetch(`${BACKEND_URL}/analyze-url?url=${encodeURIComponent(url)}`);
    setJson(JSON.stringify(await res.json(), null, 2));
  }

  async function analyzeEmail() {
    const payload = JSON.parse(email);
    const res = await fetch(`${BACKEND_URL}/analyze-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setJson(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <PageContainer>
          <h1>Admin / Demo Panel</h1>
          <div className="card-grid two">
            <article className="panel">
              <h3>Analyze URL</h3>
              <input value={url} onChange={(e) => setUrl(e.target.value)} />
              <button className="btn-primary" type="button" onClick={analyzeUrl}>Analyze URL</button>
            </article>
            <article className="panel">
              <h3>Analyze Email JSON</h3>
              <textarea rows={8} value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-primary" type="button" onClick={analyzeEmail}>Analyze Email</button>
            </article>
          </div>
          <article className="panel">
            <h3>Raw backend output</h3>
            <pre>{json || "Run a test to see backend JSON."}</pre>
          </article>
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
