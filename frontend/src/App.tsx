import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Pages inside layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Add other routes wrapped with Layout */}
        <Route
          path="*"
          element={
            <Layout>
              <h1 className="text-center mt-10 text-xl">Page Not Found</h1>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


