import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, Phone, Calendar, Trophy, Target, TrendingUp, 
  Edit3, Save, X, Camera, Award, BarChart3, Activity,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditData(user);
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
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'matches', label: 'Match History', icon: <Activity className="h-4 w-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-red-100">
          <div className="bg-gradient-to-r from-red-600 to-red-800 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
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
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
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
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
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
                    <div className="text-2xl font-bold text-red-600">{user.playingRole}</div>
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
                              ? `${new Date(user.dateOfBirth).toLocaleDateString()} (${calculateAge(user.dateOfBirth)} years)`
                              : 'Not provided'
                            }
                          </span>
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
                      <div className="text-3xl font-bold text-red-600">{user.stats.battingAverage}</div>
                      <div className="text-sm text-gray-600">Batting Average</div>
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
                      <div className="text-3xl font-bold text-red-600">{user.stats.bowlingAverage}</div>
                      <div className="text-sm text-gray-600">Bowling Average</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Awards</h3>
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