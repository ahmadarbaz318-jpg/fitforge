import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalculator, FaWeight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Card from "../components/card";

// Standard plate weights in kg (pairs available in most gyms)
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const BAR_WEIGHT = 20; // Standard Olympic bar = 20kg

const calculatePlates = (targetWeight) => {
  const sideWeight = (targetWeight - BAR_WEIGHT) / 2;
  if (sideWeight < 0) return null;

  let remaining = sideWeight;
  const result = [];

  for (const plate of PLATES) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate);
      result.push({ weight: plate, count });
      remaining = parseFloat((remaining - plate * count).toFixed(4));
    }
  }

  if (remaining > 0.01) return null; // Can't make exact weight
  return result;
};

const PLATE_COLORS = {
  25: "bg-red-500",
  20: "bg-blue-500",
  15: "bg-yellow-400",
  10: "bg-green-500",
  5:  "bg-white/80",
  2.5: "bg-gray-400",
  1.25: "bg-orange-400",
};

const PLATE_TEXT_COLORS = {
  25: "text-white",
  20: "text-white",
  15: "text-black",
  10: "text-white",
  5:  "text-black",
  2.5: "text-black",
  1.25: "text-black",
};

const PlateCalculator = () => {
  const [targetWeight, setTargetWeight] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("kg");

  const handleCalculate = () => {
    setError("");
    let weight = parseFloat(targetWeight);
    if (!weight || weight <= 0) {
      setError("⚠ Please enter a valid target weight.");
      return;
    }

    // Convert lbs to kg if needed
    if (unit === "lbs") weight = parseFloat((weight * 0.453592).toFixed(2));

    if (weight < BAR_WEIGHT) {
      setError(`⚠ Minimum weight is ${unit === "lbs" ? "44 lbs" : "20 kg"} (bar only).`);
      return;
    }

    const plates = calculatePlates(weight);
    if (!plates) {
      setError("⚠ Exact weight not achievable with standard plates. Try a different weight.");
      return;
    }

    setResult({ plates, totalKg: weight });
  };

  const quickWeights = unit === "kg"
    ? [40, 60, 80, 100, 120, 140, 160]
    : [95, 135, 185, 225, 275, 315, 365];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400
            bg-clip-text text-transparent">
            🏋️ Plate Calculator
          </h1>
          <p className="text-gray-400 mt-2">Enter your target weight to see the exact plate combination</p>
        </motion.div>

        {/* Input Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FaCalculator className="text-orange-400" />
            <h2 className="text-xl font-bold">Target Weight</h2>
          </div>

          {/* Unit Toggle */}
          <div className="flex gap-2 mb-4">
            {["kg", "lbs"].map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setTargetWeight(""); setResult(null); setError(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                  ${unit === u
                    ? "bg-orange-500/30 border-orange-400 text-orange-300"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => { setTargetWeight(e.target.value); setError(""); setResult(null); }}
              placeholder={`Enter weight in ${unit}`}
              className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            />
            <button
              onClick={handleCalculate}
              className="px-6 py-3 rounded-xl font-bold text-lg
                bg-gradient-to-r from-orange-500 to-red-500
                hover:scale-105 transition duration-300 shadow-lg shadow-orange-500/30"
            >
              Calculate
            </button>
          </div>

          {/* Quick picks */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Quick picks</p>
            <div className="flex flex-wrap gap-2">
              {quickWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => { setTargetWeight(String(w)); setResult(null); setError(""); }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10
                    hover:bg-orange-500/20 hover:border-orange-400/50 transition text-gray-300"
                >
                  {w} {unit}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}
        </Card>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-400
                  bg-clip-text text-transparent flex items-center gap-2">
                  <FaWeight /> Result for {result.totalKg} kg
                  {unit === "lbs" && (
                    <span className="text-sm text-gray-400">
                      ({(result.totalKg * 2.205).toFixed(1)} lbs)
                    </span>
                  )}
                </h2>

                {/* Bar Visualization */}
                <div className="my-6 flex items-center justify-center gap-1 overflow-x-auto py-2">
                  {/* Left plates (reversed) */}
                  {[...result.plates].reverse().map((p, i) =>
                    [...Array(p.count)].map((_, j) => (
                      <motion.div
                        key={`left-${i}-${j}`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: (i + j) * 0.05 }}
                        className={`${PLATE_COLORS[p.weight]} ${PLATE_TEXT_COLORS[p.weight]}
                          rounded-sm font-bold text-xs flex items-center justify-center
                          ${p.weight >= 20 ? "w-6 h-16" : p.weight >= 10 ? "w-5 h-14" : "w-4 h-12"}`}
                        title={`${p.weight}kg`}
                      >
                        {p.weight}
                      </motion.div>
                    ))
                  )}

                  {/* Bar */}
                  <div className="bg-gray-300 rounded-sm h-4 w-24 mx-1 flex items-center justify-center
                    text-xs text-gray-700 font-bold shadow-md">
                    {BAR_WEIGHT}kg Bar
                  </div>

                  {/* Right plates */}
                  {result.plates.map((p, i) =>
                    [...Array(p.count)].map((_, j) => (
                      <motion.div
                        key={`right-${i}-${j}`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: (i + j) * 0.05 }}
                        className={`${PLATE_COLORS[p.weight]} ${PLATE_TEXT_COLORS[p.weight]}
                          rounded-sm font-bold text-xs flex items-center justify-center
                          ${p.weight >= 20 ? "w-6 h-16" : p.weight >= 10 ? "w-5 h-14" : "w-4 h-12"}`}
                        title={`${p.weight}kg`}
                      >
                        {p.weight}
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Plate breakdown table */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 mb-3">Each Side of the Bar:</p>
                  {result.plates.map((p) => (
                    <div
                      key={p.weight}
                      className="flex justify-between items-center bg-white/5 border border-white/10
                        rounded-xl px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${PLATE_COLORS[p.weight]} w-8 h-8 rounded-full
                          flex items-center justify-center text-xs font-bold ${PLATE_TEXT_COLORS[p.weight]}`}>
                          {p.weight}
                        </div>
                        <span className="text-white font-medium">{p.weight} kg plate</span>
                      </div>
                      <span className="text-gray-400">× {p.count}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-3 mt-2 flex justify-between text-sm text-gray-400">
                    <span>Bar ({BAR_WEIGHT}kg) + Plates per side</span>
                    <span className="text-white font-bold">Total: {result.totalKg} kg</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <Card>
          <h3 className="text-sm font-bold text-gray-400 mb-3">🎨 Plate Color Guide</h3>
          <div className="flex flex-wrap gap-3">
            {PLATES.map((p) => (
              <div key={p} className="flex items-center gap-2">
                <div className={`${PLATE_COLORS[p]} w-6 h-6 rounded-full`} />
                <span className="text-sm text-gray-300">{p} kg</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PlateCalculator;
