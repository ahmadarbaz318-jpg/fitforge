import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDumbbell, FaCheck, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Card from "../components/card";

// 💪 Exercise Database
const EXERCISES = {
  Chest: ["Bench Press", "Incline Dumbbell Press", "Cable Fly", "Push-Ups", "Dips"],
  Back: ["Pull-Ups", "Bent-Over Row", "Lat Pulldown", "Deadlift", "Seated Cable Row"],
  Shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Arnold Press", "Face Pulls"],
  Biceps: ["Barbell Curl", "Hammer Curl", "Preacher Curl", "Concentration Curl", "Cable Curl"],
  Triceps: ["Tricep Dips", "Skull Crusher", "Pushdown", "Overhead Extension", "Close-Grip Bench"],
  Legs: ["Squat", "Leg Press", "Lunges", "Romanian Deadlift", "Leg Curl", "Calf Raises"],
  Core: ["Crunches", "Plank", "Russian Twist", "Hanging Leg Raise", "Ab Wheel"],
  Cardio: ["Treadmill Run", "Cycling", "Jump Rope", "Rowing Machine", "Stair Climber"],
};

const GymTracker = () => {
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [todayLog, setTodayLog] = useState(() => {
    const all = JSON.parse(localStorage.getItem("workouts")) || [];
    const today = new Date().toISOString().split("T")[0];
    return all.filter((w) => w.date === today);
  });

  const today = new Date().toISOString().split("T")[0];

  const handleLog = () => {
    if (!selectedPart || !selectedExercise || !sets || !reps) return;

    const entry = {
      date: today,
      bodyPart: selectedPart,
      exercise: selectedExercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? `${weight}kg` : "Bodyweight",
      timestamp: new Date().toLocaleTimeString(),
    };

    const existing = JSON.parse(localStorage.getItem("workouts")) || [];
    const updated = [...existing, entry];
    localStorage.setItem("workouts", JSON.stringify(updated));

    setTodayLog((prev) => [...prev, entry]);
    setSelectedExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setSuccessMsg(`✅ ${entry.exercise} logged!`);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleDelete = (index) => {
    const updated = todayLog.filter((_, i) => i !== index);
    setTodayLog(updated);

    const all = JSON.parse(localStorage.getItem("workouts")) || [];
    const others = all.filter((w) => w.date !== today);
    localStorage.setItem("workouts", JSON.stringify([...others, ...updated]));
  };

  const isOverworked = todayLog.length > 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400
            bg-clip-text text-transparent">
            💪 Gym Tracker
          </h1>
          <p className="text-gray-400 mt-2">Log your exercises and track your progress</p>
        </motion.div>

        {/* ⚠️ Overwork Warning */}
        <AnimatePresence>
          {isOverworked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 flex items-center gap-3"
            >
              <span className="text-2xl animate-bounce">⚠️</span>
              <div>
                <p className="font-bold text-red-300">Overtraining Warning!</p>
                <p className="text-red-400 text-sm">You've logged {todayLog.length} exercises today. Consider resting to prevent injury.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — Exercise Selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                bg-clip-text text-transparent flex items-center gap-2">
                <FaDumbbell /> Select Exercise
              </h2>

              {/* Body Part */}
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-2 block">Body Part</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(EXERCISES).map((part) => (
                    <button
                      key={part}
                      onClick={() => { setSelectedPart(part); setSelectedExercise(""); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition duration-200
                        ${selectedPart === part
                          ? "bg-blue-500/40 border-blue-400 text-blue-200"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/15"
                        }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise */}
              {selectedPart && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <label className="text-sm text-gray-400 mb-2 block">Exercise</label>
                  <div className="flex flex-col gap-2">
                    {EXERCISES[selectedPart].map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setSelectedExercise(ex)}
                        className={`px-4 py-2 rounded-xl text-left text-sm border transition duration-200
                          ${selectedExercise === ex
                            ? "bg-purple-500/30 border-purple-400 text-purple-200"
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                          }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sets / Reps / Weight */}
              {selectedExercise && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Sets</label>
                      <input
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        placeholder="e.g. 3"
                        min="1"
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Reps</label>
                      <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="e.g. 10"
                        min="1"
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="optional"
                        min="0"
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleLog}
                    disabled={!sets || !reps}
                    className="w-full py-3 rounded-xl font-semibold
                      bg-gradient-to-r from-blue-500 to-purple-600
                      hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed
                      transition duration-300 flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Log Exercise
                  </button>

                  {successMsg && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 text-center text-sm font-semibold"
                    >
                      {successMsg}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* RIGHT — Today's Log */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400
                bg-clip-text text-transparent">
                📋 Today's Log
                <span className="ml-2 text-sm bg-blue-500/30 px-2 py-0.5 rounded-full">
                  {todayLog.length} exercises
                </span>
              </h2>

              {todayLog.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FaDumbbell className="mx-auto text-4xl mb-3 opacity-30" />
                  <p>No exercises logged today.</p>
                  <p className="text-sm">Pick a body part to start!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {todayLog.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex justify-between items-center
                          bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-white">{entry.exercise}</p>
                          <p className="text-sm text-gray-400">
                            {entry.bodyPart} · {entry.sets}×{entry.reps} · {entry.weight}
                          </p>
                          <p className="text-xs text-gray-600">{entry.timestamp}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(i)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg
                            hover:bg-red-500/10 transition"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default GymTracker;
