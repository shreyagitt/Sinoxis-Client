import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Pages
import Home from "./pages/Home";
import LoginPage from "./components/Login";
import BankDetails from "./components/BankDetails";

// Layout
import Layout from "./components/Layout"; // adjust path as needed
import ChangePassword from "./components/ChangePass";
import Service from './components/Service'

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
            <Service />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

