import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Setting from './pages/Setting';
import Artist from "./pages/Artist";
import Label from './pages/Label';
import ReleasesPage from "./pages/Release";
import Notification from './pages/Notification';
import Revenue from './pages/Revenue';
import Service from './pages/Service';
import BankSetting from './pages/BankSetting';
import ApplyForm from './pages/ApplyFormManagement';
import ApplyFormManagement from "./pages/ApplyFormManagement";

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
          path="/artists"
          element={
            <Layout>
              <Artist />
            </Layout>
          }
        />

         <Route
          path="/labels"
          element={
            <Layout>
              <Label />
            </Layout>
          }
        />

         <Route
          path="/releases"
          element={
            <Layout>
              <ReleasesPage />
            </Layout>
          }
        />

        
         <Route
          path="/notifications"
          element={
            <Layout>
              <Notification />
            </Layout>
          }
        />

        <Route
          path="/revenue"
          element={
            <Layout>
              <Revenue />
            </Layout>
          }
        />

         <Route
          path="/services"
          element={
            <Layout>
              <Service />
            </Layout>
          }
        />

 <Route
          path="/banksettings"
          element={
            <Layout>
              <BankSetting />
            </Layout>
          }
        />

         <Route
          path="/Form"
          element={
            <Layout>
              <ApplyFormManagement />
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


