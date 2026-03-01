export default function TipsList({ tips }) {
  return (
    <section className="panel">
      <h3>Next time, watch for:</h3>
      <ul className="tip-list">
        {(tips || []).length ? tips.map((tip, idx) => <li key={idx}>{tip}</li>) : <li>No tips returned.</li>}
      </ul>
    </section>
  );
}
