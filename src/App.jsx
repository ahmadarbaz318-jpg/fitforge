import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Details from "./pages/details";
import Dashboard from "./pages/Dashboard";
import Gender from "./pages/gender";
import Level from "./pages/level";
import Welcome from "./pages/welcome";
import GymTracker from "./pages/GymTracker";
import PlateCalculator from "./pages/PlateCalculator";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/details" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/level" element={<Level />} />
        <Route path="/gym-tracker" element={<GymTracker />} />
        <Route path="/plate-calculator" element={<PlateCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;