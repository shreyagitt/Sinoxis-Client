import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Setting from './pages/Setting'

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

         <Route
          path="/settings"
          element={
            <Layout>
              <Setting />
            </Layout>
          }
        />

       
      </Routes>
    </Router>
  );
};

export default App;


