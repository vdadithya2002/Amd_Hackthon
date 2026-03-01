import RiskBadge from "../common/RiskBadge";

export default function RiskSummaryCard({ plan, reasons }) {
  return (
    <section className="panel">
      <div className="row">
        <h2>{plan?.main_message || "Risk summary unavailable"}</h2>
        <RiskBadge level={plan?.risk_level} />
      </div>
      <ul className="tip-list">
        {reasons.length ? reasons.slice(0, 3).map((item, idx) => <li key={idx}>{item}</li>) : <li>No specific reasons returned.</li>}
      </ul>
    </section>
  );
}
