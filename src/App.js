import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Settings from "./components/Settings";
import PostItemPage from "./components/PostItemPage";
// Temporary placeholder for specific routes until Phase 2
import ItemList from "./components/ItemList";
import UserActivity from "./components/UserActivity";
import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./components/landing/LandingPage";
import SavedAlerts from "./components/SavedAlerts";


import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Trigger HMR update
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected App Routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="post-item" element={<PostItemPage />} />
              <Route path="feed" element={<div className="p-4"><ItemList /></div>} />
              <Route path="activity" element={<UserActivity />} />
              <Route path="saved" element={<SavedAlerts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
