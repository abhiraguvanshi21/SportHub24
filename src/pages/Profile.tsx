import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User as UserIcon, Mail, Phone, Calendar, Trophy, Target, TrendingUp, 
  Edit3, Save, X, Camera, Award, BarChart3, Activity,
  Users, Star, Settings
} from 'lucide-react';
// Import the User type/interface from your types/models location
// Define User type locally if not available from '../types/User'
type PlayingRole = "Batsman" | "Bowler" | "All-rounder" | "Wicket-keeper" | "Not specified";

type User = {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  joinedDate: string;
  profileImage?: string;
  playingRole: PlayingRole;
  favoriteTeam?: string;
  achievements: string[];
  stats: {
    matchesPlayed: number;
    matchesScored: number;
    totalRuns: number;
    totalWickets: number;
    highestScore: number;
    battingAverage: number;
    strikeRate: number;
    bestBowling: string;
    bowlingAverage: number;
    economyRate: number;
  };
};

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  type UserProfile = User;
  const [editData, setEditData] = useState<UserProfile>(user!);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <a href="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: UserProfile) => ({
      ...prev,
      [name]: value
    }) as UserProfile);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };
  const handleCancel = () => {
    setEditData(user as UserProfile);
    setIsEditing(false);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <UserIcon className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'matches', label: 'Match History', icon: <Activity className="h-4 w-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <UserIcon className="h-32 w-32 text-gray-400 rounded-full bg-white border-4 border-white shadow-lg" />
              )}
              <button className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
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
                    className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-green-500 bg-transparent focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                )}
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email || ''}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{user.stats.matchesPlayed} Matches</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1 text-green-500" />
                    <span className="font-medium">{user.stats.totalRuns} Runs</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="font-medium">{user.stats.totalWickets} Wickets</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.playingRole}</div>
                    <div className="text-sm text-gray-600">Playing Role</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
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
                <div className="bg-white rounded-xl shadow-lg p-6">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {user.dateOfBirth 
                              ? `${new Date(user.dateOfBirth).toLocaleDateString()} (${calculateAge(user.dateOfBirth)} years)`
                              : 'Not provided'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Playing Role</label>
                      {isEditing ? (
                        <select
                          name="playingRole"
                          value={editData.playingRole || 'Not specified'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Not specified">Not specified</option>
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="All-rounder">All-rounder</option>
                          <option value="Wicket-keeper">Wicket-keeper</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{user.playingRole}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Team</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="favoriteTeam"
                          value={editData.favoriteTeam || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="e.g., Mumbai Indians"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{user.favoriteTeam || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{user.stats.matchesPlayed}</div>
                      <div className="text-sm text-gray-600">Matches Played</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{user.stats.matchesScored}</div>
                      <div className="text-sm text-gray-600">Matches Scored</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{user.stats.totalRuns}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{user.stats.totalWickets}</div>
                      <div className="text-sm text-gray-600">Total Wickets</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Batting Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-600" />
                    Batting Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{user.stats.totalRuns}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{user.stats.highestScore}</div>
                      <div className="text-sm text-gray-600">Highest Score</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">{user.stats.battingAverage}</div>
                      <div className="text-sm text-gray-600">Batting Average</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{user.stats.strikeRate}</div>
                      <div className="text-sm text-gray-600">Strike Rate</div>
                    </div>
                  </div>
                </div>

                {/* Bowling Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Bowling Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">{user.stats.totalWickets}</div>
                      <div className="text-sm text-gray-600">Total Wickets</div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600">{user.stats.bestBowling}</div>
                      <div className="text-sm text-gray-600">Best Bowling</div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="text-3xl font-bold text-teal-600">{user.stats.bowlingAverage}</div>
                      <div className="text-sm text-gray-600">Bowling Average</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <div className="text-3xl font-bold text-pink-600">{user.stats.economyRate}</div>
                      <div className="text-sm text-gray-600">Economy Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Matches</h3>
                <div className="space-y-4">
                  {/* Mock match history */}
                  {[1, 2, 3].map((match) => (
                    <div key={match} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">Local Club Championship</h4>
                          <p className="text-sm text-gray-600">Mumbai Warriors vs Delhi Dynamos</p>
                          <p className="text-xs text-gray-500">January 15, 2024</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">Won by 25 runs</div>
                          <div className="text-xs text-gray-500">Scored: 45* (32 balls)</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Awards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Award className="h-8 w-8 text-yellow-600 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">{achievement}</div>
                        <div className="text-sm text-gray-600">2024</div>
                      </div>
                    </div>
                  ))}
                  {user.achievements.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No achievements yet. Keep playing to earn your first award!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
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
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Add New Match
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
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
            <div className="bg-white rounded-xl shadow-lg p-6">
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