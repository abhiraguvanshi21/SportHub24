import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Clock, MapPin, Eye, Play, TrendingUp, Filter, Search } from 'lucide-react';

type Match = {
  id: number;
  title: string;
  team1: string;
  team2: string;
  status: string;
  scorer: string;
  venue: string;
  startTime: string;
  currentScore?: {
    team: string;
    runs: number;
    wickets: number;
    overs: number;
    runRate: number;
  };
  finalScore?: {
    team1Score: string;
    team2Score: string;
    result: string;
  };
  viewers: number;
  format: string;
  isUserMatch: boolean;
};

const mockMatches: Match[] = [
  {
    id: 1,
    title: "Local Club Championship Final",
    team1: "Mumbai Warriors",
    team2: "Delhi Dynamos",
    status: "Live",
    scorer: "Rajesh Kumar",
    venue: "Oval Ground, Mumbai",
    startTime: "2024-01-15T14:30:00",
    currentScore: {
      team: "Mumbai Warriors",
      runs: 156,
      wickets: 4,
      overs: 18.3,
      runRate: 8.51
    },
    viewers: 234,
    format: "T20",
    isUserMatch: true
  },
  {
    id: 2,
    title: "Corporate Cricket League",
    team1: "TechCorp XI",
    team2: "Finance United",
    status: "Live",
    scorer: "Priya Sharma",
    venue: "Sports Complex, Bangalore",
    startTime: "2024-01-15T15:00:00",
    currentScore: {
      team: "TechCorp XI",
      runs: 89,
      wickets: 2,
      overs: 12.4,
      runRate: 7.02
    },
    viewers: 156,
    format: "T20",
    isUserMatch: true
  },
  {
    id: 3,
    title: "University Championship",
    team1: "Engineering College",
    team2: "Medical College",
    status: "Completed",
    scorer: "Mike Thompson",
    venue: "University Ground, Delhi",
    startTime: "2024-01-14T10:00:00",
    finalScore: {
      team1Score: "187/6 (20 overs)",
      team2Score: "156/8 (20 overs)",
      result: "Engineering College won by 31 runs"
    },
    viewers: 89,
    format: "T20",
    isUserMatch: true
  },
  {
    id: 4,
    title: "Weekend Warriors League",
    team1: "Sunset Strikers",
    team2: "Morning Mavericks",
    status: "Upcoming",
    scorer: "Sarah Johnson",
    venue: "Central Park Ground, Chennai",
    startTime: "2024-01-16T16:00:00",
    viewers: 45,
    format: "ODI",
    isUserMatch: true
  },
  {
    id: 5,
    title: "Inter-Society Cricket Match",
    team1: "Residents XI",
    team2: "Visitors Team",
    status: "Live",
    scorer: "Amit Patel",
    venue: "Society Ground, Pune",
    startTime: "2024-01-15T17:00:00",
    currentScore: {
      team: "Residents XI",
      runs: 67,
      wickets: 1,
      overs: 8.2,
      runRate: 8.04
    },
    viewers: 78,
    format: "T20",
    isUserMatch: true
  }
];

const UserScoring = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setMatches(mockMatches);
    setFilteredMatches(mockMatches);
  }, []);

  useEffect(() => {
    let filtered = matches;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(match => match.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.scorer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
  }, [matches, filterStatus, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Upcoming':
        return 'bg-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Matches</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-8">
              Discover live cricket matches scored by our community members
            </p>
            <Link
              to="/add-match"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all duration-200 inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start Scoring Your Match
            </Link>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search matches, teams, or scorers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="All">All Matches</option>
                <option value="Live">Live</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 bg-gradient-to-r from-slate-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-red-100">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {matches.filter(m => m.status === 'Live').length}
              </div>
              <div className="text-gray-600">Live Matches</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-red-100">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {matches.filter(m => m.status === 'Upcoming').length}
              </div>
              <div className="text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-red-100">
              <div className="text-3xl font-bold text-red-800 mb-2">
                {matches.filter(m => m.status === 'Completed').length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-red-100">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {matches.reduce((sum, match) => sum + match.viewers, 0)}
              </div>
              <div className="text-gray-600">Total Viewers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Link
                to="/add-match"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Match
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-red-100">
                  <div className="p-6 border-b border-red-100">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{match.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(match.status)} ${
                        match.status === 'Live' ? 'animate-pulse' : ''
                      }`}>
                        {match.status}
                      </span>
                    </div>
                    
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      {match.team1} vs {match.team2}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{match.scorer}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{match.viewers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{match.venue}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTime(match.startTime)}</span>
                    </div>

                    {match.status === 'Live' && match.currentScore && (
                      <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                        <div className="text-sm text-red-700 mb-1">Current Score</div>
                        <div className="text-xl font-bold text-red-800">
                          {match.currentScore.runs}/{match.currentScore.wickets}
                        </div>
                        <div className="text-sm text-red-600">
                          ({match.currentScore.overs} overs) • RR: {match.currentScore.runRate}
                        </div>
                      </div>
                    )}

                    {match.status === 'Completed' && match.finalScore && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-sm text-gray-700 mb-2">Final Result</div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {match.team1}: {match.finalScore.team1Score}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          {match.team2}: {match.finalScore.team2Score}
                        </div>
                        <div className="text-sm font-bold text-red-700">
                          {match.finalScore.result}
                        </div>
                      </div>
                    )}

                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center">
                      {match.status === 'Live' ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Live
                        </>
                      ) : match.status === 'Upcoming' ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Set Reminder
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Scorecard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Score Your Match?</h2>
          <p className="text-xl mb-8 text-red-100">
            Join our community of cricket scorers and share your matches with fellow cricket enthusiasts
          </p>
          <Link
            to="/add-match"
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start Scoring Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserScoring;