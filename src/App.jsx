import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import Login from './components/Login'

// Import your pages/components
  // adjust path as needed

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
