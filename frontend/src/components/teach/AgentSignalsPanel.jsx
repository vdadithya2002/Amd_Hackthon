import RiskBadge from "../common/RiskBadge";

function AgentRow({ title, payload }) {
  if (!payload) return null;
  const reasons = payload.reasons || [];
  return (
    <div className="agent-row">
      <div className="row">
        <strong>{title}</strong>
        <RiskBadge level={payload.risk_level} />
      </div>
      <ul className="tiny-list">
        {reasons.length ? reasons.slice(0, 2).map((r, i) => <li key={i}>{r}</li>) : <li>No reasons provided.</li>}
      </ul>
    </div>
  );
}

export default function AgentSignalsPanel({ data }) {
  return (
    <aside className="panel">
      <h3>Agent Signals</h3>
      <AgentRow title="URL Agent" payload={data?.url_result} />
      <AgentRow title="Email Agent" payload={data?.email_result} />
      <AgentRow title="Community Agent" payload={data?.community_result} />
    </aside>
  );
}
