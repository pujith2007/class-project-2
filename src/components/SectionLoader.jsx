export default function SectionLoader({ label = "Loading..." }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100" />
        <p className="pt-2 text-sm font-semibold text-zinc-500">{label}</p>
      </div>
    </div>
  );
}
