import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMale, FaFemale } from "react-icons/fa";

const Gender = () => {
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

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
          className="w-full max-w-md p-8 md:p-10 
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          rounded-2xl shadow-2xl"
        >

          {/* 🔥 Heading */}
          <h2 className="text-3xl font-extrabold text-center mb-6 
          bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 
          bg-clip-text text-transparent">
            Select Your Gender
          </h2>

          {/* Options */}
          <div className="flex gap-6 justify-center">

            {/* Male */}
            <div
              onClick={() => setGender("male")}
              className={`
                cursor-pointer p-6 rounded-xl flex flex-col items-center w-32
                ${
                  gender === "male"
                    ? "bg-blue-500/30 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/10 border-white/20"
                }
                border hover:scale-105 transition duration-200
              `}
            >
              <FaMale size={40} className="text-blue-400 mb-2" />
              <p>Male</p>
            </div>

            {/* Female */}
            <div
              onClick={() => setGender("female")}
              className={`
                cursor-pointer p-6 rounded-xl flex flex-col items-center w-32
                ${
                  gender === "female"
                    ? "bg-pink-500/30 border-pink-400 shadow-lg shadow-pink-500/30"
                    : "bg-white/10 border-white/20"
                }
                border hover:scale-105 transition duration-200
              `}
            >
              <FaFemale size={40} className="text-pink-400 mb-2" />
              <p>Female</p>
            </div>

          </div>

          {/* Button */}
          <button
            disabled={!gender}
            onClick={() => {
              const existing = JSON.parse(localStorage.getItem("user")) || {};
              localStorage.setItem("user", JSON.stringify({ ...existing, gender }));
              navigate("/level");
            }}
            className="mt-8 w-full py-3 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-blue-500 to-cyan-400 
            shadow-lg shadow-blue-500/30
            hover:scale-105 hover:shadow-blue-500/50 
            disabled:opacity-40 disabled:cursor-not-allowed
            transition duration-300"
          >
            Continue →
          </button>

        </motion.div>
      </div>
    </div>
  );
};

export default Gender;