import { Link } from 'react-router-dom';
import { Play, Users, Zap, Award, ArrowRight, Plus, Eye } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Play className="h-8 w-8" />,
      title: "Live Scoring",
      description: "Real-time cricket scores with ball-by-ball commentary."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Matches",
      description: "Score your own matches and share with the world."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Updates",
      description: "Lightning-fast updates for every ball."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Match Stats",
      description: "Deep stats & player performance insights."
    }
  ];

  const liveMatches = [
    {
      teams: "India vs Australia",
      score: "IND 287/4 (45.2)",
      venue: "MCG"
    },
    {
      teams: "Mumbai vs Delhi",
      score: "156/4 (18.3)",
      venue: "Mumbai Ground",
      viewers: 234
    },
    {
      teams: "England vs NZ",
      score: "156/7 (28.4)",
      venue: "Lord's"
    }
  ];

  return (
    <div className="bg-[#0B0F1A] text-white">

      {/* HERO */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/20 via-black to-black"></div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              CRICSEM
              <span className="block text-red-500 mt-2">
                Live Cricket. Real Time.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Watch live matches, score your own games, and connect with cricket fans worldwide.
            </p>

            <div className="mt-8 flex gap-4">
              <Link to="/live-scoring"
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition">
                Watch Live <ArrowRight size={18}/>
              </Link>

              <Link to="/add-match"
                className="border border-red-500 px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                <Plus size={18}/> Score Match
              </Link>
            </div>
          </div>

          {/* RIGHT LOGO */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 blur-3xl bg-red-600/30 rounded-full group-hover:scale-110 transition"></div>

              <img
                src="src/assets/ChatGPT Image May 20, 2026, 09_39_22 PM.png"
                className="relative w-72 rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE MATCHES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
          🔴 Live Matches
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {liveMatches.map((m, i) => (
            <div key={i}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:scale-105 transition shadow-lg">

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{m.teams}</h3>

                <span className="text-red-500 text-xs px-3 py-1 bg-red-500/10 rounded-full animate-pulse">
                  LIVE
                </span>
              </div>

              <p className="text-2xl font-bold text-red-400">{m.score}</p>
              <p className="text-gray-400 text-sm mt-2">{m.venue}</p>

              {m.viewers && (
                <div className="flex items-center mt-3 text-gray-400 text-sm">
                  <Eye size={14} className="mr-1"/>
                  {m.viewers}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-r from-black to-[#111827] py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why CRICSEM?
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div key={i}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-red-500 hover:shadow-red-500/20 hover:shadow-lg transition">

              <div className="text-red-500 mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Start Scoring?
        </h2>

        <p className="text-gray-400 mb-8">
          Join thousands of cricket fans on CRICSEM
        </p>

        <Link to="/add-match"
          className="bg-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition inline-flex items-center gap-2">
          <Plus size={18}/> Start Now
        </Link>
      </section>

    </div>
  );
};

export default Home;