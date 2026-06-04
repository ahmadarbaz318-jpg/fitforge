import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaDumbbell, FaCalculator, FaTachometerAlt, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/gym-tracker", icon: <FaDumbbell />, label: "Gym Tracker" },
    { path: "/plate-calculator", icon: <FaCalculator />, label: "Plate Calc" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-3 flex justify-between items-center
      bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg">

      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-2xl">💪</span>
        <span className="font-extrabold text-xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400
          bg-clip-text text-transparent">
          FitForge
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition duration-200
              ${location.pathname === item.path
                ? "bg-blue-500/30 border border-blue-400/50 text-blue-300"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-white">
            {user.name || user.email?.split("@")[0] || "Athlete"}
          </span>
          <span className="text-xs text-gray-400 capitalize">
            {user.level || "Member"}
          </span>
        </div>
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300
            hover:bg-white/15 active:scale-95 transition duration-200 flex items-center justify-center cursor-pointer"
        >
          {theme === "dark" ? <FaSun className="text-yellow-400 w-4 h-4" /> : <FaMoon className="text-blue-500 w-4 h-4" />}
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=${user.name || "User"}&background=3b82f6&color=fff&rounded=true`}
          alt="profile"
          className="w-9 h-9 rounded-full border-2 border-blue-400/50"
        />
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400
            hover:bg-red-500/20 transition duration-200"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
