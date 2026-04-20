import { CheckSquare, Edit3, Square, Trash2 } from "lucide-react";
import ProgressBar from "./ProgressBar.jsx";

const difficultyStyle = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700"
};

export default function TopicList({ topics, getStatus, onEdit, onDelete, onToggleSubtopic }) {
  return (
    <div className="grid gap-3">
      {topics.map((topic) => (
        <article
          key={topic.id}
          className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="break-words text-base font-extrabold text-zinc-950">{topic.title}</h3>
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">{topic.category}</span>
                <span className={`rounded-md px-2 py-1 text-xs font-bold ${difficultyStyle[topic.difficulty]}`}>
                  {topic.difficulty}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                {getStatus(topic.progress)} - Last studied {topic.lastStudied || "Not recorded"}
              </p>
              <div className="mt-4 max-w-xl">
                <ProgressBar value={topic.progress} />
                <p className="mt-2 text-xs font-bold text-zinc-500">{topic.progress}% complete</p>
              </div>
              <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">Subtopics</p>
                <div className="mt-3 space-y-2">
                  {topic.subtopics?.map((subtopic) => (
                    <label
                      key={subtopic.id}
                      className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={subtopic.done}
                        onChange={() => onToggleSubtopic(topic, subtopic.id)}
                        className="sr-only"
                      />
                      <span className={`mt-0.5 ${subtopic.done ? "text-emerald-600" : "text-zinc-400"}`}>
                        {subtopic.done ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </span>
                      <span className={`text-sm leading-6 ${subtopic.done ? "font-semibold text-zinc-400 line-through" : "text-zinc-700"}`}>
                        {subtopic.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {topic.notes && (
                <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">Key Notes</p>
                  <p className="mt-2 max-h-[4.5rem] overflow-hidden text-sm leading-6 text-zinc-600">{topic.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(topic)}
                className="focus-ring rounded-md border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:text-emerald-700"
                aria-label={`Edit ${topic.title}`}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(topic.id)}
                className="focus-ring rounded-md border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:text-rose-700"
                aria-label={`Delete ${topic.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
