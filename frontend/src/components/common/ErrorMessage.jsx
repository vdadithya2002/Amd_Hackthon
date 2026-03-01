export default function ErrorMessage({ message }) {
  return (
    <div className="panel error-panel">
      <h3>Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
}
