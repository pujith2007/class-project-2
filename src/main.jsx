import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FeedbackProvider } from "./context/FeedbackContext.jsx";
import { TopicsProvider } from "./context/TopicsContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/AppShell.jsx";
import PageLoader from "./components/PageLoader.jsx";
import "./styles.css";

const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const TopicsPage = lazy(() => import("./pages/TopicsPage.jsx"));
const InsightsPage = lazy(() => import("./pages/InsightsPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FeedbackProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <TopicsProvider>
                      <AppShell />
                    </TopicsProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="topics" element={<TopicsPage />} />
                <Route path="insights" element={<InsightsPage />} />
              </Route>
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </FeedbackProvider>
    </BrowserRouter>
  </React.StrictMode>
);
