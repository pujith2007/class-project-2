export default function MetricCard({ label, value, helper, accent = "emerald" }) {
  const accents = {
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    zinc: "bg-zinc-100 text-zinc-700"
  };

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-3xl font-extrabold tracking-tight text-zinc-950">{value}</p>
        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${accents[accent]}`}>{helper}</span>
      </div>
    </section>
  );
}
