import { useMemo } from "react";

function buildSummary(topic) {
  const remaining = topic.subtopics?.filter((item) => !item.done).map((item) => item.title) || [];
  const revisedLabel = topic.lastStudied ? `Last revised on ${topic.lastStudied}.` : "No revision date recorded yet.";

  if (!remaining.length) {
    return `${topic.title} is currently fully checked off. ${revisedLabel} Focus on active recall, one timed question, and one short explanation in your own words.`;
  }

  return `${topic.title} still needs attention on ${remaining.slice(0, 2).join(" and ")}. ${revisedLabel} Finish the unchecked parts, then revise notes once more.`;
}

function buildQuestions(topic) {
  const focusArea = topic.subtopics?.find((item) => !item.done)?.title || topic.title;

  return [
    `Explain ${focusArea} in simple terms without looking at notes.`,
    `What is one common mistake students make in ${topic.title}?`,
    `Solve one practice task related to ${focusArea} and justify each step.`
  ];
}

export function useAiStudyCoach(topics, insights) {
  return useMemo(() => {
    const targetTopics = insights.weakTopics.length ? insights.weakTopics.slice(0, 3) : topics.slice(0, 3);

    return targetTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      summary: buildSummary(topic),
      questions: buildQuestions(topic)
    }));
  }, [topics, insights]);
}
