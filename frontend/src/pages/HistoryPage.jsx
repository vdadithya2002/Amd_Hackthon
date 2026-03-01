import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageContainer from "../components/layout/PageContainer";
import ThreatFilters from "../components/history/ThreatFilters";
import ThreatList from "../components/history/ThreatList";

const mockRows = [
  { id: 1, date: "2026-02-27", type: "url", source: "http://g00gle-login.xyz", risk: "high", reason: "Typosquatting domain" },
  { id: 2, date: "2026-02-27", type: "email", source: "placements@careers-safe.net", risk: "medium", reason: "Urgent fee request" },
  { id: 3, date: "2026-02-26", type: "url", source: "https://example.com", risk: "safe", reason: "No major red flags" },
];

export default function HistoryPage() {
  const [filters, setFilters] = useState({ type: "all", risk: "all" });
  const rows = useMemo(() => {
    return mockRows.filter((row) => {
      const typeOk = filters.type === "all" || row.type === filters.type;
      const riskOk = filters.risk === "all" || row.risk === filters.risk;
      return typeOk && riskOk;
    });
  }, [filters]);

  const high = mockRows.filter((r) => r.risk === "high").length;
  const medium = mockRows.filter((r) => r.risk === "medium").length;
  const safe = mockRows.filter((r) => r.risk === "safe").length;

  return (
    <div>
      <Navbar />
      <section className="section">
        <PageContainer>
          <h1>Threat History Dashboard</h1>
          <div className="summary-grid">
            <article className="panel"><strong>Total:</strong> {mockRows.length}</article>
            <article className="panel"><strong>High:</strong> {high}</article>
            <article className="panel"><strong>Medium:</strong> {medium}</article>
            <article className="panel"><strong>Safe:</strong> {safe}</article>
          </div>
          <ThreatFilters value={filters} onChange={setFilters} />
          <ThreatList rows={rows} />
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
