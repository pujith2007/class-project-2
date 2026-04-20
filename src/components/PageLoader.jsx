import { BrainCircuit } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-zinc-50 px-6 text-zinc-900">
      <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-5 py-4 shadow-soft">
        <BrainCircuit className="h-5 w-5 animate-pulse text-emerald-600" />
        <span className="text-sm font-semibold">Preparing your study space...</span>
      </div>
    </div>
  );
}
