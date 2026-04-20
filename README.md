# StudyPulse AI

StudyPulse AI is a production-style React application for tracking study topics, identifying weak areas, and generating logic-based study recommendations.

## Step-by-Step Setup

1. Install dependencies.

```bash
npm install
```

2. Create `.env` from `.env.example` and add your Firebase web app config.

3. In Firebase Console, enable Authentication with Email/Password.

4. Create a Firestore database.

5. Run the app.

```bash
npm run dev
```

If Firebase keys are not added yet, the app automatically runs in demo mode using `localStorage`. That makes it usable immediately for UI review and viva practice.

## File Structure

```text
src/
  components/       Reusable UI such as shell, forms, cards, lists, loaders
  context/          Global auth state using Context API
  hooks/            Reusable stateful logic for topics and insights
  pages/            Route-level screens loaded with React.lazy
  services/         Firebase, auth, and Firestore API functions
  main.jsx          Router, protected routes, lazy loading, app bootstrap
  styles.css        Tailwind imports and global styles
```

This structure separates UI, business logic, global state, and backend access. That makes the project easier to scale because changing Firebase logic does not require rewriting page components.

## Firebase Data Shape

Each authenticated user owns their own topics:

```text
users/{userId}/topics/{topicId}
```

Topic fields:

```js
{
  title: "Binary Trees",
  category: "DSA",
  difficulty: "Hard",
  progress: 35,
  lastStudied: "2026-04-19",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Suggested Firestore Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/topics/{topicId} {
      allow read, create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Key React Concepts Demonstrated

- `useState`: auth form, topic form, selected edit topic, mobile sidebar state.
- `useEffect`: Firebase auth listener and Firestore real-time topic subscription.
- Props: reusable components receive data and callbacks from pages.
- Conditional rendering: loading, error, empty, authenticated, and unauthenticated states.
- Lists and keys: topic lists, recommendation cards, recent activity.
- Lifting state up: `TopicsPage` owns `selectedTopic` and passes it to `TopicForm` and `TopicList`.
- Controlled components: login/signup and topic forms store input values in React state.
- Context API: `AuthContext` provides the current Firebase user across the app.
- Routing: React Router handles public, protected, and nested routes.
- `useMemo`: auth context value and study insight calculations.
- `useCallback`: stable CRUD handlers in `useTopics` and `TopicsPage`.
- `useRef`: focuses the topic title input when adding or editing.
- `React.lazy` and `Suspense`: route pages are code-split for better performance.

## Smart Insight Logic

The app feels AI-powered through explainable rules:

- Topics below 50% are weak areas.
- Categories with average progress below 60% are weak categories.
- Topics not studied for 7 or more days are stale revision candidates.
- The next topic is chosen from weakest progress first, then stale topics.
- Recommendations explain why a topic was selected.

## Viva Questions and Strong Answers

**Q: Why did you use Firebase?**  
A: Firebase gives managed authentication and real-time Firestore storage, so the app has a real backend without building a custom server. It is suitable for student projects because it still demonstrates production concepts like auth, protected data, and database CRUD.

**Q: How are protected routes implemented?**  
A: `ProtectedRoute` reads `isAuthenticated` from `AuthContext`. While Firebase checks the persisted session, it shows a loader. If there is no user, it redirects to `/auth`; otherwise it renders the app shell.

**Q: Where is the AI in the app?**  
A: It is logic-based AI. The app analyzes progress, last studied dates, and category averages to detect weak topics and suggest the next study action. The logic is deterministic and explainable, which is useful in a viva.

**Q: Why did you use `useMemo`?**  
A: Insight calculations run over all topics and produce derived data like weak topics and category health. `useMemo` recalculates only when `topics` changes, avoiding unnecessary work on unrelated renders.

**Q: Why did you use `useCallback`?**  
A: CRUD handlers are passed to child components. `useCallback` keeps those function references stable unless their dependencies change, which helps avoid avoidable child re-renders.

**Q: What is lifting state up in this project?**  
A: `TopicsPage` owns `selectedTopic`. `TopicList` updates it when the user clicks edit, and `TopicForm` receives it to switch into edit mode. Both children coordinate through parent state.

**Q: How is user data secured?**  
A: Data is stored under `users/{userId}/topics`. Firestore rules should allow access only when `request.auth.uid == userId`, so users can only read and modify their own topics.

**Q: Why split services from components?**  
A: Components should focus on UI. Firebase calls live in `services`, so backend logic is reusable, testable, and easier to replace later.

**Q: How is performance improved?**  
A: Pages are lazy-loaded, expensive insight calculations are memoized, callbacks are stable, and Firestore subscriptions are cleaned up in `useEffect`.

**Q: What makes this more than a todo app?**  
A: The app tracks topic difficulty, progress, study freshness, weak categories, completion status, and generates prioritized recommendations. It solves study planning, not just item storage.
