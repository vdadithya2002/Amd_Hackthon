import RiskBadge from "../common/RiskBadge";

export default function ThreatRow({ row }) {
  const link = row.type === "url" ? `/teach?type=url&url=${encodeURIComponent(row.source)}` : `/teach?type=email&sender=${encodeURIComponent(row.source)}`;
  return (
    <tr>
      <td>{row.date}</td>
      <td>{row.type.toUpperCase()}</td>
      <td>{row.source}</td>
      <td><RiskBadge level={row.risk} /></td>
      <td>{row.reason}</td>
      <td><a href={link}>View teaching</a></td>
    </tr>
  );
}
