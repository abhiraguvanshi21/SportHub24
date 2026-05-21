import {
  Trophy,
  PlayCircle,
  Globe,
  Shield,
  Radio,
  Camera,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const services = [
    {
      title: "Live Streaming",
      icon: <PlayCircle size={40} />,
      desc: "Multi-camera HD cricket streaming with professional production.",
    },
    {
      title: "Live Commentary",
      icon: <Radio size={40} />,
      desc: "Real-time commentary and expert cricket analysis.",
    },
    {
      title: "Photography",
      icon: <Camera size={40} />,
      desc: "Cinematic cricket photography & highlight reels.",
    },
  ];

  const stats = [
    { number: "1500+", label: "Matches Covered" },
    { number: "50K+", label: "Fans Connected" },
    { number: "24/7", label: "Live Coverage" },
    { number: "100+", label: "Cities" },
  ];

  return (
    <div className="bg-[#030712] text-white overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[140px] rounded-full"></div>

        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Floating Graphics */}
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-20 left-20 hidden lg:block"
        >
          <Trophy className="text-red-500 w-20 h-20 opacity-20" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute bottom-20 right-20 hidden lg:block"
        >
          <Sparkles className="text-orange-400 w-24 h-24 opacity-20" />
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-5 py-2 rounded-full mb-8 backdrop-blur-xl">
              <Star className="text-red-500 w-5 h-5" />
              <span className="text-red-300 font-medium">
                Premium Sports Broadcasting
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              ABOUT{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                CRICSEM
              </span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              We create next-generation cricket broadcasting experiences with
              live streaming, professional scoring, commentary, photography,
              and tournament production.
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all shadow-[0_0_40px_rgba(239,68,68,0.5)]">
                Explore Services
              </button>

              <button className="border border-white/20 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">
                Watch Live
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-5 mt-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                <Shield className="text-red-500 mb-3" />
                <h3 className="font-bold text-lg mb-2">
                  Trusted Production
                </h3>
                <p className="text-gray-400 text-sm">
                  High-quality sports production and reliable streaming.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                <Globe className="text-orange-400 mb-3" />
                <h3 className="font-bold text-lg mb-2">
                  Global Audience
                </h3>
                <p className="text-gray-400 text-sm">
                  Connecting cricket fans worldwide through technology.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT GRAPHIC */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>

            {/* Main Image */}
            <motion.img
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
              alt="Cricket"
              className="relative rounded-[40px] shadow-[0_0_60px_rgba(239,68,68,0.4)] border border-white/10"
            />

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-10 -left-10 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-72 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <PlayCircle className="text-red-500 w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black">24/7</h3>
                  <p className="text-gray-400">Live Match Coverage</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl hover:border-red-500 transition-all"
            >
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-3">
                {item.number}
              </h2>

              <p className="text-gray-400">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-red-400 uppercase tracking-[5px]">
              Our Services
            </span>

            <h2 className="text-5xl font-black mt-5">
              Complete Cricket Coverage Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.04,
                  rotate: 1,
                }}
                className="relative group bg-white/5 border border-white/10 rounded-[30px] p-10 overflow-hidden backdrop-blur-2xl"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-red-600 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                    {service.icon}
                  </div>

                  <h3 className="text-3xl font-bold mb-5">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-8">
                    {service.desc}
                  </p>

                  <button className="bg-white/10 border border-white/10 px-6 py-3 rounded-xl hover:bg-red-500 transition-all">
                    Explore →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-red-400 uppercase tracking-[5px]">
            Team Members
          </span>

          <h2 className="text-5xl font-black mt-5 mb-20">
            Experts Behind Every Match
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -12 }}
                className="bg-white/5 border border-white/10 rounded-[30px] overflow-hidden backdrop-blur-xl"
              >
                <div className="relative">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${item + 20}.jpg`}
                    className="w-full h-80 object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold">Team Member</h3>

                  <p className="text-red-400 mt-2">Sports Specialist</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;