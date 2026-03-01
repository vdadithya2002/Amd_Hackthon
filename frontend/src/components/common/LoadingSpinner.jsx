export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="panel">
      <div className="loader" />
      <p>{text}</p>
    </div>
  );
}
