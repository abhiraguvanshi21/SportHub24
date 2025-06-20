import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, Users, Trophy, Play, 
  Video, VideoOff, Camera, Activity,
  RotateCcw, Square, 
  UserPlus} from 'lucide-react';

const AddMatch = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  type Batsman = {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number | string;
    isOnStrike: boolean;
  };

  type Bowler = {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number | string;
    ballsBowled: number;
  };

  type BallByBall = {
    over: number;
    ball: number;
    runs: number;
    description: string;
    timestamp: string;
    bowler?: string;
    batsman?: string;
    isWicket?: boolean;
  };

  type LiveScoring = {
    isLive: boolean;
    currentInnings: number;
    battingTeam: string;
    bowlingTeam: string;
    currentScore: {
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
      extras: number;
      runRate: number | string;
    };
    currentBatsmen: Batsman[];
    currentBowler: Bowler;
    ballByBall: BallByBall[];
    lastBalls: (number | string)[];
    overHistory: BallByBall[];
    bowlerHistory: Bowler[];
    needNewBatsman: boolean;
    needNewBowler: boolean;
    availableBowlers: string[];
  };

  const [liveScoring, setLiveScoring] = useState<LiveScoring>({
    isLive: false,
    currentInnings: 1,
    battingTeam: '',
    bowlingTeam: '',
    currentScore: {
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: 0,
      runRate: 0.0
    },
    currentBatsmen: [
      { 
        name: '', 
        runs: 0, 
        balls: 0, 
        fours: 0, 
        sixes: 0, 
        strikeRate: 0,
        isOnStrike: true 
      },
      { 
        name: '', 
        runs: 0, 
        balls: 0, 
        fours: 0, 
        sixes: 0, 
        strikeRate: 0,
        isOnStrike: false 
      }
    ],
    currentBowler: { 
      name: '', 
      overs: 0, 
      maidens: 0, 
      runs: 0, 
      wickets: 0, 
      economy: 0,
      ballsBowled: 0
    },
    ballByBall: [],
    lastBalls: [],
    overHistory: [],
    bowlerHistory: [],
    needNewBatsman: false,
    needNewBowler: false,
    availableBowlers: []
  });

  const [videoStream, setVideoStream] = useState({
    isStreaming: false,
    isRecording: false,
    hasVideo: false,
    hasAudio: false,
    viewers: 0,
    quality: 'HD',
    deviceType: 'phone'
  });

  const [streamSettings] = useState({
    videoEnabled: true,
    audioEnabled: true,
    resolution: '1280x720',
    frameRate: 30,
    bitrate: 2500
  });

  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false);
  const [showNewBowlerModal, setShowNewBowlerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Video streaming functions
  const startVideoStream = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: parseInt(streamSettings.resolution.split('x')[0]) },
          height: { ideal: parseInt(streamSettings.resolution.split('x')[1]) },
          frameRate: { ideal: streamSettings.frameRate },
          facingMode: 'environment'
        },
        audio: streamSettings.audioEnabled
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setVideoStream(prev => ({
        ...prev,
        isStreaming: true,
        hasVideo: stream.getVideoTracks().length > 0,
        hasAudio: stream.getAudioTracks().length > 0
      }));

      setInterval(() => {
        setVideoStream(prev => ({
          ...prev,
          viewers: prev.viewers + Math.floor(Math.random() * 3)
        }));
      }, 5000);

    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setVideoStream(prev => ({
      ...prev,
      isStreaming: false,
      isRecording: false,
      hasVideo: false,
      hasAudio: false
    }));
  };

  const toggleRecording = () => {
    setVideoStream(prev => ({
      ...prev,
      isRecording: !prev.isRecording
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setMatchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const updateBatsmanName = (index: number, name: string) => {
    setLiveScoring(prev => ({
      ...prev,
      currentBatsmen: prev.currentBatsmen.map((batsman, i) => 
        i === index ? { ...batsman, name } : batsman
      )
    }));
  };

  const updateBowlerName = (name: string) => {
    setLiveScoring(prev => ({
      ...prev,
      currentBowler: { ...prev.currentBowler, name }
    }));
  };

  const addNewBatsman = () => {
    if (!newPlayerName.trim()) return;
    
    setLiveScoring(prev => {
      const newBatsmen = [...prev.currentBatsmen];
      const outBatsmanIndex = newBatsmen.findIndex(b => !b.isOnStrike);
      
      if (outBatsmanIndex !== -1) {
        newBatsmen[outBatsmanIndex] = {
          name: newPlayerName,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          isOnStrike: false
        };
      }
      
      return {
        ...prev,
        currentBatsmen: newBatsmen,
        needNewBatsman: false
      };
    });
    
    setNewPlayerName('');
    setShowNewBatsmanModal(false);
  };

  const addNewBowler = () => {
    if (!newPlayerName.trim()) return;
    
    setLiveScoring(prev => {
      const newBowlerHistory = [...(prev.bowlerHistory || []), prev.currentBowler];
      const newAvailableBowlers = [...(prev.availableBowlers || []), prev.currentBowler.name].filter(name => name);
      
      return {
        ...prev,
        currentBowler: {
          name: newPlayerName,
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: 0,
          ballsBowled: 0
        },
        bowlerHistory: newBowlerHistory,
        availableBowlers: newAvailableBowlers,
        needNewBowler: false
      };
    });
    
    setNewPlayerName('');
    setShowNewBowlerModal(false);
  };

  const selectExistingBowler = (bowlerName: string) => {
    const existingBowler = liveScoring.bowlerHistory.find(b => b.name === bowlerName);
    if (existingBowler) {
      setLiveScoring(prev => ({
        ...prev,
        currentBowler: { ...existingBowler },
        needNewBowler: false
      }));
    }
    setShowNewBowlerModal(false);
  };

  const addRuns = (runs: number, isExtra = false, extraType = '') => {
    const onStrikeBatsmanIndex = liveScoring.currentBatsmen.findIndex(b => b.isOnStrike);
    
    setLiveScoring(prev => {
      const newScore = { ...prev.currentScore };
      const newBatsmen = [...prev.currentBatsmen];
      const newBowler = { ...prev.currentBowler };
      
      // Update score
      newScore.runs += runs;
      if (isExtra) {
        newScore.extras += runs;
      }
      
      // Update batsman (only if not extra)
      if (!isExtra && onStrikeBatsmanIndex !== -1) {
        newBatsmen[onStrikeBatsmanIndex].runs += runs;
        newBatsmen[onStrikeBatsmanIndex].balls += 1;
        
        // Update boundaries
        if (runs === 4) newBatsmen[onStrikeBatsmanIndex].fours += 1;
        if (runs === 6) newBatsmen[onStrikeBatsmanIndex].sixes += 1;
        
        // Calculate strike rate
        newBatsmen[onStrikeBatsmanIndex].strikeRate = 
          (newBatsmen[onStrikeBatsmanIndex].runs / newBatsmen[onStrikeBatsmanIndex].balls * 100).toFixed(1);
      }
      
      // Update bowler
      newBowler.runs += runs;
      let needNewBowler = false;
      
      if (!isExtra) {
        newBowler.ballsBowled += 1;
        newScore.balls += 1;
        
        // Check if over is complete
        if (newScore.balls % 6 === 0) {
          newScore.overs = Math.floor(newScore.balls / 6);
          // Switch strike at end of over
          newBatsmen.forEach(batsman => {
            batsman.isOnStrike = !batsman.isOnStrike;
          });
          // Need new bowler for next over
          needNewBowler = true;
        } else if (runs % 2 === 1) {
          // Switch strike for odd runs
          newBatsmen.forEach(batsman => {
            batsman.isOnStrike = !batsman.isOnStrike;
          });
        }
      }
      
      // Calculate economy
      const oversBowled = newBowler.ballsBowled / 6;
      newBowler.economy = oversBowled > 0 ? (newBowler.runs / oversBowled).toFixed(2) : 0;
      
      // Calculate run rate
      const oversPlayed = newScore.balls / 6;
      newScore.runRate = oversPlayed > 0 ? (newScore.runs / oversPlayed).toFixed(2) : 0;
      
      // Add to ball-by-ball commentary
      const ballDescription = isExtra 
        ? `${extraType} ${runs} run${runs > 1 ? 's' : ''}`
        : `${runs} run${runs > 1 ? 's' : ''} to ${newBatsmen[onStrikeBatsmanIndex]?.name || 'Batsman'}`;
      
      const newBallByBall = [...(prev.ballByBall || []), {
        over: Math.floor(newScore.balls / 6) + 1,
        ball: (newScore.balls % 6) + 1,
        runs,
        description: ballDescription,
        timestamp: new Date().toLocaleTimeString(),
        bowler: newBowler.name,
        batsman: newBatsmen[onStrikeBatsmanIndex]?.name || ''
      }];
      
      return {
        ...prev,
        currentScore: newScore,
        currentBatsmen: newBatsmen,
        currentBowler: newBowler,
        ballByBall: newBallByBall,
        lastBalls: [...(prev.lastBalls || []).slice(-5), runs],
        needNewBowler
      };
    });
  };

  const addWicket = (wicketType = 'bowled') => {
    setLiveScoring(prev => {
      const newScore = { ...prev.currentScore };
      const newBowler = { ...prev.currentBowler };
      
      newScore.wickets += 1;
      newScore.balls += 1;
      newBowler.wickets += 1;
      newBowler.ballsBowled += 1;
      
      let needNewBowler = false;
      
      // Check if over is complete
      if (newScore.balls % 6 === 0) {
        newScore.overs = Math.floor(newScore.balls / 6);
        needNewBowler = true;
      }
      
      // Calculate economy
      const oversBowled = newBowler.ballsBowled / 6;
      newBowler.economy = oversBowled > 0 ? (newBowler.runs / oversBowled).toFixed(2) : 0;
      
      // Add to ball-by-ball commentary
      const newBallByBall = [...(prev.ballByBall || []), {
        over: Math.floor(newScore.balls / 6) + 1,
        ball: (newScore.balls % 6) + 1,
        runs: 0,
        description: `WICKET! ${wicketType}`,
        timestamp: new Date().toLocaleTimeString(),
        isWicket: true,
        bowler: newBowler.name
      }];
      
      return {
        ...prev,
        currentScore: newScore,
        currentBowler: newBowler,
        ballByBall: newBallByBall,
        lastBalls: [...(prev.lastBalls || []).slice(-5), 'W'],
        needNewBatsman: true,
        needNewBowler
      };
    });
    
    setShowNewBatsmanModal(true);
  };

  const switchStrike = () => {
    setLiveScoring(prev => ({
      ...prev,
      currentBatsmen: prev.currentBatsmen.map(batsman => ({
        ...batsman,
        isOnStrike: !batsman.isOnStrike
      }))
    }));
  };

  const publishMatch = () => {
    // Create match object for publishing
    const publishedMatch = {
      id: Date.now(),
      ...matchData,
      ...liveScoring,
      publishedAt: new Date().toISOString(),
      status: liveScoring.isLive ? 'Live' : 'Completed',
      viewers: videoStream.viewers
    };

    // Store in localStorage (in real app, this would be sent to backend)
    const existingMatches = JSON.parse(localStorage.getItem('userMatches') || '[]');
    existingMatches.push(publishedMatch);
    localStorage.setItem('userMatches', JSON.stringify(existingMatches));

    alert('Match published successfully!');
    navigate('/user-scoring');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    publishMatch();
  };

  const startLiveScoring = () => {
    setLiveScoring(prev => ({
      ...prev,
      isLive: true,
      battingTeam: matchData.team1,
      bowlingTeam: matchData.team2,
      currentScore: {
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        runRate: 0.0
      }
    }));
    setCurrentStep(3);
  };

  useEffect(() => {
    if (liveScoring.needNewBowler && liveScoring.currentScore.balls % 6 === 0) {
      setShowNewBowlerModal(true);
    }
  }, [liveScoring.needNewBowler, liveScoring.currentScore.balls]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Add Your Match</h1>
          <p className="text-xl text-red-100">Create and score your cricket match live with video streaming</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={matchData.venue}
                    onChange={handleInputChange}
                    placeholder="Match venue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={matchData.date}
                    onChange={handleInputChange}
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
                <h3 className="text-lg font-semibold text-red-900 mb-3">Live Streaming Guidelines</h3>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• Position camera to capture the entire field</li>
                  <li>• Ensure stable internet connection for smooth streaming</li>
                  <li>• Test audio levels before starting</li>
                  <li>• Keep device charged or connected to power</li>
                  <li>• Provide clear ball-by-ball commentary</li>
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    Live Scoring
                  </div>
                  {videoStream.isStreaming && (
                    <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Video className="w-3 h-3 mr-1" />
                      {videoStream.viewers} viewers
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600">{matchData.venue} • {matchData.date}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Video Stream */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Live Video Stream</h3>
                    <div className="flex items-center space-x-2">
                      {!videoStream.isStreaming ? (
                        <button
                          onClick={startVideoStream}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Start Stream
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={toggleRecording}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                              videoStream.isRecording 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {videoStream.isRecording ? <Square className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                            {videoStream.isRecording ? 'Stop Recording' : 'Record'}
                          </button>
                          <button
                            onClick={stopVideoStream}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                          >
                            <VideoOff className="h-4 w-4 mr-2" />
                            Stop Stream
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {!videoStream.isStreaming && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center text-white">
                          <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Click "Start Stream" to begin live video</p>
                          <p className="text-sm opacity-75">Connect your phone camera or DSLR</p>
                        </div>
                      </div>
                    )}
                    {videoStream.isStreaming && (
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </div>
                        {videoStream.isRecording && (
                          <div className="bg-red-800 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            REC
                          </div>
                        )}
                      </div>
                    )}
                    {videoStream.isStreaming && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {videoStream.viewers} viewers
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scoring Panel */}
              <div className="space-y-6">
                {/* Current Score */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Score</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {liveScoring.currentScore.runs}/{liveScoring.currentScore.wickets}
                    </div>
                    <div className="text-gray-600 mb-2">
                      {Math.floor(liveScoring.currentScore.balls / 6)}.{liveScoring.currentScore.balls % 6} overs
                    </div>
                    <div className="text-sm text-gray-500">
                      RR: {liveScoring.currentScore.runRate} | Extras: {liveScoring.currentScore.extras}
                    </div>
                  </div>
                </div>

                {/* Last 6 Balls */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">This Over</h3>
                  <div className="flex space-x-2 justify-center">
                    {Array.from({ length: 6 }, (_, index) => {
                      const ballIndex = (liveScoring.currentScore.balls % 6) - 6 + index + 1;
                      const ball = ballIndex >= 0 ? (liveScoring.lastBalls || [])[ballIndex] : null;
                      return (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                            ball === 'W' 
                              ? 'bg-red-600 text-white border-red-600' 
                              : typeof ball === 'number' && ball >= 4 
                              ? 'bg-red-100 text-red-700 border-red-300' 
                              : ball !== null
                              ? 'bg-gray-100 text-gray-700 border-gray-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {ball !== null ? ball : ''}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Over {Math.floor(liveScoring.currentScore.balls / 6) + 1}
                  </div>
                </div>
              </div>
            </div>

            {/* Batsmen Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Batsmen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveScoring.currentBatsmen.map((batsman, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    batsman.isOnStrike ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        placeholder={`Batsman ${index + 1} name`}
                        value={batsman.name}
                        onChange={(e) => updateBatsmanName(index, e.target.value)}
                        className="font-medium text-gray-900 bg-transparent border-none focus:outline-none flex-1"
                      />
                      {batsman.isOnStrike && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          On Strike
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-red-600">{batsman.runs}</div>
                        <div className="text-xs text-gray-600">Runs</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-700">{batsman.balls}</div>
                        <div className="text-xs text-gray-600">Balls</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-500">{batsman.fours}</div>
                        <div className="text-xs text-gray-600">4s</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-700">{batsman.sixes}</div>
                        <div className="text-xs text-gray-600">6s</div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-600">
                        SR: {batsman.strikeRate || '0.0'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={switchStrike}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Switch Strike
                </button>
              </div>
            </div>

            {/* Bowler Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Bowler</h3>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <input
                  type="text"
                  placeholder="Bowler name"
                  value={liveScoring.currentBowler.name}
                  onChange={(e) => updateBowlerName(e.target.value)}
                  className="font-medium text-gray-900 bg-transparent border-none focus:outline-none w-full mb-3"
                />
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-600">{Math.floor(liveScoring.currentBowler.ballsBowled / 6)}.{liveScoring.currentBowler.ballsBowled % 6}</div>
                    <div className="text-xs text-gray-600">Overs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-700">{liveScoring.currentBowler.maidens}</div>
                    <div className="text-xs text-gray-600">Maidens</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-500">{liveScoring.currentBowler.runs}</div>
                    <div className="text-xs text-gray-600">Runs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-700">{liveScoring.currentBowler.wickets}</div>
                    <div className="text-xs text-gray-600">Wickets</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-600">{liveScoring.currentBowler.economy}</div>
                    <div className="text-xs text-gray-600">Economy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Scoring Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Scoring</h3>
              
              {/* Runs */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Runs</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
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
                    onClick={() => addWicket()}
                    className="py-3 px-4 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    W
                  </button>
                </div>
              </div>

              {/* Extras */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Extras</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => addRuns(1, true, 'Wide')}
                    className="py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                  >
                    Wide
                  </button>
                  <button
                    onClick={() => addRuns(1, true, 'No Ball')}
                    className="py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                  >
                    No Ball
                  </button>
                  <button
                    onClick={() => addRuns(1, true, 'Bye')}
                    className="py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                  >
                    Bye
                  </button>
                  <button
                    onClick={() => addRuns(1, true, 'Leg Bye')}
                    className="py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                  >
                    Leg Bye
                  </button>
                </div>
              </div>

              {/* Wicket Types */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Wicket Types</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map((wicketType) => (
                    <button
                      key={wicketType}
                      onClick={() => addWicket(wicketType.toLowerCase())}
                      className="py-2 px-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                    >
                      {wicketType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ball by Ball Commentary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ball by Ball Commentary</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {(liveScoring.ballByBall || []).slice(-10).reverse().map((ball, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    ball.isWicket ? 'bg-red-100 border border-red-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-gray-900">
                          {ball.over}.{ball.ball}: {ball.description}
                        </span>
                        {ball.bowler && (
                          <div className="text-xs text-gray-600 mt-1">
                            Bowler: {ball.bowler} {ball.batsman && `• Batsman: ${ball.batsman}`}
                          </div>
                        )}
                        {ball.isWicket && (
                          <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                            WICKET
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{ball.timestamp}</span>
                    </div>
                  </div>
                ))}
                {(!liveScoring.ballByBall || liveScoring.ballByBall.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Ball by ball commentary will appear here</p>
                  </div>
                )}
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

      {/* New Batsman Modal */}
      {showNewBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Batsman</h3>
            <p className="text-gray-600 mb-4">A wicket has fallen. Please add the new batsman.</p>
            <input
              type="text"
              placeholder="Enter batsman name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={addNewBatsman}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Batsman
              </button>
              <button
                onClick={() => {
                  setShowNewBatsmanModal(false);
                  setNewPlayerName('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Bowler Modal */}
      {showNewBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Bowler</h3>
            <p className="text-gray-600 mb-4">Over completed. Please select the next bowler.</p>
            
            {/* Previous Bowlers */}
            {liveScoring.availableBowlers && liveScoring.availableBowlers.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Bowlers:</h4>
                <div className="space-y-2">
                  {liveScoring.availableBowlers.map((bowlerName, index) => (
                    <button
                      key={index}
                      onClick={() => selectExistingBowler(bowlerName)}
                      className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {bowlerName}
                    </button>
                  ))}
                </div>
                <div className="my-4 text-center text-gray-500">or</div>
              </div>
            )}
            
            {/* New Bowler */}
            <input
              type="text"
              placeholder="Enter new bowler name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={addNewBowler}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Bowler
              </button>
              <button
                onClick={() => {
                  setShowNewBowlerModal(false);
                  setNewPlayerName('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMatch;