import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Pages
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Home from "./pages/Home";
import Layout from './components/Layout'
import Dashboard from "./components/Dashboard";
import MyReleases from "./components/MyRelease";
import Artist from "./components/Artist";
import Labels from "./components/Labels";

import ChangePass from './components/ChangePass';
import BankDetails from './components/BankDetails';
import Login from './components/Login';
import ApplyForm from './components/ApplyForm';

import RevenueReport from "./components/RevenueReport";
import TotalRevenueAnalytics from "./components/TotalRevenueAnalytics";
import YouTubeOACRequestForm from "./components/YouTubeOACRequestForm";
import YouTubeClaimRelease from "./components/YouTubeClaimRelease";
import SocialIsrcSubmitForm from "./components/SocialIsrcSubmitForm";
import FacebookVideoLinkSubmitForm from "./components/FacebookVideoLinkSubmitForm";
import MetadataUpdateForm from "./components/MetadataUpdateForm";
import Register from "./components/Register";
import CopyrightClaim from "./components/CopyrightClaim";
import OfficialArtistChannel from "./components/OfficialArtistChannel";
import ReleaseForm from "./components/ReleaseForm";
import Pending from "./components/Pending";
import RequestPayment from "./components/RequestPayment";
import Tracks from "./components/Tracks";
import Stores from "./components/Stores";
import Submission from "./components/Submission";




function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
        
            <Home />
          
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
          <Layout>
            < Dashboard/>
          </Layout>
          </ProtectedRoute>
        }
      />

  <Route
        path="/pending"
        element={
          <ProtectedRoute>
          <Layout>
            < Pending/>
          </Layout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/releases/myRelease"
        element={
          <ProtectedRoute>
          <Layout>
            < MyReleases/>
          </Layout>
          </ProtectedRoute>
        }
      />

       <Route
        path="/releases/create"
        element={
          <ProtectedRoute>
          <Layout>
            < ReleaseForm/>
          </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute>
          <Layout>
            < Stores/>
          </Layout>
          </ProtectedRoute>
        }
      />

<Route
        path="/tracks"
        element={
          <ProtectedRoute>
          <Layout>
            < Tracks/>
          </Layout>
          </ProtectedRoute>
        }
      />


<Route
        path="/submission"
        element={
          <ProtectedRoute>
          <Layout>
            < Submission/>
          </Layout>
          </ProtectedRoute>
        }
      />

             <Route
        path="/releases/edit/:id"
        element={
          <ProtectedRoute>
          <Layout>
            < ReleaseForm/>
          </Layout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/artists/list"
        element={
          <ProtectedRoute>
          <Layout>
            < Artist/>
          </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lables/list"
        element={
          <ProtectedRoute>
          <Layout>
            < Labels/>
          </Layout>
          </ProtectedRoute>
        }
      />

<Route
        path="/revenue/reports"
        element={
          <ProtectedRoute>
          <Layout>
            < RevenueReport/>
          </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/revenue/total"
        element={
          <ProtectedRoute>
          <Layout>
            < TotalRevenueAnalytics/>
          </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/revenue/request"
        element={
          <ProtectedRoute>
          <Layout>
            < RequestPayment/>
          </Layout>
          </ProtectedRoute>
        }
      />
       
       <Route
        path="/services/youtube-oac"
        element={
          <ProtectedRoute>
          <Layout>
            < YouTubeOACRequestForm/>
          </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/claim"
        element={
          <ProtectedRoute>
          <Layout>
            < YouTubeClaimRelease/>
          </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/facebook-insta-profile"
        element={
          <ProtectedRoute>
          <Layout>
            < SocialIsrcSubmitForm/>
          </Layout>
          </ProtectedRoute>
        }
      />

       <Route
        path="/services/facebook-claim"
        element={
          <ProtectedRoute>
          <Layout>
            < FacebookVideoLinkSubmitForm />
          </Layout>
          </ProtectedRoute>
        }
      />

<Route
        path="/services/metadata-update"
        element={
          <ProtectedRoute>
          <Layout>
            < MetadataUpdateForm />
          </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/claim"
        element={
           <ProtectedRoute>
          <Layout>
            < CopyrightClaim />
          </Layout>
           </ProtectedRoute>
        }
      />

       <Route
        path="/requests/artist"
        element={
           <ProtectedRoute>
          <Layout>
            < OfficialArtistChannel />
          </Layout>
           </ProtectedRoute>
        }
      />
      

 

 <Route
  path="/settings/password"
  element={
     <ProtectedRoute>
    <Layout>
      <ChangePass />
    </Layout>
  </ProtectedRoute>
}
/>


 <Route
  path="/settings/bank-details"
  element={
     <ProtectedRoute>
    <Layout>
      <BankDetails />
    </Layout>
     </ProtectedRoute>
  }
/>

 <Route
  path="/login"
  element={
    <Login />
  }
/>

<Route
  path="/apply"
  element={
    <ApplyForm />
  }
/>

<Route
  path="/register"
  element={
    <Register />
  }
/>   
    </Routes>
  );
}

export default App;

