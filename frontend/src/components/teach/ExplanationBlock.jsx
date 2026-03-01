export default function ExplanationBlock({ explanation, contextText }) {
  return (
    <section className="panel">
      <h3>Why this is flagged</h3>
      <p>{explanation || "Explanation not available."}</p>
      <p className="context-note">{contextText}</p>
    </section>
  );
}
