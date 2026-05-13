import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/input";
import { signupAPI } from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email || !password) {
      setError("⚠ Please enter email and password");
      return;
    }
    if (password.length < 6) {
      setError("⚠ Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🌐 Try backend first
      const { data } = await signupAPI({ name, email, password });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify({
        name: data.name || name,
        email: data.email,
        _id: data._id,
      }));
    } catch (err) {
      // 💾 Fallback: save to localStorage if backend is offline
      console.warn("Backend unavailable, using localStorage fallback");
      localStorage.setItem("user", JSON.stringify({ name, email, password }));
    } finally {
      setLoading(false);
      navigate("/details");
    }
  };

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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 md:p-10
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-2xl shadow-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-center
          bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400
          bg-clip-text text-transparent mb-6">
            Create Account 🚀
          </h1>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
            <Input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          <button
            onClick={handleNext}
            disabled={!email || !password || loading}
            className="mt-6 w-full py-3 rounded-xl text-lg font-semibold
            bg-gradient-to-r from-blue-500 to-cyan-400
            shadow-lg shadow-blue-500/30
            hover:scale-105 hover:shadow-blue-500/50
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95 transition duration-300
            flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> Creating Account...</>
            ) : "Continue →"}
          </button>

          <p className="text-center text-gray-400 mt-4 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;