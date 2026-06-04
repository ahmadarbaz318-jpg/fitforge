import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/input";
import { loginAPI } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Login Simulated States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = (response) => {
    try {
      const jwt = response.credential;
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      const selectedUser = {
        name: payload.name,
        email: payload.email,
        weight: "75",
        height: "180",
        age: "24",
        gender: "male",
        level: "Intermediate",
      };
      localStorage.setItem("user", JSON.stringify(selectedUser));
      localStorage.setItem("authToken", jwt);
      navigate("/dashboard");
    } catch (e) {
      setError("❌ Google Sign-in failed. Please try again.");
    }
  };

  useEffect(() => {
    if (googleClientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtnReal"),
        {
          theme: "filled_blue",
          size: "large",
          width: 384,
          shape: "pill",
        }
      );
    }
  }, [googleClientId]);

  const handleGoogleSelect = (accountType) => {
    setError("");
    if (accountType === "default") {
      const selectedUser = {
        name: "Arbaz Ahmad",
        email: "ahmadarbaz318@gmail.com",
        weight: "75",
        height: "180",
        age: "24",
        gender: "male",
        level: "Intermediate",
      };
      localStorage.setItem("user", JSON.stringify(selectedUser));
      localStorage.setItem("authToken", "google_token_12345");
      setShowGoogleModal(false);
      navigate("/dashboard");
    } else {
      if (!customEmail || !customEmail.includes("@")) {
        setError("⚠ Please enter a valid email address");
        return;
      }
      const nameFromEmail = customEmail.split("@")[0];
      const selectedUser = {
        name: customName || (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)),
        email: customEmail,
      };
      localStorage.setItem("user", JSON.stringify(selectedUser));
      localStorage.setItem("authToken", "google_token_custom");
      setShowGoogleModal(false);
      navigate("/details"); // Navigate to onboarding details for custom new user!
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("⚠ Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🌐 Try backend first
      const { data } = await loginAPI({ email, password });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email,
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        level: data.level,
        _id: data._id,
      }));
      navigate("/dashboard");
    } catch (err) {
      // 💾 Fallback: check localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setError("⚠ No account found. Please signup first.");
      } else if (user.email !== email || user.password !== password) {
        setError("❌ Invalid email or password.");
      } else {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="h-screen w-full relative overflow-hidden text-white">
      {/* 🎥 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px]"
        style={{
          backgroundImage:
            "url('/trainer-bg.png')",
        }}
      />
      <div className="absolute inset-0 bg-black/75" />
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
            Welcome Back 💪
          </h1>

          <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              className="py-3 rounded-xl text-lg font-semibold
              bg-gradient-to-r from-blue-500 to-cyan-400
              shadow-lg shadow-blue-500/30
              hover:scale-105 hover:shadow-blue-500/50
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95 transition duration-300
              flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <><span className="animate-spin">⏳</span> Logging in...</>
              ) : "Login →"}
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative z-10 px-3 bg-[#1e2230] text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Or
              </span>
            </div>

            {googleClientId ? (
              <div id="googleBtnReal" className="w-full flex justify-center my-2" />
            ) : (
              <button
                type="button"
                onClick={() => { setShowGoogleModal(true); setError(""); }}
                className="py-3 rounded-xl text-base font-semibold
                bg-white text-black hover:bg-gray-100 active:scale-95 transition duration-300
                flex items-center justify-center gap-3 cursor-pointer shadow-lg w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.2 7.74 8.87 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57l3.77 2.92c2.2-2.03 3.68-5.02 3.68-8.64z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.78a7.02 7.02 0 0 1 0-4.13l-3.89-3.02A11.96 11.96 0 0 0 0 12c0 1.61.32 3.16.89 4.58l4.39-3.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.11.75-2.53 1.19-4.19 1.19-3.13 0-5.8-2.7-6.72-5.54l-3.89 3.02C3.37 20.33 7.35 23 12 23z"
                  />
                </svg>
                Sign in with Google
              </button>
            )}

            <button
              onClick={() => navigate("/signup")}
              className="py-3 rounded-xl text-lg font-semibold
              bg-white/10 border border-white/20
              hover:bg-white/20 transition cursor-pointer mt-1"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      </div>

      {/* 🔐 GOOGLE SIGN IN MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#0f172a] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.2 7.74 8.87 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57l3.77 2.92c2.2-2.03 3.68-5.02 3.68-8.64z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.78a7.02 7.02 0 0 1 0-4.13l-3.89-3.02A11.96 11.96 0 0 0 0 12c0 1.61.32 3.16.89 4.58l4.39-3.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.11.75-2.53 1.19-4.19 1.19-3.13 0-5.8-2.7-6.72-5.54l-3.89 3.02C3.37 20.33 7.35 23 12 23z"
                  />
                </svg>
                <span className="text-sm font-bold text-white">Google Accounts</span>
              </div>
              <button
                onClick={() => { setShowGoogleModal(false); setShowCustomInput(false); }}
                className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Choose an account</h2>
                <p className="text-xs text-gray-400 mt-1">to continue to FitForge</p>
              </div>

              {!showCustomInput ? (
                <div className="space-y-2.5">
                  {/* Default Account */}
                  <button
                    onClick={() => handleGoogleSelect("default")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                        AA
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Arbaz Ahmad</p>
                        <p className="text-xs text-gray-400">ahmadarbaz318@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-green-400 font-bold uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Active</span>
                  </button>

                  {/* Use another account */}
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-300 text-sm">
                      +
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Use another account</p>
                      <p className="text-xs text-gray-400">Sign in with a different Google account</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-bold">Email address</label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-bold">Full Name (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { setShowCustomInput(false); setError(""); }}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleGoogleSelect("custom")}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

  export default Login;