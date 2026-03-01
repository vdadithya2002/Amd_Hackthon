import ThreatRow from "./ThreatRow";

export default function ThreatList({ rows }) {
  return (
    <div className="panel table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Source</th>
            <th>Risk</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ThreatRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
