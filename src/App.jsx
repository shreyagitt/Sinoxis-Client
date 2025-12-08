import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Pages
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
          <Layout>
            < Dashboard/>
          </Layout>
        }
      />

  <Route
        path="/pending"
        element={
          <Layout>
            < Pending/>
          </Layout>
        }
      />


      <Route
        path="/releases/myRelease"
        element={
          <Layout>
            < MyReleases/>
          </Layout>
        }
      />

       <Route
        path="/releases/create"
        element={
          <Layout>
            < ReleaseForm/>
          </Layout>
        }
      />

             <Route
        path="/releases/edit/:id"
        element={
          <Layout>
            < ReleaseForm/>
          </Layout>
        }
      />


      <Route
        path="/artists/list"
        element={
          <Layout>
            < Artist/>
          </Layout>
        }
      />

      <Route
        path="/lables/list"
        element={
          <Layout>
            < Labels/>
          </Layout>
        }
      />

<Route
        path="/revenue/reports"
        element={
          <Layout>
            < RevenueReport/>
          </Layout>
        }
      />
      <Route
        path="/revenue/total"
        element={
          <Layout>
            < TotalRevenueAnalytics/>
          </Layout>
        }
      />

      <Route
        path="/revenue/request"
        element={
          <Layout>
            < RequestPayment/>
          </Layout>
        }
      />
       
       <Route
        path="/services/youtube-oac"
        element={
          <Layout>
            < YouTubeOACRequestForm/>
          </Layout>
        }
      />
      <Route
        path="/services/claim"
        element={
          <Layout>
            < YouTubeClaimRelease/>
          </Layout>
        }
      />
      <Route
        path="/services/facebook-insta-profile"
        element={
          <Layout>
            < SocialIsrcSubmitForm/>
          </Layout>
        }
      />

       <Route
        path="/services/facebook-claim"
        element={
          <Layout>
            < FacebookVideoLinkSubmitForm />
          </Layout>
        }
      />

<Route
        path="/services/metadata-update"
        element={
          <Layout>
            < MetadataUpdateForm />
          </Layout>
        }
      />

      <Route
        path="/requests/claim"
        element={
          <Layout>
            < CopyrightClaim />
          </Layout>
        }
      />

       <Route
        path="/requests/artist"
        element={
          <Layout>
            < OfficialArtistChannel />
          </Layout>
        }
      />
      

 

 <Route
  path="/settings/password"
  element={
    <Layout>
      <ChangePass />
    </Layout>
  }
/>

 <Route
  path="/settings/bank-details"
  element={
    <Layout>
      <BankDetails />
    </Layout>
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

