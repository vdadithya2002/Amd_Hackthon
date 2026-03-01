import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageContainer from "../components/layout/PageContainer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import RiskSummaryCard from "../components/teach/RiskSummaryCard";
import ExplanationBlock from "../components/teach/ExplanationBlock";
import TipsList from "../components/teach/TipsList";
import QuizCard from "../components/teach/QuizCard";
import AgentSignalsPanel from "../components/teach/AgentSignalsPanel";

const BACKEND_URL = "http://127.0.0.1:8000";

function flattenReasons(payload) {
  return [payload?.url_result?.reasons, payload?.email_result?.reasons, payload?.community_result?.reasons]
    .flat()
    .filter(Boolean);
}

export default function TeachPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const type = (params.get("type") || "url").toLowerCase();
  const url = params.get("url") || "";
  const sender = params.get("sender") || "";

  useEffect(() => {
    async function run() {
      try {
        if (type === "email") {
          const payload = {
            sender: sender || "unknown@unknown.com",
            display_name: params.get("display_name") || "Unknown Sender",
            subject: params.get("subject") || "Suspicious email report",
            body_text: params.get("body") || "This email is being reviewed from teach page context.",
          };
          const res = await fetch(`${BACKEND_URL}/analyze-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Backend returned ${res.status}`);
          setData(await res.json());
        } else {
          if (!url) throw new Error("Missing URL. Open as /teach?type=url&url=https://example.com");
          const res = await fetch(`${BACKEND_URL}/analyze-url?url=${encodeURIComponent(url)}`);
          if (!res.ok) throw new Error(`Backend returned ${res.status}`);
          setData(await res.json());
        }
      } catch (err) {
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [params, sender, type, url]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <PageContainer><LoadingSpinner text="Building your teaching report..." /></PageContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <PageContainer><ErrorMessage message={error} /></PageContainer>
      </div>
    );
  }

  const plan = data?.teaching_plan || {};
  const reasons = flattenReasons(data);
  const contextText = type === "email"
    ? `Opened from email context${sender ? ` (sender: ${sender})` : ""}.`
    : `You saw this warning after clicking: ${url}`;

  return (
    <div>
      <Navbar />
      <section className="section">
        <PageContainer>
          <div className="teach-layout">
            <div className="teach-main">
              <h1>{type === "email" ? "This email looks suspicious" : "This page looks risky"}</h1>
              <RiskSummaryCard plan={plan} reasons={reasons} />
              <ExplanationBlock explanation={plan.explanation} contextText={contextText} />
              <TipsList tips={plan.tips || []} />
              <QuizCard quiz={plan.quiz} />
            </div>
            <AgentSignalsPanel data={data} />
          </div>
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
