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

  // New States for Tab, Quotes, Diet, and Quiz
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDiet, setSelectedDiet] = useState("muscleGain");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [buddyExercise, setBuddyExercise] = useState("pushups");

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Water & Nutrition States
  const [waterIntake, setWaterIntake] = useState(0);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [showCustomNutrForm, setShowCustomNutrForm] = useState(false);
  const [customCals, setCustomCals] = useState("");
  const [customProt, setCustomProt] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFat, setCustomFat] = useState("");

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Success starts with self-discipline.",
    "No pain, no gain. Shut up and train.",
    "What hurts today makes you stronger tomorrow.",
    "Believe you can and you're halfway there.",
    "Consistency is the key to unlocking your true potential.",
    "It never gets easier, you just get better.",
    "You don't have to be extreme, just consistent."
  ];

  const quizQuestions = [
    {
      question: "Which muscle group does the bench press primarily target?",
      options: ["Latissimus Dorsi (Back)", "Pectoralis Major (Chest)", "Quadriceps (Legs)", "Biceps Brachii (Arms)"],
      correct: 1,
      explanation: "The bench press is a compound exercise that primarily targets the pectoralis major (chest muscle), along with the triceps and anterior deltoids."
    },
    {
      question: "What is the recommended protein intake for building muscle?",
      options: ["0.5g - 0.8g per kg bodyweight", "1.6g - 2.2g per kg bodyweight", "3.0g - 4.0g per kg bodyweight", "Protein doesn't matter"],
      correct: 1,
      explanation: "For muscle hypertrophy, scientific consensus recommends consuming 1.6 to 2.2 grams of protein per kilogram of body weight daily."
    },
    {
      question: "Which exercise is widely considered the 'king' of lower body movements?",
      options: ["Leg Press", "Leg Extensions", "Squats", "Calf Raises"],
      correct: 2,
      explanation: "Squats are the ultimate compound lower body exercise, recruiting the quadriceps, hamstrings, glutes, core, and lower back."
    },
    {
      question: "What type of training alternates short, intense workouts with recovery periods?",
      options: ["LISS (Low-Intensity Steady State)", "HIIT (High-Intensity Interval Training)", "Isometric Training", "Flexibility Training"],
      correct: 1,
      explanation: "HIIT involves repeated bursts of high-intensity efforts followed by varied recovery times, boosting cardiovascular fitness and calorie burn."
    },
    {
      question: "What is 'progressive overload' in weight training?",
      options: ["Lifting the exact same weight every week", "Gradually increasing the weight, reps, or intensity over time", "Overtraining until your muscles fail completely", "Taking longer rest breaks between workouts"],
      correct: 1,
      explanation: "Progressive overload is the gradual increase of stress placed upon the body during exercise, which is essential to continue building muscle and strength."
    }
  ];

  const dietData = {
    muscleGain: {
      title: "💪 Muscle Gain Plan",
      description: "Focus on high-protein intake and complex carbohydrates to fuel muscle growth and recovery.",
      meals: [
        {
          type: "Breakfast 🥚",
          name: "Power Oats & Eggs",
          macros: "550 kcal · 35g Protein · 60g Carbs · 15g Fat",
          items: ["4 egg whites & 2 whole eggs (scrambled)", "1 cup oatmeal with sliced banana and honey", "1 scoop whey protein (optional)"]
        },
        {
          type: "Lunch 🍗",
          name: "Chicken Rice & Broccoli",
          macros: "700 kcal · 50g Protein · 80g Carbs · 12g Fat",
          items: ["200g grilled chicken breast", "1.5 cups brown rice or basmati rice", "1 cup steamed broccoli and carrots"]
        },
        {
          type: "Snacks 🥜",
          name: "Greek Yogurt & Nuts",
          macros: "350 kcal · 20g Protein · 15g Carbs · 18g Fat",
          items: ["1 cup low-fat plain Greek yogurt", "Handful of mixed almonds and walnuts", "1 apple or a handful of berries"]
        },
        {
          type: "Dinner 🥩",
          name: "Salmon / Beef & Sweet Potatoes",
          macros: "600 kcal · 45g Protein · 50g Carbs · 20g Fat",
          items: ["180g grilled salmon fillet or lean beef", "150g baked sweet potato", "Side salad with olive oil dressing"]
        }
      ]
    },
    fatLoss: {
      title: "🔥 Fat Loss Plan",
      description: "Focus on caloric deficit, high fiber, and high protein to preserve muscle while shedding fat.",
      meals: [
        {
          type: "Breakfast 🍳",
          name: "Veggie Egg White Omelet",
          macros: "320 kcal · 28g Protein · 15g Carbs · 8g Fat",
          items: ["5 egg whites scrambled with spinach, tomatoes, and mushrooms", "1 slice of whole-wheat toast", "Green tea"]
        },
        {
          type: "Lunch 🥗",
          name: "Lean Turkey Salad",
          macros: "450 kcal · 40g Protein · 25g Carbs · 10g Fat",
          items: ["180g roasted turkey breast or chicken", "Large mixed green salad (cucumber, bell peppers, spinach)", "Light lemon-herb dressing"]
        },
        {
          type: "Snacks 🥛",
          name: "Protein Shake & Berries",
          macros: "220 kcal · 26g Protein · 18g Carbs · 2g Fat",
          items: ["1 scoop whey protein mixed in water or unsweetened almond milk", "1 cup blueberries or strawberries"]
        },
        {
          type: "Dinner 🐟",
          name: "Baked White Fish & Veggies",
          macros: "380 kcal · 38g Protein · 20g Carbs · 6g Fat",
          items: ["200g baked cod or tilapia", "1 cup roasted asparagus or green beans", "100g quinoa or boiled potato"]
        }
      ]
    },
    balanced: {
      title: "⚖️ Balanced & Maintenance Plan",
      description: "Designed to maintain current weight, sustain energy levels, and support overall health.",
      meals: [
        {
          type: "Breakfast 🥑",
          name: "Avocado Toast & Eggs",
          macros: "450 kcal · 22g Protein · 35g Carbs · 20g Fat",
          items: ["2 poached eggs", "1 slice of sourdough toast with half mashed avocado", "A cup of black coffee or black tea"]
        },
        {
          type: "Lunch 🥙",
          name: "Quinoa Chicken Bowl",
          macros: "600 kcal · 42g Protein · 60g Carbs · 15g Fat",
          items: ["150g grilled chicken strips", "1 cup cooked quinoa", "Mixed grilled vegetables (zucchini, bell peppers)", "1 tbsp hummus"]
        },
        {
          type: "Snacks 🍎",
          name: "Apple & Peanut Butter",
          macros: "280 kcal · 8g Protein · 25g Carbs · 16g Fat",
          items: ["1 medium apple sliced", "2 tablespoons natural peanut butter or almond butter"]
        },
        {
          type: "Dinner 👑",
          name: "Shrimp Pasta or Tofu Stir-Fry",
          macros: "500 kcal · 35g Protein · 45g Carbs · 12g Fat",
          items: ["150g grilled shrimp or firm tofu", "1 cup whole wheat pasta or brown rice", "Stir-fried vegetables in low-sodium soy sauce"]
        }
      ]
    }
  };

  const trainersData = [
    {
      name: "Coach Marcus Irons",
      role: "Lead Strength & Conditioning Coach",
      qualification: "B.S. Exercise Science, NSCA-CSCS (Certified Strength & Conditioning Specialist)",
      specialties: ["Hypertrophy & Muscle Building", "Powerlifting & Barbell Training", "Injury Prevention & Rehab"],
      phone: "+91 98765 43210",
      email: "marcus@fitforge.com",
      image: "/trainer-marcus.png",
      bio: "Marcus has over 8 years of coaching experience working with competitive athletes and individuals looking to gain muscle and master heavy compound lifts."
    },
    {
      name: "Coach Valerie Vigor",
      role: "Head Elite Fitness & Nutrition Coach",
      qualification: "NASM-CPT (Certified Personal Trainer), FNS (Fitness Nutrition Specialist)",
      specialties: ["High Intensity Interval Training (HIIT)", "Fat Loss & Metabolic Conditioning", "Sports Nutrition & Meal Prep"],
      phone: "+91 98765 54321",
      email: "valerie@fitforge.com",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=500&q=80",
      bio: "Valerie specializes in functional training and sustainable nutrition plans to help you burn body fat, build endurance, and feel energetic all day."
    }
  ];

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === quizQuestions[quizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

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

    // Load water and nutrition data
    const todayStr = getDate(0);
    const savedWater = JSON.parse(localStorage.getItem(`water_${todayStr}`)) || 0;
    setWaterIntake(savedWater);

    const savedNutrition = JSON.parse(localStorage.getItem(`nutrition_${todayStr}`)) || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    setNutrition(savedNutrition);
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

  // Water & Nutrition Helpers
  const updateWater = (amount) => {
    const todayStr = getDate(0);
    const newVal = Math.max(0, waterIntake + amount);
    setWaterIntake(newVal);
    localStorage.setItem(`water_${todayStr}`, JSON.stringify(newVal));
  };

  const updateNutrition = (cals, prot, carb, f) => {
    const todayStr = getDate(0);
    const newNutr = {
      calories: Math.max(0, nutrition.calories + cals),
      protein: Math.max(0, nutrition.protein + prot),
      carbs: Math.max(0, nutrition.carbs + carb),
      fat: Math.max(0, nutrition.fat + f),
    };
    setNutrition(newNutr);
    localStorage.setItem(`nutrition_${todayStr}`, JSON.stringify(newNutr));
  };

  const resetNutrition = () => {
    const todayStr = getDate(0);
    const resetVal = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    setNutrition(resetVal);
    localStorage.setItem(`nutrition_${todayStr}`, JSON.stringify(resetVal));
  };

  const handleCustomNutritionSubmit = (e) => {
    e.preventDefault();
    const cals = parseInt(customCals) || 0;
    const prot = parseInt(customProt) || 0;
    const carb = parseInt(customCarbs) || 0;
    const fat = parseInt(customFat) || 0;
    updateNutrition(cals, prot, carb, fat);
    setCustomCals("");
    setCustomProt("");
    setCustomCarbs("");
    setCustomFat("");
    setShowCustomNutrForm(false);
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
                hover:scale-105 transition duration-200 shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              <FaDumbbell /> Log Exercise
            </button>
            <button
              onClick={() => navigate("/plate-calculator")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 cursor-pointer"
            >
              <FaCalculator /> Plate Calc
            </button>
          </div>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl max-w-lg">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-xl transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("diet")}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-xl transition cursor-pointer ${
              activeTab === "diet"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🥗 Diet Plan
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-xl transition cursor-pointer ${
              activeTab === "quiz"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🧠 Gym Quiz
          </button>
          <button
            onClick={() => setActiveTab("trainers")}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-xl transition cursor-pointer ${
              activeTab === "trainers"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🏋️‍♂️ Trainers
          </button>
        </div>

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

        {/* Tab Contents */}
        {activeTab === "overview" && (
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

              {/* Trackers Row: Water & Nutrition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* 💧 Water Intake Tracker Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Card>
                    <div className="relative h-28 -mx-5 -mt-5 mb-4 rounded-t-2xl overflow-hidden">
                      <img
                        src="/water-tracker.png"
                        alt="Water Intake"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="text-2xl">💧</span>
                        <h2 className="text-lg font-bold text-white shadow-sm">Water Intake</h2>
                      </div>
                      <button
                        onClick={() => updateWater(-waterIntake)}
                        className="absolute top-3 right-3 text-[10px] uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/20 transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-white">
                          {waterIntake} <span className="text-xs text-gray-400 font-semibold">/ 3000 ml</span>
                        </p>
                        <p className="text-xs text-gray-400">Target: 3 Liters (12 cups) daily</p>
                      </div>
                      
                      {/* Spring Animated Water Container */}
                      <div className="relative w-14 h-20 bg-blue-500/5 border-2 border-blue-400/30 rounded-b-xl rounded-t-sm overflow-hidden flex items-end">
                        <motion.div
                          className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-sky-400 relative"
                          animate={{ height: `${Math.min(100, (waterIntake / 3000) * 100)}%` }}
                          transition={{ type: "spring", stiffness: 45 }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-300/40 animate-pulse rounded-t-full" />
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-white mix-blend-difference">
                          {Math.min(100, (waterIntake / 3000) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateWater(250)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                      >
                        + 250ml
                      </button>
                      <button
                        onClick={() => updateWater(500)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                      >
                        + 500ml
                      </button>
                      <button
                        onClick={() => updateWater(-250)}
                        disabled={waterIntake === 0}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Remove 250ml"
                      >
                        -
                      </button>
                    </div>
                  </Card>
                </motion.div>

                {/* 🍎 Nutrition & Macro Tracker Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <div className="relative h-28 -mx-5 -mt-5 mb-4 rounded-t-2xl overflow-hidden">
                      <img
                        src="/nutrition-tracker.png"
                        alt="Nutrition Tracker"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="text-2xl">🍎</span>
                        <h2 className="text-lg font-bold text-white shadow-sm">Nutrition Tracker</h2>
                      </div>
                      <button
                        onClick={resetNutrition}
                        className="absolute top-3 right-3 text-[10px] uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/20 transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>

                    {!showCustomNutrForm ? (
                      <div className="space-y-4">
                        {/* Calories Circular Ring & Macro details */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle cx="32" cy="32" r="28" className="stroke-white/10" strokeWidth="4.5" fill="transparent" />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                className="stroke-orange-500"
                                strokeWidth="4.5"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - Math.min(1, nutrition.calories / 2200)) }}
                                transition={{ duration: 0.8 }}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-[11px] font-black text-white">{nutrition.calories}</span>
                              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider">kcal</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs text-gray-400">
                              Target: <span className="text-white font-bold">2200 kcal</span>
                            </p>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${Math.min(100, (nutrition.calories / 2200) * 100)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500">
                              {Math.max(0, 2200 - nutrition.calories)} kcal remaining
                            </p>
                          </div>
                        </div>

                        {/* Macro Bars */}
                        <div className="space-y-2">
                          {/* Protein */}
                          <div>
                            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                              <span className="font-semibold text-blue-300">Protein</span>
                              <span>{nutrition.protein}g / 150g</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (nutrition.protein / 150) * 100)}%` }} />
                            </div>
                          </div>
                          {/* Carbs */}
                          <div>
                            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                              <span className="font-semibold text-yellow-300">Carbs</span>
                              <span>{nutrition.carbs}g / 250g</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, (nutrition.carbs / 250) * 100)}%` }} />
                            </div>
                          </div>
                          {/* Fats */}
                          <div>
                            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                              <span className="font-semibold text-green-300">Fats</span>
                              <span>{nutrition.fat}g / 70g</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (nutrition.fat / 70) * 100)}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateNutrition(140, 25, 3, 2)}
                            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
                          >
                            + Shake
                          </button>
                          <button
                            onClick={() => updateNutrition(650, 45, 75, 18)}
                            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/10 border border-green-500/30 text-green-300 hover:bg-green-500/20 transition cursor-pointer"
                          >
                            + Meal
                          </button>
                          <button
                            onClick={() => setShowCustomNutrForm(true)}
                            className="py-1.5 px-3 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition cursor-pointer"
                          >
                            + Custom
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleCustomNutritionSubmit} className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Calories (kcal)</label>
                            <input
                              type="number"
                              placeholder="e.g. 350"
                              value={customCals}
                              onChange={(e) => setCustomCals(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Protein (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 20"
                              value={customProt}
                              onChange={(e) => setCustomProt(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Carbs (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 45"
                              value={customCarbs}
                              onChange={(e) => setCustomCarbs(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block font-bold mb-0.5">Fats (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 10"
                              value={customFat}
                              onChange={(e) => setCustomFat(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowCustomNutrForm(false)}
                            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer"
                          >
                            Add Log
                          </button>
                        </div>
                      </form>
                    )}
                  </Card>
                </motion.div>

              </div>

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
                        hover:bg-blue-500/30 transition duration-200 cursor-pointer"
                    >
                      <FaDumbbell /> Open Gym Tracker
                    </button>
                    <button
                      onClick={() => navigate("/plate-calculator")}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                        bg-orange-500/20 border border-orange-400/30 text-orange-300
                        hover:bg-orange-500/30 transition duration-200 cursor-pointer"
                    >
                      <FaCalculator /> Plate Calculator
                    </button>
                  </div>
                </Card>
              </motion.div>

              {/* Virtual Gym Buddy Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                      🏋️‍♂️ Gym Buddy
                    </h2>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-bold uppercase tracking-wider">
                      {buddyExercise === "pushups" ? "Pushup Pro" : buddyExercise === "squats" ? "Squat Master" : "Bicep King"}
                    </span>
                  </div>

                  {/* Exercise Selector */}
                  <div className="flex gap-1.5 bg-black/35 p-1 rounded-xl w-full border border-white/5 mb-3">
                    {[
                      { id: "pushups", label: "Push-ups" },
                      { id: "squats", label: "Squats" },
                      { id: "curls", label: "Curls" }
                    ].map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => setBuddyExercise(ex.id)}
                        className={`flex-1 py-1 text-center text-xs font-bold rounded-lg transition cursor-pointer ${
                          buddyExercise === ex.id
                            ? "bg-white text-black font-extrabold shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-center text-center gap-4">
                    {/* Exercise SVG Animation */}
                    <div className="bg-black/25 p-4 rounded-2xl w-full flex justify-center items-center border border-white/5 relative overflow-hidden h-24">
                      
                      {buddyExercise === "pushups" && (
                        <svg width="120" height="70" viewBox="0 0 100 60" className="w-24 h-16">
                          {/* Floor */}
                          <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Head */}
                          <motion.circle
                            cx={34}
                            animate={{ cy: [18, 33, 18] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            r="6"
                            fill="#ef4444"
                          />
                          
                          {/* Torso/Body */}
                          <motion.line
                            x2={80}
                            y2={45}
                            animate={{ x1: [40, 40, 40], y1: [25, 40, 25] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          
                          {/* Leg */}
                          <motion.line
                            x1={80}
                            y1={45}
                            x2={86}
                            y2={48}
                            stroke="#94a3b8"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />

                          {/* Arm */}
                          <motion.path
                            animate={{
                              d: [
                                "M 40,25 L 32,36 L 40,48",
                                "M 40,40 L 25,44 L 40,48",
                                "M 40,25 L 32,36 L 40,48"
                              ]
                            }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}

                      {buddyExercise === "squats" && (
                        <svg width="120" height="70" viewBox="0 0 100 60" className="w-24 h-16">
                          {/* Floor */}
                          <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Head */}
                          <motion.circle
                            cx={55}
                            animate={{ cy: [15, 29, 15] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            r="6"
                            fill="#ef4444"
                          />
                          
                          {/* Torso */}
                          <motion.line
                            x1={55}
                            animate={{
                              y1: [15, 29, 15],
                              x2: [55, 58, 55],
                              y2: [28, 42, 28]
                            }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          
                          {/* Thighs */}
                          <motion.line
                            animate={{
                              x1: [55, 58, 55],
                              y1: [28, 42, 28],
                              x2: [50, 42, 50],
                              y2: [38, 43, 38]
                            }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          
                          {/* Shins */}
                          <motion.line
                            animate={{
                              x1: [50, 42, 50],
                              y1: [38, 43, 38]
                            }}
                            x2={50}
                            y2={48}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            stroke="#94a3b8"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          
                          {/* Arms */}
                          <motion.line
                            x1={55}
                            animate={{
                              y1: [20, 34, 20],
                              x2: [38, 32, 38],
                              y2: [20, 34, 20]
                            }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            stroke="#ef4444"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}

                      {buddyExercise === "curls" && (
                        <svg width="120" height="70" viewBox="0 0 100 60" className="w-24 h-16">
                          {/* Floor */}
                          <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Head */}
                          <circle cx={50} cy={14} r="6" fill="#fff" />
                          
                          {/* Torso */}
                          <line x1={50} y1={20} x2={50} y2={38} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                          
                          {/* Legs (Standing) */}
                          <line x1={46} y1={38} x2={44} y2={48} stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                          <line x1={54} y1={38} x2={56} y2={48} stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                          
                          {/* Upper Arm */}
                          <line x1={50} y1={22} x2={44} y2={30} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                          
                          {/* Forearm */}
                          <motion.line
                            x1={44}
                            y1={30}
                            animate={{
                              x2: [44, 38, 44],
                              y2: [41, 23, 41]
                            }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            stroke="#ef4444"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          
                          {/* Dumbbell */}
                          <motion.g
                            animate={{
                              x: [0, -6, 0],
                              y: [0, -18, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                          >
                            <line x1={38} y1={41} x2={50} y2={41} stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx={38} cy={41} r="5" fill="#ef4444" />
                            <circle cx={50} cy={41} r="5" fill="#ef4444" />
                          </motion.g>
                        </svg>
                      )}

                    </div>

                    {/* Motivational Quote */}
                    <div className="min-h-[60px] flex flex-col justify-center">
                      <p className="text-gray-300 italic text-sm font-medium leading-relaxed">
                        "{quotes[quoteIndex]}"
                      </p>
                    </div>

                    <button
                      onClick={nextQuote}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
                    >
                      Next Quote ✨
                    </button>
                  </div>
                </Card>
              </motion.div>

            </div>
          </div>
        )}

        {/* Diet Planner Tab */}
        {activeTab === "diet" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Diet Banner Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 h-64 md:h-80 flex flex-col justify-end p-6 md:p-10 shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/diet-banner.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10 max-w-2xl">
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Nutrition Plan
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-white">
                  Fuel Your Fitness Journey
                </h2>
                <p className="text-gray-300 text-sm md:text-base mt-2">
                  Achieving your fitness goals is 70% nutrition. Select a plan below tailored to your physical target and fuel your gains.
                </p>
              </div>
            </div>

            {/* Diet Goal Selector */}
            <div className="flex flex-wrap gap-3">
              {[
                { id: "muscleGain", label: "💪 Muscle Gain", color: "blue" },
                { id: "fatLoss", label: "🔥 Fat Loss", color: "red" },
                { id: "balanced", label: "⚖️ Balanced/Maintenance", color: "green" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedDiet(btn.id)}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm border transition duration-200 cursor-pointer ${
                    selectedDiet === btn.id
                      ? "bg-white text-black border-white shadow-lg shadow-white/10"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Active Diet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Plan Intro Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <div className="h-48 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                  <img
                    src={
                      selectedDiet === "muscleGain" ? "/muscle-gain.png" :
                      selectedDiet === "fatLoss" ? "/fat-loss.png" : "/balanced-fit.png"
                    }
                    alt={dietData[selectedDiet].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {dietData[selectedDiet].title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    {dietData[selectedDiet].description}
                  </p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-auto">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Target Intake</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {selectedDiet === "muscleGain" ? "🥩 ~2200 kcal · 150g Protein" :
                     selectedDiet === "fatLoss" ? "🥦 ~1370 kcal · 132g Protein" : "🥑 ~1830 kcal · 107g Protein"}
                  </p>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietData[selectedDiet].meals.map((meal, index) => (
                  <div
                    key={index}
                    className="bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-white/15 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                            {meal.type}
                          </span>
                          <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                            {meal.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-[10px] bg-white/5 text-gray-300 font-semibold px-2.5 py-1 rounded border border-white/5 mb-3 inline-block">
                        📊 {meal.macros}
                      </div>
                      <ul className="space-y-1.5">
                        {meal.items.map((item, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}

        {/* Gym Quiz Tab */}
        {activeTab === "quiz" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              {!quizFinished ? (
                <div className="space-y-6 py-2">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Trivia Challenge
                      </span>
                      <h2 className="text-2xl font-extrabold text-white mt-2">
                        🧠 FitForge Gym Quiz
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-400">Question</span>
                      <p className="text-xl font-black text-white">{quizIndex + 1}/{quizQuestions.length}</p>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                      {quizQuestions[quizIndex].question}
                    </h3>
                  </div>

                  {/* Options Grid */}
                  <div className="flex flex-col gap-3">
                    {quizQuestions[quizIndex].options.map((option, idx) => {
                      // Color styling logic
                      let optionClass = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";
                      if (isAnswered) {
                        if (idx === quizQuestions[quizIndex].correct) {
                          optionClass = "bg-green-500/20 border-green-500/50 text-green-300";
                        } else if (idx === selectedOption) {
                          optionClass = "bg-red-500/20 border-red-500/50 text-red-300";
                        } else {
                          optionClass = "bg-white/5 border-white/10 text-gray-500 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(idx)}
                          disabled={isAnswered}
                          className={`w-full text-left p-4 rounded-xl font-semibold border text-sm transition duration-200 cursor-pointer ${optionClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation / Feedback */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2"
                    >
                      <h4 className="text-sm font-bold text-white">
                        {selectedOption === quizQuestions[quizIndex].correct ? "🎉 Correct!" : "❌ Incorrect"}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {quizQuestions[quizIndex].explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Next Button */}
                  {isAnswered && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        {quizIndex + 1 === quizQuestions.length ? "Finish Quiz 🏁" : "Next Question ➡️"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Results View */
                <div className="text-center py-8 space-y-6">
                  <div className="inline-block bg-purple-500/10 p-6 rounded-full border border-purple-500/20">
                    <span className="text-6xl">
                      {quizScore === quizQuestions.length ? "👑" : quizScore >= 3 ? "🔥" : "🏋️"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-white">Quiz Completed!</h2>
                    <p className="text-gray-400">
                      You scored <span className="text-purple-400 font-bold">{quizScore}</span> out of <span className="text-white font-bold">{quizQuestions.length}</span>
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="inline-block bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
                    <span className="text-sm text-gray-400">Gym Level: </span>
                    <span className="font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      {quizScore === quizQuestions.length ? "Gym Legend 🏆" : quizScore >= 3 ? "Fitness Enthusiast 🔥" : "Gym Rookie 🏋️‍♂️"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {quizScore === quizQuestions.length
                      ? "Flawless performance! You know your training inside and out. Time to crush your workouts!"
                      : quizScore >= 3
                      ? "Great job! You have a solid grasp of exercise science and nutrition. Keep learning!"
                      : "Every expert was once a beginner. Read up on progressive overload and protein synthesis to boost your scores!"}
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={handleResetQuiz}
                      className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition shadow-lg cursor-pointer"
                    >
                      Play Again 🔄
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Trainers Tab */}
        {activeTab === "trainers" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
              <div className="max-w-2xl">
                <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Personal Training
                </span>
                <h2 className="text-3xl font-extrabold mt-3 text-white">
                  Get Guidance From Certified Coaches
                </h2>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                  Connect with our certified personal trainers to get custom workout routines, diet counseling, and 1-on-1 guidance to accelerate your progress.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Gym Consultation</span>
                <p className="text-sm font-bold text-green-400">✅ 1 Free Session Included</p>
              </div>
            </div>

            {/* Trainers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainersData.map((trainer, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 hover:border-white/20 transition group shadow-lg"
                >
                  {/* Portrait photo */}
                  <div className="w-full md:w-40 h-48 rounded-2xl overflow-hidden relative shrink-0 border border-white/5 shadow-inner">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Info details */}
                  <div className="flex flex-col flex-1">
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                        {trainer.role}
                      </span>
                      <h3 className="text-xl font-extrabold text-white mt-0.5">
                        {trainer.name}
                      </h3>
                      <p className="text-gray-400 text-[11px] leading-relaxed mt-2 italic">
                        "{trainer.bio}"
                      </p>
                    </div>

                    {/* Qualifications & Specialties */}
                    <div className="mt-4 space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Qualification</span>
                        <p className="text-xs text-gray-300 font-semibold">{trainer.qualification}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Specialties</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {trainer.specialties.map((spec, i) => (
                            <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-md border border-white/5 font-semibold">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 mt-5 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-gray-300">
                        <span>📞 Phone</span>
                        <a href={`tel:${trainer.phone}`} className="font-bold text-white hover:text-blue-400 transition">
                          {trainer.phone}
                        </a>
                      </div>
                      <div className="flex justify-between items-center text-gray-300">
                        <span>✉️ Email</span>
                        <a href={`mailto:${trainer.email}`} className="font-bold text-white hover:text-blue-400 transition">
                          {trainer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;