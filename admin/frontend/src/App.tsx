import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setToken } from "./features/auth/authSlice";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Layout from "./Components/layout/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Artist from "./pages/Artist";
import Label from "./pages/Label";
import ReleasesPage from "./pages/Release";
import Notification from "./pages/Notification";
import BankSetting from "./pages/BankSetting";
import ApplyFormManagement from "./pages/ApplyFormManagement";
import Setting from "./pages/Setting";
import RequestPayment from './pages/RequestPayment';
import RevenueReport from './pages/RevenueReport';
import TotalRevenue from './pages/TotalRevenue';

import "./index.css";
import AdminYouTubeOACRequests from "./pages/YouTubeOACRequests";
import AdminYouTubeClaims from "./pages/YouTubeClaim";
import AdminSocialISRC from "./pages/SocialISRC";
import Metadata from './pages/Metadata';
import FacebookClaim from './pages/FacebookVideo'
import RegisterPage from "./pages/RegisterPage";
import CopyClaimManagement from "./pages/CopyClaimManagement";
import AdminOACPage from "./pages/OACpage";
import UserManagement from "./pages/UserManagement";
import Store from "./pages/Store";
import GenresPage from "./pages/genrePage";
import LanguagesPage from "./pages/Language";

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();

  // Restore token when page refreshes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(setToken(token));
  }, [dispatch]);

  return (
    <>
      {/* FULL ToastContainer (your requested config) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Router>
        <div className="App">
          {/* Hot Toaster (inside .App just like old project) */}
          <Toaster position="top-right" />

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/login"
              element={
                <Layout hideChrome>
                  <Login />
                </Layout>
              }
            />


          <Route
              path="/register"
              element={
                <Layout hideChrome>
                  <RegisterPage />
                </Layout>
              }
            />  

            {/* Redirect root → login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* PROTECTED ROUTES */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/artists"
              element={
                <ProtectedRoute>
                  <Layout><Artist /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/labels"
              element={
                <ProtectedRoute>
                  <Layout><Label /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Layout><UserManagement /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Layout><Store /></Layout>
                </ProtectedRoute>
              }
            />

             <Route
              path="/genre"
              element={
                <ProtectedRoute>
                  <Layout><GenresPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/releases"
              element={
                <ProtectedRoute>
                  <Layout><ReleasesPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/revenue/request"
              element={
                <ProtectedRoute>
                  <Layout><RequestPayment /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/revenue/reports"
              element={
                <ProtectedRoute>
                  <Layout><RevenueReport /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/revenue/total"
              element={
                <ProtectedRoute>
                  <Layout><TotalRevenue /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/requests/copyright"
              element={
                <ProtectedRoute>
                  <Layout><CopyClaimManagement/></Layout>
                </ProtectedRoute>
              }
            />
<Route
              path="/requests/channel"
              element={
                <ProtectedRoute>
                  <Layout><AdminOACPage/></Layout>
                </ProtectedRoute>
              }
            />


            <Route
              path="/services/youtube-oac"
              element={
                <ProtectedRoute>
                  <Layout><AdminYouTubeOACRequests/></Layout>
                </ProtectedRoute>
              }
            />

 <Route
              path="/services/claim"
              element={
                <ProtectedRoute>
                  <Layout><AdminYouTubeClaims/></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/services/facebook-insta-profile"
              element={
                <ProtectedRoute>
                  <Layout><AdminSocialISRC/></Layout>
                </ProtectedRoute>
              }
            />
            

 <Route
              path="/services/metadata-update"
              element={
                <ProtectedRoute>
                  <Layout><Metadata/></Layout>
                </ProtectedRoute>
              }
            />
 <Route
              path="/services/facebook-claim"
              element={
                <ProtectedRoute>
                  <Layout><FacebookClaim/></Layout>
                </ProtectedRoute>
              }
            />


            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout><Notification /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/banksettings"
              element={
                <ProtectedRoute>
                  <Layout><BankSetting /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <Layout><ApplyFormManagement /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/language"
              element={
                <ProtectedRoute>
                  <Layout><LanguagesPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout><Setting /></Layout>
                </ProtectedRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default AppRoutes;

