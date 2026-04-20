import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { prepareTopicPayload } from "./topicHelpers";

const DEMO_TOPICS_KEY = "study-pulse-demo-topics";

function readDemoTopics() {
  const rawValue = localStorage.getItem(DEMO_TOPICS_KEY);
  return rawValue ? JSON.parse(rawValue) : [];
}

function writeDemoTopics(topics) {
  localStorage.setItem(DEMO_TOPICS_KEY, JSON.stringify(topics));
}

function topicCollection(userId) {
  return collection(db, "users", userId, "topics");
}

export function subscribeToTopics(userId, onNext, onError) {
  if (!isFirebaseConfigured) {
    try {
      onNext(readDemoTopics());
      return () => {};
    } catch (error) {
      onError?.(error);
      return () => {};
    }
  }

  const topicsQuery = query(topicCollection(userId), orderBy("updatedAt", "desc"));

  return onSnapshot(
    topicsQuery,
    (snapshot) => {
      const topics = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));
      onNext(topics);
    },
    onError
  );
}

export function createTopic(userId, topic) {
  const payload = prepareTopicPayload(topic);

  if (!isFirebaseConfigured) {
    const topics = readDemoTopics();
    const nextTopic = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    writeDemoTopics([nextTopic, ...topics]);
    return Promise.resolve(nextTopic);
  }

  return addDoc(topicCollection(userId), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function updateTopic(userId, topicId, topic) {
  const payload = prepareTopicPayload(topic, topic);

  if (!isFirebaseConfigured) {
    const topics = readDemoTopics().map((item) =>
      item.id === topicId
        ? {
          ...item,
            ...payload,
            updatedAt: new Date().toISOString()
          }
        : item
    );
    writeDemoTopics(topics);
    return Promise.resolve();
  }

  const topicRef = doc(db, "users", userId, "topics", topicId);

  return updateDoc(topicRef, {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export function deleteTopic(userId, topicId) {
  if (!isFirebaseConfigured) {
    const topics = readDemoTopics().filter((item) => item.id !== topicId);
    writeDemoTopics(topics);
    return Promise.resolve();
  }

  const topicRef = doc(db, "users", userId, "topics", topicId);
  return deleteDoc(topicRef);
}
