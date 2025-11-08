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
import Service from './components/Service';
import Revenue from './components/Revenue';
import ChangePass from './components/ChangePass';
import BankDetails from './components/BankDetails';
import Login from './components/Login';
import ApplyForm from './components/ApplyForm';



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
          <Layout>
            <Home />
          </Layout>
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
        path="/releases/myRelease"
        element={
          <Layout>
            < MyReleases/>
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
        path="/artists/labels"
        element={
          <Layout>
            < Labels/>
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

      

      
     
    </Routes>
  );
}

export default App;

