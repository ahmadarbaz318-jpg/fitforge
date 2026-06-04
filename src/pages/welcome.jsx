import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 🔊 Sound
    const audio = new Audio("/sound.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});

    // 🎥 Parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">

      {/* 🎥 BACKGROUND (UPDATED 🔥) */}
      <motion.div
        animate={{ x: offset.x, y: offset.y, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="absolute inset-0 bg-cover bg-center blur-[1px]"
        style={{
          backgroundImage:
            "url('/trainer-bg.png')",
        }}
      />

      {/* 🌑 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/65" />

      {/* ✨ PARTICLES */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 💡 LIGHT RAYS */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[700px] h-[700px] 
        bg-gradient-to-r from-red-500/20 via-orange-400/10 to-transparent 
        blur-[120px] rounded-full animate-pulse"></div>
      </div>

      {/* 💪 CONTENT */}
      <div className="relative z-10 h-full flex flex-col 
      items-center justify-center text-white text-center px-6 md:px-12">

        <div className="max-w-5xl w-full">

          {/* 🔥 TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl lg:text-[110px] 
            font-extrabold leading-[1.05]"
          >
            <span className="text-white/70 block text-xl md:text-2xl mb-4 tracking-[0.3em]">
              WELCOME TO
            </span>

            <div className="flex items-center justify-center gap-4">

              {/* 💪 Animated Logo */}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl md:text-6xl"
              >
                💪
              </motion.span>

              <span className="uppercase bg-gradient-to-r 
              from-red-500 via-orange-400 to-yellow-400 
              bg-clip-text text-transparent 
              drop-shadow-[0_0_40px_rgba(255,100,0,0.5)]">
                FitForge
              </span>

            </div>
          </motion.h1>

          {/* 🤖 SUBTITLE */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-lg md:text-2xl text-gray-300 
            max-w-2xl mx-auto leading-relaxed"
          >
            <TypingText text="Build Strength. Track Progress. Become Unstoppable." />
          </motion.p>

          {/* 🚀 BUTTON */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => navigate("/login")}
            className="mt-12 px-10 py-5 text-xl font-semibold 
            bg-gradient-to-r from-red-500 to-orange-500 
            rounded-2xl shadow-2xl shadow-red-500/30
            hover:scale-105 hover:shadow-red-500/50
            transition duration-300"
          >
            Start Training 💪
          </motion.button>

        </div>
      </div>
    </div>
  );
};

export default Welcome;


//////////////////////////////////////////////////
// ✨ Typing Effect
const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};