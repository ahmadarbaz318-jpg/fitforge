import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDumbbell } from "react-icons/fa";

const Level = () => {
  const [level, setLevel] = useState("");
  const navigate = useNavigate();

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="h-screen w-full relative overflow-hidden text-white">

      {/* 🎥 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[3px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* 💡 Blue Glow */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full"></div>
      </div>

      {/* 💪 Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">

        {/* 🧊 Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg p-8 md:p-10 
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          rounded-2xl shadow-2xl"
        >

          {/* 🔥 Heading */}
          <h2 className="text-3xl font-extrabold text-center mb-8 
          bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 
          bg-clip-text text-transparent">
            Choose Your Level 💪
          </h2>

          {/* Options */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">

            {levels.map((item) => (
              <div
                key={item}
                onClick={() => setLevel(item)}
                className={`
                  cursor-pointer p-6 rounded-xl flex flex-col items-center flex-1
                  ${
                    level === item
                      ? "bg-blue-500/30 border-blue-400 shadow-lg shadow-blue-500/30"
                      : "bg-white/10 border-white/20"
                  }
                  border hover:scale-105 transition duration-200
                `}
              >
                <FaDumbbell size={30} className="text-blue-400 mb-2" />
                <p className="text-lg font-medium">{item}</p>
              </div>
            ))}

          </div>

          {/* Button */}
          <button
            disabled={!level}
            onClick={() => {
              const existing = JSON.parse(localStorage.getItem("user")) || {};
              localStorage.setItem("user", JSON.stringify({ ...existing, level }));
              navigate("/dashboard");
            }}
            className="mt-8 w-full py-3 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-blue-500 to-cyan-400 
            shadow-lg shadow-blue-500/30
            hover:scale-105 hover:shadow-blue-500/50 
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95
            transition duration-300"
          >
            Enter Dashboard →
          </button>

        </motion.div>
      </div>
    </div>
  );
};

export default Level;