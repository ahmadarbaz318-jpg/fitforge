import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/card";
import Navbar from "../components/Navbar";

import {
  FaFire,
  FaChartLine,
  FaHistory,
  FaWeight,
  FaRulerVertical,
  FaDumbbell,
  FaBullseye,
  FaExclamationTriangle,
  FaCalculator,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const [yesterdayData, setYesterdayData] = useState([]);
  const [warning, setWarning] = useState({ text: "", type: "neutral" });
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeDays, setActiveDays] = useState(0);

  const getDate = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(savedUser);

    const data = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(data);

    const yesterday = getDate(-1);
    const today = getDate(0);

    const yData = data.filter((w) => w.date === yesterday);
    setYesterdayData(yData);

    const todayData = data.filter((w) => w.date === today);

    const last7Days = data.filter((w) => {
      const diff = (new Date() - new Date(w.date)) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
    setTotalWorkouts(last7Days.length);

    const uniqueDays = new Set(last7Days.map((w) => w.date));
    setActiveDays(uniqueDays.size);

    let count = 0;
    for (let i = 0; i < 7; i++) {
      const day = getDate(-i);
      if (data.some((w) => w.date === day)) count++;
      else break;
    }
    setStreak(count);

    // Warning system
    if (todayData.length > 5) {
      setWarning({ text: "⚠️ Too Many Exercises Today! Your body needs recovery time.", type: "danger" });
    } else if (yData.length === 0 && data.length > 0) {
      setWarning({ text: "😴 You Missed Yesterday's Workout! Stay consistent for better results.", type: "warn" });
    } else if (streak >= 3) {
      setWarning({ text: `🔥 ${streak}-Day Streak! You're on fire! Keep it up!`, type: "success" });
    } else {
      setWarning({ text: "💪 Ready to train today? Log your workout below!", type: "info" });
    }
  }, []);

  // Chart Data
  const getWeeklyChartData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dataMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    workouts.forEach((w) => {
      const date = new Date(w.date);
      const day = days[date.getDay()];
      dataMap[day]++;
    });

    return days.map((day) => ({ day, workouts: dataMap[day] }));
  };

  const chartData = getWeeklyChartData();

  const warningColors = {
    danger: "bg-red-500/15 border-red-400/40 text-red-300",
    warn: "bg-yellow-500/15 border-yellow-400/40 text-yellow-300",
    success: "bg-green-500/15 border-green-400/40 text-green-300",
    info: "bg-blue-500/15 border-blue-400/40 text-blue-300",
    neutral: "bg-white/5 border-white/10 text-gray-300",
  };

  const todayWorkoutCount = workouts.filter((w) => w.date === getDate(0)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center
            bg-gradient-to-r from-blue-600/20 to-purple-600/20
            border border-white/10 rounded-2xl p-5 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {user.name || user.email?.split("@")[0] || "Athlete"}
              </span> 💪
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/gym-tracker")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                bg-gradient-to-r from-blue-500 to-purple-600
                hover:scale-105 transition duration-200 shadow-lg shadow-blue-500/30"
            >
              <FaDumbbell /> Log Exercise
            </button>
            <button
              onClick={() => navigate("/plate-calculator")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200"
            >
              <FaCalculator /> Plate Calc
            </button>
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-2xl px-5 py-4 font-medium ${warningColors[warning.type]}`}
        >
          <span className="flex items-center gap-2">
            <FaExclamationTriangle />
            {warning.text}
          </span>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Exercises", value: todayWorkoutCount, icon: <FaDumbbell />, color: "blue" },
            { label: "Weekly Workouts", value: totalWorkouts, icon: <FaChartLine />, color: "purple" },
            { label: "Active Days (7d)", value: `${activeDays}/7`, icon: <FaCheckCircle />, color: "green" },
            { label: "Day Streak 🔥", value: streak, icon: <FaFire />, color: "orange" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className={`text-${stat.color}-400 text-xl`}>{stat.icon}</div>
              <p className={`text-3xl font-extrabold text-${stat.color}-400`}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT — Chart + Yesterday */}
          <div className="md:col-span-2 space-y-6">

            {/* Weekly Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                  bg-clip-text text-transparent">
                  📊 Weekly Activity Chart
                </h2>
                <div className="w-full h-72 min-h-[300px]">
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fill: "#94a3b8" }} />
                      <YAxis stroke="#64748b" tick={{ fill: "#94a3b8" }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#94a3b8" }}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      />
                      <Bar dataKey="workouts" radius={[8, 8, 0, 0]} fill="url(#colorGradient)" animationDuration={1200} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#9333ea" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Yesterday */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400
                  bg-clip-text text-transparent flex items-center gap-2">
                  <FaHistory /> Yesterday's Activity
                </h2>
                {yesterdayData.length === 0 ? (
                  <p className="text-gray-500 text-sm">No workouts logged yesterday.</p>
                ) : (
                  <div className="space-y-2">
                    {yesterdayData.map((w, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-white/5 border border-white/10
                          rounded-xl px-4 py-2 text-sm"
                      >
                        <span className="font-medium text-white">{w.exercise}</span>
                        <span className="text-gray-400">{w.bodyPart} · {w.sets}×{w.reps} · {w.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

          </div>

          {/* RIGHT — User Info + Quick Actions */}
          <div className="space-y-4">

            {/* About Me */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2 text-white">
                  <FaUser className="text-blue-400" /> About Me
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2"><FaWeight className="text-blue-400" /> Weight</span>
                    <span className="font-semibold text-white">{user.weight ? `${user.weight} kg` : "—"}</span>
                  </p>
                  <p className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2"><FaRulerVertical className="text-purple-400" /> Height</span>
                    <span className="font-semibold text-white">{user.height ? `${user.height} cm` : "—"}</span>
                  </p>
                  <p className="flex justify-between text-gray-300">
                    <span>Age</span>
                    <span className="font-semibold text-white">{user.age || "—"}</span>
                  </p>
                  <p className="flex justify-between text-gray-300">
                    <span>Level</span>
                    <span className={`font-semibold capitalize ${
                      user.level === "Advanced" ? "text-red-400" :
                      user.level === "Intermediate" ? "text-yellow-400" : "text-green-400"
                    }`}>{user.level || "—"}</span>
                  </p>
                  <p className="flex justify-between text-gray-300">
                    <span>Gender</span>
                    <span className="font-semibold capitalize text-white">{user.gender || "—"}</span>
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Today's Goal */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <FaBullseye className="text-orange-400" /> Today's Goal
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Exercises</span>
                      <span>{todayWorkoutCount}/3</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (todayWorkoutCount / 3) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <h2 className="font-bold text-lg mb-3 text-white">⚡ Quick Actions</h2>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate("/gym-tracker")}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                      bg-blue-500/20 border border-blue-400/30 text-blue-300
                      hover:bg-blue-500/30 transition duration-200"
                  >
                    <FaDumbbell /> Open Gym Tracker
                  </button>
                  <button
                    onClick={() => navigate("/plate-calculator")}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                      bg-orange-500/20 border border-orange-400/30 text-orange-300
                      hover:bg-orange-500/30 transition duration-200"
                  >
                    <FaCalculator /> Plate Calculator
                  </button>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;