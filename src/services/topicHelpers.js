function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categorySubtopicTemplates = {
  DSA: ["Concepts", "Core operations", "Complexity analysis", "Practice problems", "Revision notes"],
  React: ["Core concepts", "Components and props", "State and hooks", "Project implementation", "Revision notes"],
  Database: ["Core concepts", "Queries", "Normalization", "Practice questions", "Revision notes"],
  "Operating Systems": ["Core concepts", "Processes and scheduling", "Memory management", "Practice questions", "Revision notes"],
  Networking: ["Core concepts", "Protocols", "Architecture", "Practice questions", "Revision notes"],
  Aptitude: ["Concepts", "Shortcuts", "Timed practice", "Common mistakes", "Revision notes"]
};

export function createSuggestedSubtopics(title, category) {
  const cleanTitle = title?.trim() || "Topic";
  const categoryItems = categorySubtopicTemplates[category] || [
    "Core concepts",
    "Important points",
    "Practice",
    "Revision"
  ];

  return categoryItems.map((item, index) => ({
    id: `${slugify(cleanTitle)}-${index + 1}`,
    title: `${cleanTitle} - ${item}`,
    done: false
  }));
}

export function normalizeSubtopics(subtopics, fallbackTitle, fallbackCategory) {
  if (Array.isArray(subtopics) && subtopics.length) {
    return subtopics.map((item, index) => ({
      id: item.id || `${slugify(item.title || fallbackTitle || "topic")}-${index + 1}`,
      title: item.title || `Subtopic ${index + 1}`,
      done: Boolean(item.done)
    }));
  }

  return createSuggestedSubtopics(fallbackTitle, fallbackCategory);
}

export function calculateTopicProgress(subtopics) {
  if (!subtopics.length) return 0;
  const completedCount = subtopics.filter((item) => item.done).length;
  return Math.round((completedCount / subtopics.length) * 100);
}

export function prepareTopicPayload(topic, existingTopic) {
  const nextSubtopics = normalizeSubtopics(topic.subtopics, topic.title, topic.category).map((item, index) => {
    const previousMatch = existingTopic?.subtopics?.find(
      (previousItem) => previousItem.id === item.id || previousItem.title === item.title
    );

    return {
      id: item.id || `${slugify(topic.title || "topic")}-${index + 1}`,
      title: item.title,
      done: previousMatch ? previousMatch.done : Boolean(item.done)
    };
  });

  return {
    ...topic,
    subtopics: nextSubtopics,
    progress: calculateTopicProgress(nextSubtopics)
  };
}

export function normalizeTopic(topic) {
  const subtopics = normalizeSubtopics(topic.subtopics, topic.title, topic.category);

  return {
    ...topic,
    subtopics,
    progress: calculateTopicProgress(subtopics)
  };
}
