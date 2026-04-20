import { Activity, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import SectionLoader from "../components/SectionLoader.jsx";
import { useAiStudyCoach } from "../hooks/useAiStudyCoach.js";
import { useStudyInsights } from "../hooks/useStudyInsights.js";
import { useTopics } from "../hooks/useTopics.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { topics, loading, error } = useTopics();
  const insights = useStudyInsights(topics);
  const aiCoach = useAiStudyCoach(topics, insights);

  if (loading) {
    return <SectionLoader label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">Today's study pulse</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            A live view of progress, risk topics, and the highest-impact next move.
          </p>
        </div>
        <Link
          to="/topics"
          className="focus-ring rounded-md bg-zinc-950 px-4 py-3 text-center text-sm font-extrabold text-white transition hover:bg-zinc-800"
        >
          Manage Topics
        </Link>
      </div>

      {error && <p className="rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}

      {!topics.length ? (
        <EmptyState
          title="No topics yet"
          message="Add your first topic and StudyPulse will start calculating weak areas, progress, and recommendations."
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Topics" value={insights.totalTopics} helper="tracked" accent="zinc" />
            <MetricCard label="Completed" value={`${insights.averageProgress}%`} helper="average" accent="emerald" />
            <MetricCard label="Risk Topics" value={insights.weakTopics.length} helper="multi-signal" accent="rose" />
            <MetricCard label="Revision Health" value={`${insights.revisionHealth}%`} helper="freshness" accent="amber" />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-zinc-950">Smart recommendation</h2>
              </div>
              {insights.recommendations.slice(0, 2).map((item) => (
                <div key={item.title} className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-extrabold text-zinc-950">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                to="/topics"
                className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-zinc-800"
              >
                Review Topic Checklists
              </Link>
            </div>

            <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h2 className="text-lg font-extrabold text-zinc-950">Weak areas</h2>
              </div>
              <div className="mt-5 space-y-4">
                {insights.weakTopics.slice(0, 4).map((topic) => (
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
                    No high-risk topics right now. Keep revising to prevent completed topics from going stale.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-zinc-950">Category distribution</h2>
              <div className="mt-5 space-y-4">
                {insights.categoryBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="font-bold text-zinc-800">{item.category}</span>
                      <span className="font-bold text-zinc-500">{item.count} topics</span>
                    </div>
                    <ProgressBar value={item.share} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-zinc-950">AI study coach</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {aiCoach.map((item) => (
                  <article key={item.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-extrabold text-zinc-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.summary}</p>
                    <div className="mt-4 border-t border-zinc-200 pt-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">Practice prompts</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-600">
                        {item.questions.slice(0, 2).map((question) => (
                          <li key={question}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-zinc-700" />
              <h2 className="text-lg font-extrabold text-zinc-950">Recent activity</h2>
            </div>
            <div className="mt-4 divide-y divide-zinc-100">
              {topics.slice(0, 5).map((topic) => (
                <div key={topic.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-bold text-zinc-900">{topic.title}</p>
                    <p className="text-sm text-zinc-500">{topic.category} - {topic.lastStudied || "No date"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {insights.getStatus(topic.progress)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
