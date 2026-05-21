import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Camera,
  MapPin,
  Trophy,
  Sparkles,
  Star,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    playingRole: "Not specified" as
      | "Batsman"
      | "Bowler"
      | "All-rounder"
      | "Wicket-keeper"
      | "Not specified",
    favoriteTeam: "",
    location: "",
    profileImage: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState<
    string | null
  >(null);

  const { signup } = useAuth();

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });

      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsLoading(true);

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );

      setIsLoading(false);

      return;
    }

    try {
      const success = await signup({
        ...formData,
        profileImageUrl:
          imagePreview || undefined,
      });

      if (success) {
        navigate("/profile");
      } else {
        setError(
          "Failed to create account."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cricketTeams = [
    "Mumbai Indians",
    "Chennai Super Kings",
    "Royal Challengers Bangalore",
    "Kolkata Knight Riders",
    "Delhi Capitals",
    "Punjab Kings",
    "Rajasthan Royals",
    "Sunrisers Hyderabad",
    "Gujarat Titans",
    "Lucknow Super Giants",
    "Team India",
    "Australia",
    "England",
    "Pakistan",
    "South Africa",
    "New Zealand",
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative py-20 px-6 flex items-center justify-center">
      {/* ========================= */}
      {/* BACKGROUND */}
      {/* ========================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Glow */}
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

        {/* Animated Ball */}
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
      </div>

      {/* ========================= */}
      {/* MAIN CARD */}
      {/* ========================= */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 max-w-5xl w-full"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-5 py-2 rounded-full backdrop-blur-xl">
            <Star className="text-red-400 w-4 h-4" />

            <span className="text-red-300 text-sm font-medium">
              Join Premium Cricket Platform
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 shadow-[0_0_60px_rgba(239,68,68,0.15)]">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)] mb-6"
            >
              <UserPlus className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-5xl font-black mb-4">
              Create
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                {" "}
                Account
              </span>
            </h1>

            <p className="text-gray-400 text-lg">
              Join CRICSEM and build your cricket profile
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />

              <span className="text-red-300 text-sm">
                {error}
              </span>
            </div>
          )}

          {/* IMAGE */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-red-500/30 bg-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-20 h-20 text-gray-400" />
                )}
              </div>

              <label className="absolute bottom-2 right-2 bg-gradient-to-r from-red-600 to-orange-500 p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all">
                <Camera className="w-5 h-5 text-white" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* BASIC */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<User />}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />

              <InputField
                icon={<Mail />}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
              />
            </div>

            {/* CONTACT */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<Phone />}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />

              <InputField
                icon={<Calendar />}
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            {/* CRICKET */}
            <div className="grid md:grid-cols-2 gap-6">
              <select
                name="playingRole"
                value={formData.playingRole}
                onChange={handleInputChange}
                className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500 text-white"
              >
                <option className="bg-black">
                  Select Playing Role
                </option>

                <option className="bg-black">
                  Batsman
                </option>

                <option className="bg-black">
                  Bowler
                </option>

                <option className="bg-black">
                  All-rounder
                </option>

                <option className="bg-black">
                  Wicket-keeper
                </option>
              </select>

              <select
                name="favoriteTeam"
                value={formData.favoriteTeam}
                onChange={handleInputChange}
                className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500 text-white"
              >
                <option className="bg-black">
                  Favorite Team
                </option>

                {cricketTeams.map((team) => (
                  <option
                    key={team}
                    value={team}
                    className="bg-black"
                  >
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <InputField
              icon={<MapPin />}
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your Location"
            />

            {/* PASSWORDS */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-red-500 text-white placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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

              {/* CONFIRM */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-red-500 text-white placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                required
                className="accent-red-500"
              />

              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-red-400"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-red-400"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 py-4 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />

                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-400 font-semibold hover:text-red-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* BOTTOM CARD */}
        <motion.div
          whileHover={{ y: -5 }}
          className="mt-8 bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/20 rounded-[30px] p-6 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-500/20 p-3 rounded-2xl">
              <Shield className="text-red-400 w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold">
              Secure Registration
            </h3>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Your profile information is securely
            stored and protected with advanced
            authentication systems.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ========================= */
/* REUSABLE INPUT */
/* ========================= */

const InputField = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-red-500 text-white placeholder:text-gray-500"
      />
    </div>
  );
};

export default Signup;