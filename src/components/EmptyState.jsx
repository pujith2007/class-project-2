import { PlusCircle } from "lucide-react";

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-emerald-50 text-emerald-700">
        <PlusCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-zinc-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">{message}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="focus-ring mt-5 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
