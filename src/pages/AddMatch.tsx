import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, MapPin, Calendar, Clock, Trophy, 
  ArrowRight, ArrowLeft, Check, Crown, Coins,
  User, Target, Activity, ChevronDown, X, AlertTriangle
} from 'lucide-react';

interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
}

interface Team {
  name: string;
  players: Player[];
}

interface TossResult {
  winner: string;
  decision: 'bat' | 'bowl';
}

interface MatchData {
  title: string;
  team1: string;
  team2: string;
  venue: string;
  format: string;
  date: string;
  time: string;
  scorerName: string;
  teams: {
    team1: Team;
    team2: Team;
  };
  toss?: TossResult;
  battingTeam?: string;
  bowlingTeam?: string;
}

interface BallByBallEntry {
  over: number;
  ball: number | string;
  runs: number;
  description: string;
  timestamp: string;
  isWicket?: boolean;
  wicketType?: string;
  fielder?: string;
  isExtra?: boolean;
  extraType?: string;
  bowler: string;
  batsman: string;
}

type LastBallEntry = number | 'W' | 'Wd' | 'Nb';

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: string;
  isOnStrike: boolean;
}

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: string;
  ballsBowled: number;
}

interface Score {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  runRate: string;
  extras: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
}

const AddMatch = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showTossModal, setShowTossModal] = useState<boolean>(false);
  const [selectedTossWinner, setSelectedTossWinner] = useState<string>('');
  const [selectedTossDecision, setSelectedTossDecision] = useState<string>('');
  const [showWicketModal, setShowWicketModal] = useState<boolean>(false);
  const [showExtraModal, setShowExtraModal] = useState<boolean>(false);
  
  const [matchData, setMatchData] = useState<MatchData>({
    title: '',
    team1: '',
    team2: '',
    venue: '',
    format: 'T20',
    date: '',
    time: '',
    scorerName: user?.name || '',
    teams: {
      team1: {
        name: '',
        players: Array(12).fill(null).map(() => ({ name: '', role: 'Batsman' as const }))
      },
      team2: {
        name: '',
        players: Array(12).fill(null).map(() => ({ name: '', role: 'Batsman' as const }))
      }
    }
  });

  const [currentBatsmen, setCurrentBatsmen] = useState<Batsman[]>([
    { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.00', isOnStrike: true },
    { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.00', isOnStrike: false }
  ]);

  const [currentBowler, setCurrentBowler] = useState<Bowler>({
    name: '',
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
    economy: '0.00',
    ballsBowled: 0
  });

  const [currentScore, setCurrentScore] = useState<Score>({
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    runRate: '0.00',
    extras: 0,
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0
  });

  const [ballByBall, setBallByBall] = useState<BallByBallEntry[]>([]);
  const [lastBalls, setLastBalls] = useState<LastBallEntry[]>([]);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [playerModalType, setPlayerModalType] = useState<string>('');
  const [playerModalIndex, setPlayerModalIndex] = useState<number>(0);

  // Wicket types
  const wicketTypes = [
    { id: 'bowled', label: 'Bowled', description: 'Bowled by the bowler' },
    { id: 'caught', label: 'Caught', description: 'Caught by a fielder' },
    { id: 'lbw', label: 'LBW', description: 'Leg Before Wicket' },
    { id: 'stumped', label: 'Stumped', description: 'Stumped by wicket-keeper' },
    { id: 'runout', label: 'Run Out', description: 'Run out by fielders' },
    { id: 'hitwicket', label: 'Hit Wicket', description: 'Hit wicket while playing' },
    { id: 'obstructing', label: 'Obstructing Field', description: 'Obstructing the field' },
    { id: 'handledball', label: 'Handled Ball', description: 'Handled the ball illegally' },
    { id: 'timeout', label: 'Timed Out', description: 'Timed out' }
  ];

  // Extra types
  const extraTypes = [
    { id: 'wide', label: 'Wide', description: 'Wide ball - 1 run + any runs taken', addsBall: false },
    { id: 'noball', label: 'No Ball', description: 'No ball - 1 run + any runs taken', addsBall: false },
    { id: 'bye', label: 'Bye', description: 'Runs taken without hitting the ball', addsBall: true },
    { id: 'legbye', label: 'Leg Bye', description: 'Runs taken off the body/pad', addsBall: true }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMatchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamNameChange = (team: 'team1' | 'team2', value: string) => {
    setMatchData(prev => ({
      ...prev,
      [team]: value,
      teams: {
        ...prev.teams,
        [team]: {
          ...prev.teams[team],
          name: value
        }
      }
    }));
  };

  const handlePlayerChange = (team: 'team1' | 'team2', playerIndex: number, field: 'name' | 'role', value: string) => {
    setMatchData(prev => ({
      ...prev,
      teams: {
        ...prev.teams,
        [team]: {
          ...prev.teams[team],
          players: prev.teams[team].players.map((player, index) =>
            index === playerIndex ? { ...player, [field]: value } : player
          )
        }
      }
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return matchData.title && matchData.team1 && matchData.team2 && 
               matchData.venue && matchData.date && matchData.time;
      case 2:
        return matchData.teams.team1.players.every(p => p.name.trim()) &&
               matchData.teams.team2.players.every(p => p.name.trim());
      case 3:
        return matchData.toss && matchData.battingTeam && matchData.bowlingTeam;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleConductToss = () => {
    setShowTossModal(true);
    setSelectedTossWinner('');
    setSelectedTossDecision('');
  };

  const handleTossSubmit = () => {
    if (!selectedTossWinner || !selectedTossDecision) {
      alert('Please select both toss winner and decision');
      return;
    }

    const tossResult: TossResult = {
      winner: selectedTossWinner,
      decision: selectedTossDecision as 'bat' | 'bowl'
    };

    const battingTeam = selectedTossDecision === 'bat' ? selectedTossWinner : 
                       (selectedTossWinner === matchData.team1 ? matchData.team2 : matchData.team1);
    const bowlingTeam = selectedTossDecision === 'bowl' ? selectedTossWinner : 
                       (selectedTossWinner === matchData.team1 ? matchData.team2 : matchData.team1);

    setMatchData(prev => ({
      ...prev,
      toss: tossResult,
      battingTeam,
      bowlingTeam
    }));

    setShowTossModal(false);
  };

  const openPlayerModal = (type: string, index: number = 0) => {
    setPlayerModalType(type);
    setPlayerModalIndex(index);
    setShowPlayerModal(true);
  };

  const selectPlayer = (playerName: string) => {
    if (playerModalType === 'batsman') {
      setCurrentBatsmen(prev => prev.map((batsman, index) =>
        index === playerModalIndex ? { ...batsman, name: playerName } : batsman
      ));
    } else if (playerModalType === 'bowler') {
      setCurrentBowler(prev => ({ ...prev, name: playerName }));
    }
    setShowPlayerModal(false);
  };

  const addRuns = (runs: number, isExtra: boolean = false) => {
    const newScore = { ...currentScore };
    const newBatsmen = [...currentBatsmen];
    const newBowler = { ...currentBowler };

    // Add runs to score
    newScore.runs += runs;
    if (isExtra) {
      newScore.extras += runs;
    } else {
      // Add runs to striker
      const strikerIndex = newBatsmen.findIndex(b => b.isOnStrike);
      if (strikerIndex !== -1) {
        newBatsmen[strikerIndex].runs += runs;
        newBatsmen[strikerIndex].balls += 1;
        newBatsmen[strikerIndex].strikeRate = 
          ((newBatsmen[strikerIndex].runs / newBatsmen[strikerIndex].balls) * 100).toFixed(2);
        
        if (runs === 4) newBatsmen[strikerIndex].fours += 1;
        if (runs === 6) newBatsmen[strikerIndex].sixes += 1;
      }
      
      // Increment ball count
      newScore.balls += 1;
      newBowler.ballsBowled += 1;
    }

    // Add runs to bowler
    newBowler.runs += runs;
    if (newBowler.ballsBowled > 0) {
      const overs = Math.floor(newBowler.ballsBowled / 6);
      const balls = newBowler.ballsBowled % 6;
      newBowler.overs = overs;
      const totalOvers = overs + (balls / 6);
      newBowler.economy = totalOvers > 0 ? (newBowler.runs / totalOvers).toFixed(2) : '0.00';
    }

    // Calculate over and run rate
    newScore.overs = Math.floor(newScore.balls / 6);
    const totalOvers = newScore.overs + ((newScore.balls % 6) / 6);
    newScore.runRate = totalOvers > 0 ? (newScore.runs / totalOvers).toFixed(2) : '0.00';

    // Add to ball by ball
    const ballDescription = `${runs} run${runs !== 1 ? 's' : ''} to ${newBatsmen.find(b => b.isOnStrike)?.name || 'Batsman'}`;
    const newBall = {
      over: Math.floor(newScore.balls / 6) + 1,
      ball: (newScore.balls % 6) || 6,
      runs,
      description: ballDescription,
      timestamp: new Date().toISOString(),
      bowler: newBowler.name,
      batsman: newBatsmen.find(b => b.isOnStrike)?.name || 'Batsman'
    };

    const newBallByBall = [...ballByBall, newBall];
    const newLastBalls = [...lastBalls];
    
    if (newLastBalls.length >= 6) {
      newLastBalls.shift();
    }
    newLastBalls.push(runs);

    // Change strike on odd runs
    if (runs % 2 === 1) {
      newBatsmen.forEach(batsman => {
        batsman.isOnStrike = !batsman.isOnStrike;
      });
    }

    // Update state
    setCurrentScore(newScore);
    setCurrentBatsmen(newBatsmen);
    setCurrentBowler(newBowler);
    setBallByBall(newBallByBall);
    setLastBalls(newLastBalls);

    // Save to localStorage
    saveMatchData(newScore, newBatsmen, newBowler, newBallByBall, newLastBalls);
  };

  const addWicket = (wicketType: string, fielder?: string) => {
    const newScore = { ...currentScore };
    const newBowler = { ...currentBowler };

    newScore.wickets += 1;
    newScore.balls += 1;
    newBowler.ballsBowled += 1;
    newBowler.wickets += 1;

    // Calculate over and run rate
    newScore.overs = Math.floor(newScore.balls / 6);
    const totalOvers = newScore.overs + ((newScore.balls % 6) / 6);
    newScore.runRate = totalOvers > 0 ? (newScore.runs / totalOvers).toFixed(2) : '0.00';

    // Update bowler economy
    if (newBowler.ballsBowled > 0) {
      const overs = Math.floor(newBowler.ballsBowled / 6);
      const balls = newBowler.ballsBowled % 6;
      newBowler.overs = overs;
      const totalOvers = overs + (balls / 6);
      newBowler.economy = totalOvers > 0 ? (newBowler.runs / totalOvers).toFixed(2) : '0.00';
    }

    // Add to ball by ball
    const outBatsman = currentBatsmen.find(b => b.isOnStrike);
    let ballDescription = `WICKET! ${outBatsman?.name || 'Batsman'} `;
    
    switch (wicketType) {
      case 'bowled':
        ballDescription += `bowled by ${newBowler.name}`;
        break;
      case 'caught':
        ballDescription += `caught ${fielder ? `by ${fielder}` : ''} bowled by ${newBowler.name}`;
        break;
      case 'lbw':
        ballDescription += `LBW bowled by ${newBowler.name}`;
        break;
      case 'stumped':
        ballDescription += `stumped ${fielder ? `by ${fielder}` : ''} bowled by ${newBowler.name}`;
        break;
      case 'runout':
        ballDescription += `run out ${fielder ? `by ${fielder}` : ''}`;
        break;
      case 'hitwicket':
        ballDescription += `hit wicket bowled by ${newBowler.name}`;
        break;
      default:
        ballDescription += `out (${wicketType})`;
    }

    const newBall = {
      over: Math.floor(newScore.balls / 6) + 1,
      ball: (newScore.balls % 6) || 6,
      runs: 0,
      description: ballDescription,
      timestamp: new Date().toISOString(),
      isWicket: true,
      wicketType,
      fielder,
      bowler: newBowler.name,
      batsman: outBatsman?.name || 'Batsman'
    };

    const newBallByBall = [...ballByBall, newBall];
    const newLastBalls = [...lastBalls];
    
    if (newLastBalls.length >= 6) {
      newLastBalls.shift();
    }
    newLastBalls.push('W');

    // Reset out batsman
    const newBatsmen = currentBatsmen.map(batsman =>
      batsman.isOnStrike 
        ? { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.00', isOnStrike: true }
        : batsman
    );

    // Update state
    setCurrentScore(newScore);
    setCurrentBatsmen(newBatsmen);
    setCurrentBowler(newBowler);
    setBallByBall(newBallByBall);
    setLastBalls(newLastBalls);

    // Save to localStorage
    saveMatchData(newScore, newBatsmen, newBowler, newBallByBall, newLastBalls);
    setShowWicketModal(false);
  };

  const addExtra = (extraType: string, runs: number = 1) => {
    const newScore = { ...currentScore };
    const newBatsmen = [...currentBatsmen];
    const newBowler = { ...currentBowler };

    // Add runs to score
    newScore.runs += runs;
    newScore.extras += runs;

    // Update specific extra counts
    switch (extraType) {
      case 'wide':
        newScore.wides += runs;
        break;
      case 'noball':
        newScore.noBalls += runs;
        break;
      case 'bye':
        newScore.byes += runs;
        break;
      case 'legbye':
        newScore.legByes += runs;
        break;
    }

    // Add runs to bowler (except for byes and leg byes)
    if (extraType !== 'bye' && extraType !== 'legbye') {
      newBowler.runs += runs;
    }

    // Only add ball count for byes and leg byes
    const extraInfo = extraTypes.find(e => e.id === extraType);
    if (extraInfo?.addsBall) {
      newScore.balls += 1;
      newBowler.ballsBowled += 1;
      
      // Add to striker's ball count for byes and leg byes
      const strikerIndex = newBatsmen.findIndex(b => b.isOnStrike);
      if (strikerIndex !== -1) {
        newBatsmen[strikerIndex].balls += 1;
        newBatsmen[strikerIndex].strikeRate = 
          ((newBatsmen[strikerIndex].runs / newBatsmen[strikerIndex].balls) * 100).toFixed(2);
      }
    }

    // Update bowler economy
    if (newBowler.ballsBowled > 0) {
      const overs = Math.floor(newBowler.ballsBowled / 6);
      const balls = newBowler.ballsBowled % 6;
      newBowler.overs = overs;
      const totalOvers = overs + (balls / 6);
      newBowler.economy = totalOvers > 0 ? (newBowler.runs / totalOvers).toFixed(2) : '0.00';
    }

    // Calculate over and run rate
    newScore.overs = Math.floor(newScore.balls / 6);
    const totalOvers = newScore.overs + ((newScore.balls % 6) / 6);
    newScore.runRate = totalOvers > 0 ? (newScore.runs / totalOvers).toFixed(2) : '0.00';

    // Add to ball by ball
    const ballDescription = `${extraType.toUpperCase()}: ${runs} run${runs !== 1 ? 's' : ''}`;
    const newBall = {
      over: Math.floor(newScore.balls / 6) + 1,
      ball: extraInfo?.addsBall ? ((newScore.balls % 6) || 6) : 'Extra',
      runs,
      description: ballDescription,
      timestamp: new Date().toISOString(),
      isExtra: true,
      extraType,
      bowler: newBowler.name,
      batsman: newBatsmen.find(b => b.isOnStrike)?.name || 'Batsman'
    };

    const newBallByBall = [...ballByBall, newBall];
    const newLastBalls = [...lastBalls];
    
    if (newLastBalls.length >= 6) {
      newLastBalls.shift();
    }
    newLastBalls.push(extraType === 'wide' ? 'Wd' : extraType === 'noball' ? 'Nb' : runs);

    // Change strike on odd runs
    if (runs % 2 === 1) {
      newBatsmen.forEach(batsman => {
        batsman.isOnStrike = !batsman.isOnStrike;
      });
    }

    // Update state
    setCurrentScore(newScore);
    setCurrentBatsmen(newBatsmen);
    setCurrentBowler(newBowler);
    setBallByBall(newBallByBall);
    setLastBalls(newLastBalls);

    // Save to localStorage
    saveMatchData(newScore, newBatsmen, newBowler, newBallByBall, newLastBalls);
    setShowExtraModal(false);
  };

const saveMatchData = (
  score: Score,
  batsmen: Batsman[],
  bowler: Bowler,
  ballByBallData: BallByBallEntry[],
  lastBallsData: LastBallEntry[]
) => {
  const completeMatchData = {
    ...matchData,
    id: Date.now(),
    isLive: true,
    status: 'Live',
    hasLiveStream: true,
    viewers: Math.floor(Math.random() * 500) + 50,
    publishedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    currentScore: score,
    currentBatsmen: batsmen,
    currentBowler: bowler,
    ballByBall: ballByBallData,
    lastBalls: lastBallsData
  };

  // Get existing matches
  const existingMatches = JSON.parse(localStorage.getItem('userMatches') || '[]');
  
  // Find if this match already exists
  const matchIndex = existingMatches.findIndex((match: { id: number }) => match.id === completeMatchData.id);
  
  
  if (matchIndex !== -1) {
    // Update existing match
    existingMatches[matchIndex] = completeMatchData;
  } else {
    // Add new match
    existingMatches.push(completeMatchData);
  }

  // Save to localStorage
  localStorage.setItem('userMatches', JSON.stringify(existingMatches));

  // Trigger storage event for real-time updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'userMatches',
    newValue: JSON.stringify(existingMatches)
  }));
};

  const startMatch = () => {
    if (!validateStep(3)) {
      alert('Please complete the toss first');
      return;
    }

    // Initialize match with basic data
    const initialMatchData = {
      ...matchData,
      id: Date.now(),
      isLive: true,
      status: 'Live',
      hasLiveStream: true,
      viewers: Math.floor(Math.random() * 500) + 50,
      publishedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentScore,
      currentBatsmen,
      currentBowler,
      ballByBall,
      lastBalls
    };

    // Save initial match data
    const existingMatches = JSON.parse(localStorage.getItem('userMatches') || '[]');
    existingMatches.push(initialMatchData);
    localStorage.setItem('userMatches', JSON.stringify(existingMatches));

    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userMatches',
      newValue: JSON.stringify(existingMatches)
    }));

    setCurrentStep(4);
  };

  const getAvailablePlayers = (team: 'batting' | 'bowling') => {
    if (team === 'batting') {
      return matchData.battingTeam === matchData.team1 
        ? matchData.teams.team1.players 
        : matchData.teams.team2.players;
    } else {
      return matchData.bowlingTeam === matchData.team1 
        ? matchData.teams.team1.players 
        : matchData.teams.team2.players;
    }
  };

  const steps = [
    { number: 1, title: 'Match Details', description: 'Basic match information' },
    { number: 2, title: 'Team Setup', description: 'Add 12 players for each team' },
    { number: 3, title: 'Toss & Teams', description: 'Conduct toss and set batting order' },
    { number: 4, title: 'Live Scoring', description: 'Start scoring the match' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to add a match</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentStep === 4 ? 'Live Match Scoring' : 'Create New Match'}
          </h1>
          <p className="text-lg text-gray-600">
            {currentStep === 4 
              ? 'Score your match live with real-time updates'
              : 'Set up your cricket match with teams, players, and toss'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                  currentStep >= step.number
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number ? 'bg-red-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          {/* Step 1: Match Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={matchData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Local Club Championship Final"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team 1 Name *
                  </label>
                  <input
                    type="text"
                    name="team1"
                    value={matchData.team1}
                    onChange={(e) => handleTeamNameChange('team1', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter team 1 name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team 2 Name *
                  </label>
                  <input
                    type="text"
                    name="team2"
                    value={matchData.team2}
                    onChange={(e) => handleTeamNameChange('team2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter team 2 name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="venue"
                      value={matchData.venue}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Match venue"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format *
                  </label>
                  <select
                    name="format"
                    value={matchData.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="T20">T20 (20 overs)</option>
                    <option value="ODI">ODI (50 overs)</option>
                    <option value="Test">Test Match</option>
                    <option value="T10">T10 (10 overs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      name="date"
                      value={matchData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="time"
                      name="time"
                      value={matchData.time}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scorer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="scorerName"
                    value={matchData.scorerName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Team Setup */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Add 12 Players for Each Team</h3>
                <p className="text-gray-600">Enter player names and select their primary roles</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {matchData.team1 || 'Team 1'} Players
                  </h4>
                  <div className="space-y-3">
                    {matchData.teams.team1.players.map((player, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => handlePlayerChange('team1', index, 'name', e.target.value)}
                          className="px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={`Player ${index + 1} name`}
                        />
                        <select
                          value={player.role}
                          onChange={(e) => handlePlayerChange('team1', index, 'role', e.target.value)}
                          className="px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="All-rounder">All-rounder</option>
                          <option value="Wicket-keeper">Wicket-keeper</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {matchData.team2 || 'Team 2'} Players
                  </h4>
                  <div className="space-y-3">
                    {matchData.teams.team2.players.map((player, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => handlePlayerChange('team2', index, 'name', e.target.value)}
                          className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Player ${index + 1} name`}
                        />
                        <select
                          value={player.role}
                          onChange={(e) => handlePlayerChange('team2', index, 'role', e.target.value)}
                          className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Batsman">Batsman</option>
                          <option value="Bowler">Bowler</option>
                          <option value="All-rounder">All-rounder</option>
                          <option value="Wicket-keeper">Wicket-keeper</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Toss & Teams */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Conduct Toss & Set Batting Order</h3>
                <p className="text-gray-600">Determine which team bats first</p>
              </div>

              {!matchData.toss ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-red-100 to-blue-100 p-8 rounded-xl border border-gray-200 mb-6">
                    <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready for Toss</h4>
                    <p className="text-gray-600 mb-6">Click the button below to conduct the toss</p>
                    <button
                      onClick={handleConductToss}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center mx-auto"
                    >
                      <Coins className="h-5 w-5 mr-2" />
                      Conduct Toss
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="text-center">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Toss Result</h4>
                    <p className="text-green-700 mb-4">
                      <strong>{matchData.toss.winner}</strong> won the toss and chose to <strong>{matchData.toss.decision}</strong> first
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-2">Batting Team</h5>
                        <p className="text-red-700">{matchData.battingTeam}</p>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">Bowling Team</h5>
                        <p className="text-blue-700">{matchData.bowlingTeam}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Live Scoring */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Current Score Display */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{matchData.battingTeam} vs {matchData.bowlingTeam}</h3>
                  <div className="text-4xl font-bold mb-2">
                    {currentScore.runs}/{currentScore.wickets}
                  </div>
                  <div className="text-red-100 mb-2">
                    ({Math.floor(currentScore.balls / 6)}.{currentScore.balls % 6} overs) • RR: {currentScore.runRate}
                  </div>
                  <div className="text-sm text-red-200">
                    Extras: {currentScore.extras} (W:{currentScore.wides}, NB:{currentScore.noBalls}, B:{currentScore.byes}, LB:{currentScore.legByes})
                  </div>
                </div>
              </div>

              {/* Current Players */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batsmen */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Current Batsmen
                  </h4>
                  <div className="space-y-3">
                    {currentBatsmen.map((batsman, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        batsman.isOnStrike ? 'bg-red-100 border-red-300' : 'bg-white border-red-200'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <button
                            onClick={() => openPlayerModal('batsman', index)}
                            className="text-left font-medium text-red-800 hover:text-red-600 flex items-center"
                          >
                            {batsman.name || `Select Batsman ${index + 1}`}
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </button>
                          {batsman.isOnStrike && (
                            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">*</span>
                          )}
                        </div>
                        <div className="text-sm text-red-600">
                          {batsman.runs}({batsman.balls}) • 4s: {batsman.fours} • 6s: {batsman.sixes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bowler */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Current Bowler
                  </h4>
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <button
                      onClick={() => openPlayerModal('bowler')}
                      className="text-left font-medium text-blue-800 hover:text-blue-600 flex items-center mb-2"
                    >
                      {currentBowler.name || 'Select Bowler'}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                    <div className="text-sm text-blue-600">
                      {Math.floor(currentBowler.ballsBowled / 6)}.{currentBowler.ballsBowled % 6} overs • 
                      {currentBowler.runs}/{currentBowler.wickets} • 
                      Econ: {currentBowler.economy}
                    </div>
                  </div>
                </div>
              </div>

              {/* This Over */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">This Over</h4>
                <div className="flex space-x-2 mb-4">
                  {Array.from({ length: 6 }, (_, index) => {
                    const ball = lastBalls[index];
                    return (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          ball === 'W' 
                            ? 'bg-red-600 text-white border-red-600' 
                            : ball === 'Wd' || ball === 'Nb'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : typeof ball === 'number' && ball >= 4 
                            ? 'bg-red-100 text-red-700 border-red-300' 
                            : ball !== undefined
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {ball !== undefined ? ball : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scoring Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <button
                  onClick={() => addRuns(0)}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  0
                </button>
                <button
                  onClick={() => addRuns(1)}
                  className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                >
                  1
                </button>
                <button
                  onClick={() => addRuns(2)}
                  className="bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                >
                  2
                </button>
                <button
                  onClick={() => addRuns(3)}
                  className="bg-yellow-100 text-yellow-700 py-3 px-4 rounded-lg font-semibold hover:bg-yellow-200 transition-colors"
                >
                  3
                </button>
                <button
                  onClick={() => addRuns(4)}
                  className="bg-orange-100 text-orange-700 py-3 px-4 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
                >
                  4
                </button>
                <button
                  onClick={() => addRuns(6)}
                  className="bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                >
                  6
                </button>
                <button
                  onClick={() => setShowWicketModal(true)}
                  className="bg-red-100 text-red-700 py-3 px-4 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Wicket
                </button>
                <button
                  onClick={() => setShowExtraModal(true)}
                  className="bg-yellow-100 text-yellow-700 py-3 px-4 rounded-lg font-semibold hover:bg-yellow-200 transition-colors"
                >
                  Extra
                </button>
              </div>

              {/* Ball by Ball Commentary */}
              {ballByBall.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Live Commentary</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {ballByBall.slice(-10).reverse().map((ball, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        ball.isWicket ? 'bg-red-50 border border-red-200' : 
                        ball.isExtra ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {ball.over}.{ball.ball}: {ball.description}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(ball.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
            
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={startMatch}
                disabled={!validateStep(3)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Start Match
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toss Modal */}
      {showTossModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Conduct Toss</h3>
              <p className="text-gray-600">Select the toss winner and their decision</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Toss Winner *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tossWinner"
                      value={matchData.team1}
                      checked={selectedTossWinner === matchData.team1}
                      onChange={(e) => setSelectedTossWinner(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{matchData.team1}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tossWinner"
                      value={matchData.team2}
                      checked={selectedTossWinner === matchData.team2}
                      onChange={(e) => setSelectedTossWinner(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{matchData.team2}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Toss Decision *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tossDecision"
                      value="bat"
                      checked={selectedTossDecision === 'bat'}
                      onChange={(e) => setSelectedTossDecision(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">Bat First</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tossDecision"
                      value="bowl"
                      checked={selectedTossDecision === 'bowl'}
                      onChange={(e) => setSelectedTossDecision(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">Bowl First</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowTossModal(false)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTossSubmit}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Toss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Wicket Type</h3>
              <button
                onClick={() => setShowWicketModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {wicketTypes.map((wicket) => (
                <button
                  key={wicket.id}
                  onClick={() => addWicket(wicket.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
                >
                  <div className="font-medium text-red-800">{wicket.label}</div>
                  <div className="text-sm text-red-600">{wicket.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {showExtraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Extra Type</h3>
              <button
                onClick={() => setShowExtraModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {extraTypes.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => addExtra(extra.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-yellow-50 border border-yellow-200 transition-colors"
                >
                  <div className="font-medium text-yellow-800">{extra.label}</div>
                  <div className="text-sm text-yellow-600">{extra.description}</div>
                  <div className="text-xs text-yellow-500 mt-1">
                    {extra.addsBall ? 'Counts as a ball' : 'Does not count as a ball'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player Selection Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select {playerModalType === 'batsman' ? 'Batsman' : 'Bowler'}
              </h3>
              <button
                onClick={() => setShowPlayerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {getAvailablePlayers(playerModalType === 'batsman' ? 'batting' : 'bowling').map((player, index) => (
                <button
                  key={index}
                  onClick={() => selectPlayer(player.name)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">{player.name}</div>
                  <div className="text-sm text-gray-600">{player.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMatch;