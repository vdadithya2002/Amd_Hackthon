import { useState } from "react";

export default function QuizCard({ quiz }) {
  const [picked, setPicked] = useState(null);
  if (!quiz || !Array.isArray(quiz.options)) return null;

  const solved = picked !== null;
  const correct = solved && picked === quiz.correct_index;

  return (
    <section className="panel">
      <h3>Quick check</h3>
      <p>{quiz.question}</p>
      <div className="quiz-grid">
        {quiz.options.map((opt, idx) => (
          <button key={idx} className="quiz-option" onClick={() => setPicked(idx)} type="button">
            {opt}
          </button>
        ))}
      </div>
      {solved ? <p className={correct ? "ok" : "warn"}>{correct ? quiz.feedback : "Try again after checking the tips."}</p> : null}
    </section>
  );
}
