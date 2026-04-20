import { Brain, CalendarClock, Target } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import SectionLoader from "../components/SectionLoader.jsx";
import { useAiStudyCoach } from "../hooks/useAiStudyCoach.js";
import { useStudyInsights } from "../hooks/useStudyInsights.js";
import { useTopics } from "../hooks/useTopics.js";

export default function InsightsPage() {
  const { topics, loading } = useTopics();
  const insights = useStudyInsights(topics);
  const aiCoach = useAiStudyCoach(topics, insights);

  if (loading) {
    return <SectionLoader label="Loading insights..." />;
  }

  if (!topics.length) {
    return (
      <EmptyState
        title="Insights need study data"
        message="Add a few topics first. Weak-area detection and recommendations will appear automatically."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Smart Insights</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">Your revision strategy</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Logic-based AI ranks topics using incomplete subtopics, revision freshness, and difficulty instead of trusting only completion.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-3">
        {insights.recommendations.map((item) => (
          <article key={item.title} className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <Brain className="h-5 w-5" />
            </div>
            <p className="mt-4 text-lg font-extrabold text-zinc-950">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{item.body}</p>
            <span className="mt-4 inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-extrabold text-zinc-700">
              {item.priority} priority
            </span>
          </article>
        ))}
      </section>

      <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-extrabold text-zinc-950">AI-generated summaries and questions</h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {aiCoach.map((item) => (
            <article key={item.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-base font-extrabold text-zinc-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.summary}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-zinc-600">
                {item.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-rose-600" />
            <h2 className="text-lg font-extrabold text-zinc-950">Highest-risk topics</h2>
          </div>
          <div className="mt-5 space-y-4">
            {insights.weakTopics.slice(0, 6).map((topic) => (
              <div key={topic.id}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-bold text-zinc-800">{topic.title}</span>
                  <span className="font-bold text-rose-600">Risk {topic.riskScore}</span>
                </div>
                <ProgressBar value={topic.progress} />
                <p className="mt-2 text-xs font-semibold text-zinc-500">{topic.reasons.join(", ") || "Needs reinforcement"}</p>
              </div>
            ))}
            {!insights.weakTopics.length && (
              <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                No high-risk topics detected from the current checklist and revision pattern.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-extrabold text-zinc-950">Category health</h2>
          </div>
          <div className="mt-5 space-y-4">
            {insights.weakCategories.length ? (
              insights.weakCategories.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="font-bold text-zinc-800">{item.category}</span>
                    <span className="font-bold text-amber-700">Risk {item.risk}</span>
                  </div>
                  <ProgressBar value={Math.max(0, 100 - item.risk)} />
                  <p className="mt-2 text-xs font-semibold text-zinc-500">{item.average}% average completion</p>
                </div>
              ))
            ) : (
              <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                Category risk is healthy.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
