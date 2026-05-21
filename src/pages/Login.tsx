import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Trophy,
  Sparkles,
  PlayCircle,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);

    try {
      const success = await login(
        "demo@cricsem.com",
        "demo123",
        false
      );

      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative flex items-center justify-center px-6 py-20">
      {/* ========================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ========================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[140px] rounded-full"></div>

        {/* Floating Trophy */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="absolute top-20 left-20 hidden lg:block"
        >
          <Trophy className="w-24 h-24 text-red-500/20" />
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6,
          }}
          className="absolute bottom-20 right-20 hidden lg:block"
        >
          <Sparkles className="w-28 h-28 text-orange-400/20" />
        </motion.div>

        {/* Animated Cricket Ball */}
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
          }}
          className="absolute top-32 right-32 hidden lg:block"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_60px_rgba(239,68,68,0.7)] relative">
            <div className="absolute left-1/2 top-0 h-full border-l-4 border-dashed border-white/60"></div>
          </div>
        </motion.div>

        {/* Neon Lines */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          }}
          className="absolute top-1/4 w-[400px] h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent blur-sm"
        />

        <motion.div
          animate={{
            x: ["200%", "-100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "linear",
          }}
          className="absolute bottom-1/3 w-[500px] h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-sm"
        />
      </div>

      {/* ========================= */}
      {/* LOGIN CARD */}
      {/* ========================= */}

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-5 py-2 rounded-full backdrop-blur-xl">
            <Star className="text-red-400 w-4 h-4" />

            <span className="text-red-300 text-sm font-medium">
              Premium Cricket Platform
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_0_60px_rgba(239,68,68,0.15)]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            >
              <LogIn className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black mb-3">
              Welcome
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                {" "}
                Back
              </span>
            </h1>

            <p className="text-gray-400">
              Login to your CRICSEM sports profile
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />

              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-red-500 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-red-500 text-white placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="accent-red-500"
                />

                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[#0B1220] px-4 text-gray-400 text-sm">
                OR CONTINUE
              </span>
            </div>
          </div>

          {/* DEMO BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-white/10 border border-white/10 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all"
          >
            Try Demo Account
          </motion.button>

          {/* FOOTER */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Create Profile
              </Link>
            </p>
          </div>
        </div>

        {/* DEMO CARD */}
        <motion.div
          whileHover={{ y: -5 }}
          className="mt-8 bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/20 rounded-[30px] p-6 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-500/20 p-3 rounded-2xl">
              <PlayCircle className="text-red-400 w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold">
              Demo Credentials
            </h3>
          </div>

          <div className="space-y-2 text-gray-300">
            <p>
              <span className="text-red-400 font-semibold">
                Email:
              </span>{" "}
              demo@cricsem.com
            </p>

            <p>
              <span className="text-red-400 font-semibold">
                Password:
              </span>{" "}
              demo123
            </p>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Use these credentials to explore the platform.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;