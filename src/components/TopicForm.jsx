import { useEffect, useRef, useState } from "react";
import { createSuggestedSubtopics } from "../services/topicHelpers";

const initialForm = {
  title: "",
  category: "DSA",
  difficulty: "Medium",
  lastStudied: new Date().toISOString().slice(0, 10),
  notes: "",
  subtopicInput: ""
};

export default function TopicForm({ selectedTopic, onSubmit, onCancel, isSaving }) {
  const [formData, setFormData] = useState(initialForm);
  const titleRef = useRef(null);

  useEffect(() => {
    if (selectedTopic) {
      setFormData({
        title: selectedTopic.title || "",
        category: selectedTopic.category || "DSA",
        difficulty: selectedTopic.difficulty || "Medium",
        lastStudied: selectedTopic.lastStudied || initialForm.lastStudied,
        notes: selectedTopic.notes || "",
        subtopicInput: (selectedTopic.subtopics || []).map((item) => item.title).join("\n")
      });
    } else {
      setFormData(initialForm);
    }

    // useRef gives direct access to focus the first field after edit mode changes.
    titleRef.current?.focus();
  }, [selectedTopic]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const subtopics = formData.subtopicInput
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, index) => ({
        id: `${formData.title || "topic"}-${index + 1}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: item,
        done: selectedTopic?.subtopics?.find((subtopic) => subtopic.title === item)?.done || false
      }));

    onSubmit({
      title: formData.title,
      category: formData.category,
      difficulty: formData.difficulty,
      lastStudied: formData.lastStudied,
      notes: formData.notes,
      subtopics
    });
  }

  function handleGenerateSubtopics() {
    const suggestions = createSuggestedSubtopics(formData.title, formData.category);
    setFormData((current) => ({
      ...current,
      subtopicInput: suggestions.map((item) => item.title).join("\n")
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-950">{selectedTopic ? "Edit Topic" : "Add Study Topic"}</h2>
          <p className="mt-1 text-sm text-zinc-500">Keep every subject measurable and easy to revise.</p>
        </div>
        {selectedTopic && (
          <button type="button" onClick={onCancel} className="text-sm font-bold text-zinc-500 transition hover:text-zinc-950">
            Cancel
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-bold text-zinc-700">Topic title</span>
          <input
            ref={titleRef}
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Binary Trees"
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-zinc-700">Category</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          >
            <option>DSA</option>
            <option>React</option>
            <option>Database</option>
            <option>Operating Systems</option>
            <option>Networking</option>
            <option>Aptitude</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-zinc-700">Difficulty</span>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-zinc-700">Last studied</span>
          <input
            name="lastStudied"
            type="date"
            value={formData.lastStudied}
            onChange={handleChange}
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>

        <label className="md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-zinc-700">Subtopics checklist</span>
            <button
              type="button"
              onClick={handleGenerateSubtopics}
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700 transition hover:text-emerald-900"
            >
              Generate subtopics
            </button>
          </div>
          <textarea
            name="subtopicInput"
            value={formData.subtopicInput}
            onChange={handleChange}
            rows="6"
            placeholder={"Arrays - Concepts\nArrays - Traversal\nArrays - Practice questions"}
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-6"
          />
          <p className="mt-2 text-xs font-semibold text-zinc-500">Write one subtopic per line. Students will tick these items instead of manually claiming progress.</p>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-bold text-zinc-700">Key notes</span>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Important formulas, concepts, shortcuts, mistakes to avoid..."
            className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm leading-6"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="focus-ring mt-5 w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : selectedTopic ? "Update Topic" : "Add Topic"}
      </button>
    </form>
  );
}
