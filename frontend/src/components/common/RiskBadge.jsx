export default function RiskBadge({ level }) {
  const risk = (level || "safe").toLowerCase();
  const cls = risk === "high" ? "risk-high" : risk === "medium" ? "risk-medium" : "risk-safe";
  return <span className={`risk-badge ${cls}`}>{risk.toUpperCase()}</span>;
}
