import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Users, Trophy, Play } from 'lucide-react';

const AddMatch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [matchData, setMatchData] = useState({
    title: '',
    team1: '',
    team2: '',
    venue: '',
    date: '',
    time: '',
    format: 'T20',
    overs: 20,
    description: '',
    isPublic: true,
    scorerName: '',
    contactInfo: ''
  });

  const [liveScoring, setLiveScoring] = useState({
    isLive: false,
    currentInnings: 1,
    battingTeam: '',
    currentScore: {
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0
    },
    currentBatsmen: [
      { name: '', runs: 0, balls: 0, fours: 0, sixes: 0 },
      { name: '', runs: 0, balls: 0, fours: 0, sixes: 0 }
    ],
    currentBowler: { name: '', overs: 0, maidens: 0, runs: 0, wickets: 0 }
  });

  const handleInputChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setMatchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const addRuns = (runs: number) => {
    setLiveScoring(prev => ({
      ...prev,
      currentScore: {
        ...prev.currentScore,
        runs: prev.currentScore.runs + runs,
        balls: prev.currentScore.balls + 1
      }
    }));
  };

  const addWicket = () => {
    setLiveScoring(prev => ({
      ...prev,
      currentScore: {
        ...prev.currentScore,
        wickets: prev.currentScore.wickets + 1,
        balls: prev.currentScore.balls + 1
      }
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Match Data:', matchData);
    console.log('Live Scoring:', liveScoring);
    
    alert('Match created successfully!');
    navigate('/user-scoring');
  };

  const startLiveScoring = () => {
    setLiveScoring(prev => ({
      ...prev,
      isLive: true,
      battingTeam: matchData.team1
    }));
    setCurrentStep(3);
  };

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Add Your Match</h1>
          <p className="text-xl text-red-100">Create and score your cricket match live</p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Match Details', icon: <Trophy className="h-5 w-5" /> },
              { step: 2, title: 'Scorer Info', icon: <Users className="h-5 w-5" /> },
              { step: 3, title: 'Live Scoring', icon: <Play className="h-5 w-5" /> }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= item.step 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= item.step ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {item.title}
                </span>
                {item.step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > item.step ? 'bg-red-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Match Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Match Details</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={matchData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Local Club Championship Final"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team 1 *
                  </label>
                  <input
                    type="text"
                    name="team1"
                    value={matchData.team1}
                    onChange={handleInputChange}
                    placeholder="Team name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team 2 *
                  </label>
                  <input
                    type="text"
                    name="team2"
                    value={matchData.team2}
                    onChange={handleInputChange}
                    placeholder="Team name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
              >
                Continue to Scorer Info
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Scorer Information */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Scorer Information</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="scorerName"
                  value={matchData.scorerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Scorer Guidelines</h3>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• Ensure accurate ball-by-ball scoring</li>
                  <li>• Update scores promptly after each delivery</li>
                  <li>• Be respectful in any commentary or descriptions</li>
                  <li>• Follow fair play principles</li>
                  <li>• Contact support if you need assistance</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={startLiveScoring}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Start Live Scoring
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Live Scoring Interface */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Match Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{matchData.team1} vs {matchData.team2}</h2>
                <div className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  Live Scoring
                </div>
              </div>
              <p className="text-gray-600">{matchData.venue} • {matchData.date}</p>
            </div>

            {/* Current Score */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Score</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {liveScoring.currentScore.runs}/{liveScoring.currentScore.wickets}
                  </div>
                  <div className="text-gray-600">
                    {Math.floor(liveScoring.currentScore.balls / 6)}.{liveScoring.currentScore.balls % 6} overs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-red-700">
                    {liveScoring.currentScore.balls > 0 ? (liveScoring.currentScore.runs / (liveScoring.currentScore.balls / 6)).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-gray-600">Run Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-red-800">{liveScoring.battingTeam}</div>
                  <div className="text-gray-600">Batting</div>
                </div>
              </div>
            </div>

            {/* Quick Scoring Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Scoring</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
                {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
                  <button
                    key={runs}
                    onClick={() => addRuns(runs)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                      runs === 4 ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' :
                      runs === 6 ? 'bg-red-200 text-red-800 hover:bg-red-300 border border-red-300' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {runs}
                  </button>
                ))}
                <button
                  onClick={addWicket}
                  className="py-3 px-4 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                >
                  W
                </button>
              </div>
            </div>

            {/* Save Match */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save & Publish Match
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMatch;