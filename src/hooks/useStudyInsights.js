import { useMemo } from "react";

function daysSince(dateValue) {
  if (!dateValue) return Number.POSITIVE_INFINITY;
  const today = new Date();
  const studiedDate = new Date(dateValue);
  const difference = today.getTime() - studiedDate.getTime();
  return Math.floor(difference / (1000 * 60 * 60 * 24));
}

function getStatus(progress) {
  if (progress >= 100) return "Completed";
  if (progress > 0) return "In Progress";
  return "Not Started";
}

const difficultyPenalty = {
  Easy: 6,
  Medium: 12,
  Hard: 18
};

function getFreshnessPenalty(days) {
  if (days <= 2) return 0;
  if (days <= 5) return 8;
  if (days <= 10) return 18;
  if (days <= 20) return 28;
  return 36;
}

function getIncompletePenalty(progress) {
  return Math.round((100 - Number(progress || 0)) * 0.55);
}

function analyzeTopicRisk(topic) {
  const days = daysSince(topic.lastStudied);
  const progress = Number(topic.progress || 0);
  const incompleteSubtopics = (topic.subtopics || []).filter((item) => !item.done).length;
  const reasons = [];

  const incompletePenalty = getIncompletePenalty(progress);
  const freshnessPenalty = getFreshnessPenalty(days);
  const difficultyRisk = difficultyPenalty[topic.difficulty] || 10;

  if (incompleteSubtopics > 0) {
    reasons.push(`${incompleteSubtopics} subtopics still unchecked`);
  }

  if (days >= 7) {
    reasons.push(`not revised for ${days} days`);
  }

  if (topic.difficulty === "Hard") {
    reasons.push("high difficulty topic");
  }

  const riskScore = Math.min(100, incompletePenalty + freshnessPenalty + difficultyRisk);

  return {
    ...topic,
    daysSinceLastStudied: days,
    incompleteSubtopics,
    riskScore,
    reasons
  };
}

export function useStudyInsights(topics) {
  return useMemo(() => {
    const analyzedTopics = topics.map(analyzeTopicRisk);
    const totalTopics = topics.length;
    const averageProgress = totalTopics
      ? Math.round(topics.reduce((sum, topic) => sum + Number(topic.progress || 0), 0) / totalTopics)
      : 0;

    const completedTopics = topics.filter((topic) => Number(topic.progress) >= 100).length;
    const weakTopics = analyzedTopics.filter((topic) => topic.riskScore >= 35).sort((a, b) => b.riskScore - a.riskScore);

    const staleTopics = analyzedTopics
      .filter((topic) => topic.daysSinceLastStudied >= 7)
      .sort((a, b) => b.daysSinceLastStudied - a.daysSinceLastStudied);

    const nextTopic = weakTopics[0] || staleTopics[0] || analyzedTopics.sort((a, b) => b.riskScore - a.riskScore)[0] || null;

    const categoryScores = analyzedTopics.reduce((acc, topic) => {
      const category = topic.category || "Uncategorized";
      if (!acc[category]) acc[category] = { category, count: 0, totalProgress: 0, totalRisk: 0 };
      acc[category].count += 1;
      acc[category].totalProgress += Number(topic.progress || 0);
      acc[category].totalRisk += topic.riskScore;
      return acc;
    }, {});

    const weakCategories = Object.values(categoryScores)
      .map((item) => ({
        category: item.category,
        average: Math.round(item.totalProgress / item.count),
        risk: Math.round(item.totalRisk / item.count)
      }))
      .filter((item) => item.risk >= 35)
      .sort((a, b) => b.risk - a.risk);

    const categoryBreakdown = Object.values(categoryScores)
      .map((item) => ({
        category: item.category,
        count: item.count,
        share: Math.round((item.count / totalTopics) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const freshnessScores = analyzedTopics.map((topic) => Math.max(0, 100 - getFreshnessPenalty(topic.daysSinceLastStudied)));
    const revisionHealth = freshnessScores.length
      ? Math.round(freshnessScores.reduce((sum, value) => sum + value, 0) / freshnessScores.length)
      : 0;

    const recommendations = [];

    if (nextTopic) {
      recommendations.push({
        title: `Revise ${nextTopic.title} today`,
        body: `${nextTopic.title} has a risk score of ${nextTopic.riskScore} because ${nextTopic.reasons.join(", ") || "it needs reinforcement"}.`,
        priority: "High"
      });
    }

    if (weakCategories[0]) {
      recommendations.push({
        title: `You are weak in ${weakCategories[0].category}`,
        body: `This category has the highest average risk score at ${weakCategories[0].risk}.`,
        priority: "Medium"
      });
    }

    if (staleTopics[0]) {
      recommendations.push({
        title: `${staleTopics[0].title} needs spaced revision`,
        body: `It has been ${staleTopics[0].daysSinceLastStudied} days since you last revised it.`,
        priority: "Medium"
      });
    }

    if (!recommendations.length && totalTopics) {
      recommendations.push({
        title: "Strong momentum",
        body: "Most topics are healthy. Pick one completed topic for a quick active recall test.",
        priority: "Low"
      });
    }

    return {
      totalTopics,
      averageProgress,
      completedTopics,
      revisionHealth,
      weakTopics,
      weakCategories,
      categoryBreakdown,
      staleTopics,
      nextTopic,
      analyzedTopics,
      recommendations,
      getStatus
    };
  }, [topics]);
}
