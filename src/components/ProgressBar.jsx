export default function ProgressBar({ value }) {
  const progress = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div className="h-2.5 overflow-hidden rounded-md bg-zinc-100" aria-label={`${progress}% complete`}>
      <div
        className="h-full rounded-md bg-emerald-600 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
