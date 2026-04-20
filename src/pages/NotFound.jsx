import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-6 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-950">This page drifted off schedule.</h1>
        <p className="mt-3 text-zinc-500">Return to your dashboard and keep the plan moving.</p>
        <Link
          to="/"
          className="focus-ring mt-6 inline-flex rounded-md bg-zinc-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
