import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Zap, Award, ArrowRight, TrendingUp, Plus, Eye } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Play className="h-8 w-8" />,
      title: "Live Scoring",
      description: "Real-time cricket scores with ball-by-ball commentary and live video streaming."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Matches",
      description: "Score your own matches and discover games from cricket enthusiasts worldwide."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Updates",
      description: "Get instant notifications for wickets, boundaries, and match highlights."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Match Statistics",
      description: "Comprehensive match statistics, player performance, and historical data."
    }
  ];

  const liveMatches = [
    {
      teams: "India vs Australia",
      status: "Live",
      score: "IND 287/4 (45.2 overs)",
      venue: "Melbourne Cricket Ground",
      type: "professional"
    },
    {
      teams: "Mumbai Warriors vs Delhi Dynamos",
      status: "Live",
      score: "MW 156/4 (18.3 overs)",
      venue: "Local Ground, Mumbai",
      type: "community",
      scorer: "Rajesh Kumar",
      viewers: 234
    },
    {
      teams: "England vs New Zealand",
      status: "Live",
      score: "ENG 156/7 (28.4 overs)",
      venue: "Lord's Cricket Ground",
      type: "professional"
    }
  ];

  const communityStats = [
    { number: "1,250+", label: "Community Matches" },
    { number: "5,600+", label: "Active Scorers" },
    { number: "25,000+", label: "Total Viewers" },
    { number: "150+", label: "Live Now" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Live Cricket Scoring
              <span className="block text-3xl md:text-5xl text-green-200">
                By Everyone, For Everyone
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Watch professional matches, score your own games, and join a community of cricket enthusiasts. 
              Experience cricket like never before with real-time scoring and live commentary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/live-scoring"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center group"
              >
                Watch Live Matches
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/add-match"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200 flex items-center justify-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Score Your Match
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-gray-600">
              Cricket enthusiasts from around the world are already scoring and watching matches
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live & Upcoming Matches
            </h2>
            <p className="text-xl text-gray-600">
              Professional tournaments and community matches happening now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveMatches.map((match, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{match.teams}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'Live' 
                        ? 'bg-red-100 text-red-700 animate-pulse' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {match.status}
                    </span>
                    {match.type === 'community' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Community
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">{match.score}</p>
                <p className="text-gray-600 text-sm mb-3">{match.venue}</p>
                
                {match.type === 'community' && (
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Scored by {match.scorer}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{match.viewers}</span>
                    </div>
                  </div>
                )}
                
                {match.status === 'Live' && (
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Watching Live</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/user-scoring"
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center"
            >
              View All Community Matches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SportHub24?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional cricket coverage meets community-driven scoring in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-green-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-green-100">
                <div className="text-green-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start scoring your cricket matches in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Match</h3>
              <p className="text-gray-600">
                Set up your match details including teams, venue, and format. Choose to make it public or private.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Score Live</h3>
              <p className="text-gray-600">
                Use our intuitive scoring interface to update runs, wickets, and player statistics in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Share & Engage</h3>
              <p className="text-gray-600">
                Share your match with the community and let cricket fans follow the action live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Cricket Community?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you're watching or scoring, SportHub24 brings cricket fans together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-match"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 inline-flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Start Scoring
            </Link>
            <Link
              to="/user-scoring"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 inline-flex items-center"
            >
              Explore Matches
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;