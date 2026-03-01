export default function ThreatFilters({ value, onChange }) {
  return (
    <div className="filters">
      <select value={value.type} onChange={(e) => onChange({ ...value, type: e.target.value })}>
        <option value="all">All types</option>
        <option value="url">URL</option>
        <option value="email">Email</option>
      </select>
      <select value={value.risk} onChange={(e) => onChange({ ...value, risk: e.target.value })}>
        <option value="all">All risks</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="safe">Safe</option>
      </select>
    </div>
  );
}
