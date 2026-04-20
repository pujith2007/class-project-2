import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { isFirebaseConfigured } from "../services/firebase.js";
import { createTopic, deleteTopic, subscribeToTopics, updateTopic } from "../services/topicService.js";
import { normalizeTopic } from "../services/topicHelpers.js";

const TopicsContext = createContext(null);

export function TopicsProvider({ children }) {
  const { currentUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setTopics([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = subscribeToTopics(
      currentUser.uid,
      (items) => {
        setTopics(items.map(normalizeTopic));
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const addTopic = useCallback(
    async (topic) => {
      if (!currentUser) throw new Error("You must be logged in to add a topic.");
      setIsMutating(true);
      try {
        const createdTopic = await createTopic(currentUser.uid, topic);
        if (!isFirebaseConfigured) {
          setTopics((current) => [normalizeTopic(createdTopic), ...current]);
        }
        return createdTopic;
      } finally {
        setIsMutating(false);
      }
    },
    [currentUser]
  );

  const editTopic = useCallback(
    async (topicId, topic) => {
      if (!currentUser) throw new Error("You must be logged in to edit a topic.");
      setIsMutating(true);
      try {
        await updateTopic(currentUser.uid, topicId, topic);
        if (!isFirebaseConfigured) {
          setTopics((current) =>
            current.map((item) => (item.id === topicId ? normalizeTopic({ ...item, ...topic }) : item))
          );
        }
      } finally {
        setIsMutating(false);
      }
    },
    [currentUser]
  );

  const removeTopic = useCallback(
    async (topicId) => {
      if (!currentUser) throw new Error("You must be logged in to delete a topic.");
      setIsMutating(true);
      try {
        await deleteTopic(currentUser.uid, topicId);
        if (!isFirebaseConfigured) {
          setTopics((current) => current.filter((item) => item.id !== topicId));
        }
      } finally {
        setIsMutating(false);
      }
    },
    [currentUser]
  );

  const value = useMemo(
    () => ({
      topics,
      loading,
      error,
      isMutating,
      addTopic,
      editTopic,
      removeTopic
    }),
    [topics, loading, error, isMutating, addTopic, editTopic, removeTopic]
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
}

export function useTopicsContext() {
  const context = useContext(TopicsContext);

  if (!context) {
    throw new Error("useTopicsContext must be used inside TopicsProvider");
  }

  return context;
}
