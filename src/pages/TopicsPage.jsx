import { useCallback, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import SectionLoader from "../components/SectionLoader.jsx";
import TopicForm from "../components/TopicForm.jsx";
import TopicList from "../components/TopicList.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import { useStudyInsights } from "../hooks/useStudyInsights.js";
import { useTopics } from "../hooks/useTopics.js";

export default function TopicsPage() {
  const { topics, loading, error, isMutating, addTopic, editTopic, removeTopic } = useTopics();
  const { getStatus } = useStudyInsights(topics);
  const { showToast } = useFeedback();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = useCallback(
    async (topic) => {
      setSaving(true);
      setFormError("");

      try {
        if (selectedTopic) {
          await editTopic(selectedTopic.id, topic);
          setSelectedTopic(null);
          showToast({ tone: "success", title: "Topic updated", message: "Your checklist changes were saved." });
        } else {
          await addTopic(topic);
          showToast({ tone: "success", title: "Topic added", message: "A new study track was created." });
        }
      } catch (err) {
        setFormError(err.message);
        showToast({ tone: "error", title: "Save failed", message: err.message });
      } finally {
        setSaving(false);
      }
    },
    [addTopic, editTopic, selectedTopic, showToast]
  );

  const handleDelete = useCallback(
    async (topicId) => {
      const confirmed = window.confirm("Delete this topic? This action cannot be undone.");
      if (!confirmed) return;
      try {
        await removeTopic(topicId);
        showToast({ tone: "success", title: "Topic deleted", message: "Removed from your study plan." });
      } catch (error) {
        showToast({ tone: "error", title: "Delete failed", message: error.message });
      }
    },
    [removeTopic, showToast]
  );

  const handleToggleSubtopic = useCallback(
    async (topic, subtopicId) => {
      const nextSubtopics = topic.subtopics.map((item) =>
        item.id === subtopicId ? { ...item, done: !item.done } : item
      );

      try {
        await editTopic(topic.id, {
          ...topic,
          subtopics: nextSubtopics,
          lastStudied: new Date().toISOString().slice(0, 10)
        });
      } catch (error) {
        showToast({ tone: "error", title: "Checklist update failed", message: error.message });
      }
    },
    [editTopic, showToast]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Study Topics</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950">Plan and track every topic</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Break each big topic into checkable parts so progress is earned by completed subtopics, not self-reported.
        </p>
        {isMutating && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Syncing your latest study changes...
          </p>
        )}

        <div className="mt-6">
          <TopicForm
            selectedTopic={selectedTopic}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedTopic(null)}
            isSaving={saving}
          />
          {formError && <p className="mt-3 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{formError}</p>}
        </div>
      </div>

      <section>
        {error && <p className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        {loading ? (
          <SectionLoader label="Loading topics..." />
        ) : topics.length ? (
          <TopicList
            topics={topics}
            getStatus={getStatus}
            onEdit={setSelectedTopic}
            onDelete={handleDelete}
            onToggleSubtopic={handleToggleSubtopic}
          />
        ) : (
          <EmptyState
            title="Your syllabus is waiting"
            message="Create big topics, generate subtopics, and let students tick the finished parts. That makes progress more believable."
          />
        )}
      </section>
    </div>
  );
}
