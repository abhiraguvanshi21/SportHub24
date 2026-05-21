import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Calendar,
  Users,
 Video,
  Mic,
  Sparkles,
  Trophy,
  Shield,
  Star,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 3000);
  };

  const services = [
    {
      icon: <Video className="h-10 w-10" />,
      title: "Live Streaming",
      description: "Professional HD multi-camera cricket broadcasting.",
    },
    {
      icon: <Mic className="h-10 w-10" />,
      title: "Commentary",
      description: "Expert live commentary with real-time analysis.",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Production Team",
      description: "Complete scoring & production management team.",
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Tournament Coverage",
      description: "Full tournament broadcasting solutions.",
    },
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+91 9876543210", "+91 9876543211"],
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@cricsem.com", "booking@cricsem.com"],
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      details: ["Delhi, India", "Sports Broadcasting Studio"],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Availability",
      details: ["24/7 Match Coverage", "Emergency Support"],
    },
  ];

  return (
    <div className="bg-[#030712] text-white overflow-hidden relative">
      {/* ===================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ===================== */}

      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/20 blur-[150px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* ===================== */}
      {/* FLOATING GRAPHICS */}
      {/* ===================== */}

      {/* Cricket Ball */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -40, 0],
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute top-32 right-32 hidden lg:block"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_60px_rgba(239,68,68,0.8)] relative">
          <div className="absolute left-1/2 top-0 h-full border-l-4 border-dashed border-white/60"></div>
        </div>
      </motion.div>

      {/* Trophy */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-20 left-20 hidden lg:block"
      >
        <Trophy className="w-20 h-20 text-red-500/20" />
      </motion.div>

      {/* Sparkles */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute bottom-20 right-20 hidden lg:block"
      >
        <Sparkles className="w-24 h-24 text-orange-400/20" />
      </motion.div>

      {/* Rotating Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
        className="absolute bottom-32 left-20 hidden lg:block"
      >
        <div className="w-48 h-48 rounded-full border-[12px] border-red-500/20 border-t-red-500 border-r-orange-400 blur-[1px]"></div>
      </motion.div>

      {/* Neon Lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
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

      {/* ===================== */}
      {/* HERO SECTION */}
      {/* ===================== */}

      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-5 py-2 rounded-full mb-8 backdrop-blur-xl">
              <Star className="w-5 h-5 text-red-400" />

              <span className="text-red-300 font-medium">
                Professional Cricket Broadcasting
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              CONTACT{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                CRICSEM
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              Book premium cricket streaming, scoring, commentary,
              tournament broadcasting, and sports production services.
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all shadow-[0_0_40px_rgba(239,68,68,0.5)]">
                Book Match Coverage
              </button>

              <button className="border border-white/20 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">
                Contact Team
              </button>
            </div>

            {/* FEATURE BOXES */}
            <div className="grid grid-cols-2 gap-5 mt-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                <Shield className="text-red-500 mb-3" />

                <h3 className="font-bold text-lg mb-2">
                  Trusted Coverage
                </h3>

                <p className="text-gray-400 text-sm">
                  Professional sports media production with reliable support.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                <Users className="text-orange-400 mb-3" />

                <h3 className="font-bold text-lg mb-2">
                  Expert Team
                </h3>

                <p className="text-gray-400 text-sm">
                  Experienced commentators, scorers & camera operators.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>

            <motion.img
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
              alt="Cricket"
              className="relative rounded-[40px] shadow-[0_0_60px_rgba(239,68,68,0.4)] border border-white/10"
            />

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-10 -left-10 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-72"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <PlayCircle className="text-red-500 w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black">24/7</h3>

                  <p className="text-gray-400">
                    Live Match Coverage
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===================== */}
      {/* SERVICES */}
      {/* ===================== */}

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-red-400 uppercase tracking-[5px]">
              Services
            </span>

            <h2 className="text-5xl font-black mt-5">
              Complete Cricket Coverage
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 rounded-[30px] p-8 backdrop-blur-2xl hover:border-red-500 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-red-600 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* CONTACT FORM */}
      {/* ===================== */}

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-2xl"
          >
            <h2 className="text-4xl font-black mb-8">
              Book Your Match
            </h2>

            {isSubmitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-5" />

                <h3 className="text-3xl font-bold mb-3">
                  Request Submitted
                </h3>

                <p className="text-gray-400">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                  />

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="bg-black/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                  >
                    <option value="" className="text-black">Select Service</option>

                    <option value="streaming" className="bg-white/10 border-white/10 text-black">
                      Live Streaming
                    </option>

                    <option value="commentary"  className="text-black">
                      Commentary
                    </option>

                    <option value="production"  className="text-black">
                      Production Team
                    </option>

                    <option value="tournament"  className="text-black">
                      Tournament Coverage
                    </option>
                  </select>
                </div>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your tournament or match..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-500"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                >
                  <Send className="w-5 h-5" />

                  Submit Booking Request
                </button>
              </form>
            )}
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl flex gap-5 items-start"
              >
                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-2xl">
                  {info.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    {info.title}
                  </h3>

                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-400">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* RESPONSE BOX */}
            <div className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/20 rounded-[30px] p-8 backdrop-blur-2xl">
              <h3 className="text-3xl font-black mb-4">
                Fast Response Guarantee
              </h3>

              <p className="text-gray-300 leading-relaxed">
                We respond to all booking inquiries within 24
                hours with dedicated emergency support available
                for urgent match coverage.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== */}
      {/* CTA SECTION */}
      {/* ===================== */}

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-red-600/20 to-orange-500/20 backdrop-blur-2xl p-16">
          <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 blur-[100px] rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/20 blur-[100px] rounded-full"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Ready To Broadcast
              <br />
              Your Next Match?
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Professional cricket streaming, scoring,
              commentary, and tournament production for every
              level.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-gradient-to-r from-red-600 to-orange-500 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                Book Now
              </button>

              <button className="border border-white/20 bg-white/10 backdrop-blur-xl px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;