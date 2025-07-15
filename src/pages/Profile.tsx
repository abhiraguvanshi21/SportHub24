import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Mail, Phone, Calendar, Trophy, Target, TrendingUp,
  Edit3, Save, X, Camera, Award, BarChart3, Activity,
  Users, MapPin, Star, Settings
} from 'lucide-react';

// ===== Define User Type =====
type UserStats = {
  matchesPlayed: number;
  matchesScored: number;
  totalRuns: number;
  highestScore: number;
  battingAverage: number;
  centuries: number;
  halfCenturies: number;
  totalFours: number;
  totalSixes: number;
  totalWickets: number;
  bestBowling: string;
  bowlingAverage: number;
  fiveWicketHauls: number;
  totalMaidens: number;
  economyRate: number;
  totalCatches: number;
  totalRunOuts: number;
  totalStumpings: number;
  strikeRate: number;
};

type MatchStats = {
  batting?: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
  };
  bowling?: {
    wickets: number;
    runs: number;
    overs: number;
    economy: number;
    maidens: number;
  };
  fielding?: {
    catches: number;
    runOuts: number;
    stumpings: number;
  };
};

type MatchHistoryItem = {
  id: string;
  matchTitle: string;
  date: string;
  venue: string;
  format: string;
  result: string;
  playerStats: MatchStats;
};

type UserType = {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  favoriteTeam?: string;
  location?: string;
  playingRole?: string;
  profileImageUrl?: string;
  joinedDate: string;
  stats: UserStats;
  matchHistory: MatchHistoryItem[];
  achievements: string[];
};

// ===== Component =====
const Profile = () => {
  const { user, updateProfile, logout } = useAuth() as {
    user: UserType | null;
    updateProfile: (data: Partial<UserType>) => Promise<boolean>;
    logout: () => void;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>(user || {});
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matches' | 'achievements'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <a href="/login" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setEditData({
          ...editData,
          profileImageUrl: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
      setImagePreview(null);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setImagePreview(null);
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Not specified';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'matches', label: 'Match History', icon: <Activity className="h-4 w-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="h-4 w-4" /> }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-red-100">
          <div className="bg-gradient-to-r from-red-600 to-red-800 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {imagePreview || user.profileImageUrl ? (
                    <img 
                      src={imagePreview || user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-red-500 bg-transparent focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                )}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email || ''}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500"
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {formatDate(user.joinedDate)}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={editData.location || ''}
                          onChange={handleInputChange}
                          className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500"
                        />
                      ) : (
                        <span>{user.location}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-red-500" />
                    <span className="font-medium">{user.stats.matchesPlayed} Matches</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1 text-red-600" />
                    <span className="font-medium">{user.stats.totalRuns} Runs</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-red-700" />
                    <span className="font-medium">{user.stats.totalWickets} Wickets</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl border border-red-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {isEditing ? (
                        <select
                          name="playingRole"
                          value={editData.playingRole || ''}
                          onChange={handleInputChange}
                          className="bg-transparent text-center focus:outline-none"
                        >
                          <option value="Not specified">Not specified</option>
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="All-rounder">All-rounder</option>
                          <option value="Wicket-keeper">Wicket-keeper</option>
                        </select>
                      ) : (
                        user.playingRole
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Playing Role</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-red-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editData.phone || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editData.dateOfBirth || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {user.dateOfBirth 
                              ? `${formatDate(user.dateOfBirth)} (${calculateAge(user.dateOfBirth)} years)`
                              : 'Not provided'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Team</label>
                      {isEditing ? (
                        <select
                          name="favoriteTeam"
                          value={editData.favoriteTeam || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select favorite team</option>
                          <option value="Mumbai Indians">Mumbai Indians</option>
                          <option value="Chennai Super Kings">Chennai Super Kings</option>
                          <option value="Royal Challengers Bangalore">Royal Challengers Bangalore</option>
                          <option value="Team India">Team India</option>
                          <option value="Australia">Australia</option>
                          <option value="England">England</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{user.favoriteTeam || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={editData.location || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter your location"
                        />
                      ) : (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{user.location || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{user.stats.matchesPlayed}</div>
                      <div className="text-sm text-gray-600">Matches Played</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-700">{user.stats.matchesScored}</div>
                      <div className="text-sm text-gray-600">Matches Scored</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{user.stats.totalRuns}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-700">{user.stats.totalWickets}</div>
                      <div className="text-sm text-gray-600">Total Wickets</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Batting Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Batting Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.totalRuns}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-700">{user.stats.highestScore}</div>
                      <div className="text-sm text-gray-600">Highest Score</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.battingAverage.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Batting Average</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.centuries}</div>
                      <div className="text-xs text-gray-600">Centuries</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.halfCenturies}</div>
                      <div className="text-xs text-gray-600">Half Centuries</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.totalFours}</div>
                      <div className="text-xs text-gray-600">Fours</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.totalSixes}</div>
                      <div className="text-xs text-gray-600">Sixes</div>
                    </div>
                  </div>
                </div>

                {/* Bowling Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-700" />
                    Bowling Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.totalWickets}</div>
                      <div className="text-sm text-gray-600">Total Wickets</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-700">{user.stats.bestBowling}</div>
                      <div className="text-sm text-gray-600">Best Bowling</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.bowlingAverage.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Bowling Average</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.fiveWicketHauls}</div>
                      <div className="text-xs text-gray-600">5 Wicket Hauls</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.totalMaidens}</div>
                      <div className="text-xs text-gray-600">Maidens</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-700">{user.stats.economyRate.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Economy Rate</div>
                    </div>
                  </div>
                </div>

                {/* Fielding Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-red-800" />
                    Fielding Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.totalCatches}</div>
                      <div className="text-sm text-gray-600">Catches</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-700">{user.stats.totalRunOuts}</div>
                      <div className="text-sm text-gray-600">Run Outs</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600">{user.stats.totalStumpings}</div>
                      <div className="text-sm text-gray-600">Stumpings</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Match History</h3>
                {user.matchHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.matchHistory.map((match) => (
                      <div key={match.id} className="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{match.matchTitle}</h4>
                          <span className="text-sm text-gray-500">{formatDate(match.date)}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{match.venue}</span> • {match.format}
                        </div>
                        <div className="text-sm font-medium text-red-600 mb-3">{match.result}</div>
                        
                        {/* Player Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {match.playerStats.batting && (
                            <div className="bg-red-50 p-3 rounded border border-red-200">
                              <div className="font-medium text-red-700 mb-1">Batting</div>
                              <div>{match.playerStats.batting.runs} runs ({match.playerStats.batting.balls} balls)</div>
                              <div>{match.playerStats.batting.fours} fours, {match.playerStats.batting.sixes} sixes</div>
                              <div>SR: {match.playerStats.batting.strikeRate}</div>
                            </div>
                          )}
                          {match.playerStats.bowling && (
                            <div className="bg-red-50 p-3 rounded border border-red-200">
                              <div className="font-medium text-red-700 mb-1">Bowling</div>
                              <div>{match.playerStats.bowling.wickets}/{match.playerStats.bowling.runs} ({match.playerStats.bowling.overs} overs)</div>
                              <div>Economy: {match.playerStats.bowling.economy}</div>
                              <div>Maidens: {match.playerStats.bowling.maidens}</div>
                            </div>
                          )}
                          {match.playerStats.fielding && (
                            <div className="bg-red-50 p-3 rounded border border-red-200">
                              <div className="font-medium text-red-700 mb-1">Fielding</div>
                              <div>Catches: {match.playerStats.fielding.catches}</div>
                              <div>Run Outs: {match.playerStats.fielding.runOuts}</div>
                              <div>Stumpings: {match.playerStats.fielding.stumpings}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No match history yet. Start playing to see your matches here!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Awards</h3>
                {user.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <Award className="h-8 w-8 text-red-600 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-900">{achievement}</div>
                          <div className="text-sm text-gray-600">2024</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements yet. Keep playing to earn your first award!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold">5 Matches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Year</span>
                  <span className="font-semibold">{user.stats.matchesPlayed} Matches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Matches Scored</span>
                  <span className="font-semibold">{user.stats.matchesScored}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Strike Rate</span>
                  <span className="font-semibold">{user.stats.strikeRate.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Add New Match
                </button>
                <button className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Live Matches
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
