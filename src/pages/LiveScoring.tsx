import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Users,
  Eye,
  Video,
  Activity,
  Target,
  User,
  Trophy,
  Trash2,
  X,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

type MatchScore = {
  inning: string;
  runs: number;
  wickets: number;
  overs: number;
};

type Player = {
  id: string;
  name: string;
  role: "batsman" | "bowler" | "allrounder" | "wicketkeeper";
};

type BallByBall = {
  over: number;
  ball: number;
  runs: number;
  description: string;
  timestamp: string;
  isWicket?: boolean;
  isExtra?: boolean;
  extraType?: string;
  bowler?: string;
  batsman?: string;
  wicketType?: string;
};

type Match = {
  id: string;
  name: string;
  matchType: string;
  score?: MatchScore[];
  status: string;
  venue: string;
  isUserMatch?: boolean;
  scorer?: string;
  viewers?: number;
  hasLiveStream?: boolean;
  streamUrl?: string;
  isLive?: boolean;
  currentScore?: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    runRate: number | string;
    extras: number;
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  currentBatsmen?: Array<{
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number | string;
    isOnStrike: boolean;
  }>;
  currentBowler?: {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number | string;
    ballsBowled: number;
  };
  ballByBall?: BallByBall[];
  lastBalls?: (number | string)[];
  team1?: string;
  team2?: string;
  battingTeam?: string;
  bowlingTeam?: string;
  title?: string;
  format?: string;
  scorerName?: string;
  publishedAt?: string;
  lastUpdated?: string;
  createdBy?: string;
  team1Players?: Player[];
  team2Players?: Player[];
  tossWinner?: string;
  tossDecision?: string;
  innings?: Array<{
    team: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    extras: number;
    batsmen: Array<{
      name: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      status: string;
      strikeRate: number;
    }>;
    bowlers: Array<{
      name: string;
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
      economy: number;
    }>;
  }>;
};

const LiveScoring = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState<{
    [key: string]: { muted: boolean; fullscreen: boolean };
  }>({});
  const [activeTab, setActiveTab] = useState("live");

  // Function to load matches from localStorage
  const loadMatches = () => {
    try {
      // Get user matches from localStorage
      const userMatches = JSON.parse(
        localStorage.getItem("userMatches") || "[]"
      );
      const currentUser = JSON.parse(
        localStorage.getItem("sportHub24User") || "{}"
      );

      // Mock professional matches for demonstration
      const professionalMatches: Match[] = [
        {
          id: "pro-1",
          name: "India vs Australia",
          matchType: "ODI",
          score: [
            { inning: "India", runs: 287, wickets: 4, overs: 45.2 },
            { inning: "Australia", runs: 156, wickets: 7, overs: 28.4 },
          ],
          status: "Live",
          venue: "Melbourne Cricket Ground",
          isUserMatch: false,
          viewers: 15420,
        },
        {
          id: "pro-2",
          name: "England vs New Zealand",
          matchType: "T20",
          score: [
            { inning: "England", runs: 178, wickets: 6, overs: 20 },
            { inning: "New Zealand", runs: 89, wickets: 3, overs: 12.1 },
          ],
          status: "Live",
          venue: "Lord's Cricket Ground",
          isUserMatch: false,
          viewers: 8930,
        },
      ];

      // Transform user matches to match the expected format
      const transformedUserMatches = userMatches.map((match: Match) => ({
        ...match,
        id: match.id?.toString() || Date.now().toString(),
        name: `${match.team1 || "Team 1"} vs ${match.team2 || "Team 2"}`,
        matchType: match.format || "T20",
        status: match.isLive ? "Live" : match.status || "Completed",
        venue: match.venue || "Local Ground",
        isUserMatch: true,
        scorer: match.scorerName || "Unknown Scorer",
        viewers: match.viewers || Math.floor(Math.random() * 500) + 50,
        hasLiveStream: match.hasLiveStream || false,
        streamUrl: match.isLive ? `stream-${match.id}` : undefined,
        createdBy: match.createdBy || currentUser.id,
        currentScore: match.currentScore || {
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          runRate: "0.00",
          extras: 0,
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
        },
        currentBatsmen: match.currentBatsmen || [
          {
            name: "Batsman 1",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: "0.00",
            isOnStrike: true,
          },
          {
            name: "Batsman 2",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: "0.00",
            isOnStrike: false,
          },
        ],
        currentBowler: match.currentBowler || {
          name: "Bowler",
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: "0.00",
          ballsBowled: 0,
        },
        ballByBall: match.ballByBall || [],
        lastBalls: match.lastBalls || [],
      }));

      // Combine all matches
      const allMatches = [...transformedUserMatches, ...professionalMatches];
      setMatches(allMatches);

      console.log("Loaded matches:", allMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadMatches();

    // Set up interval to check for updates every 1 second for real-time updates
    const interval = setInterval(() => {
      loadMatches();
    }, 1000);

    // Listen for storage changes (when user updates match in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userMatches") {
        console.log("Storage changed, reloading matches...");
        loadMatches();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const deleteMatch = (matchId: string) => {
    try {
      const userMatches = JSON.parse(
        localStorage.getItem("userMatches") || "[]"
      );

      const updatedMatches = userMatches.filter(
        (match: { id: string | number }) => match.id.toString() !== matchId
      );

      localStorage.setItem("userMatches", JSON.stringify(updatedMatches));

      // Reload matches
      loadMatches();

      // Close modal and clear selection
      setShowDeleteModal(false);
      setMatchToDelete(null);
      if (selectedMatch?.id === matchId) {
        setSelectedMatch(null);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const canDeleteMatch = (match: Match) => {
    const currentUser = JSON.parse(
      localStorage.getItem("sportHub24User") || "{}"
    );
    return (
      match.isUserMatch &&
      match.createdBy === currentUser.id &&
      match.status !== "Completed"
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const liveMatches = matches.filter((match) => match.status === "Live");
  const userLiveMatches = liveMatches.filter((match) => match.isUserMatch);
  const professionalMatches = liveMatches.filter((match) => !match.isUserMatch);

  // Detailed Match View Component
  const DetailedMatchView = ({ match }: { match: Match }) => {
    const canDelete = canDeleteMatch(match);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{match.name}</h2>
                <p className="text-red-100">{match.venue}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    LIVE
                  </span>
                  <span className="text-red-100">{match.format}</span>
                  <div className="flex items-center text-red-100">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{match.viewers} viewers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {canDelete && (
                  <button
                    onClick={() => {
                      setMatchToDelete(match.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg transition-colors"
                    title="Delete Match"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {["live", "scorecard", "commentary"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "live" && (
              <div className="space-y-6">
                {/* Current Score */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 mb-2">
                        {match.currentScore?.runs}/{match.currentScore?.wickets}
                      </div>
                      <div className="text-gray-600">
                        {Math.floor((match.currentScore?.balls || 0) / 6)}.
                        {(match.currentScore?.balls || 0) % 6} overs
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        RR: {match.currentScore?.runRate}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700 mb-2">
                        {match.currentScore?.extras}
                      </div>
                      <div className="text-gray-600">Extras</div>
                      <div className="text-xs text-gray-500 mt-1">
                        W:{match.currentScore?.wides} NB:
                        {match.currentScore?.noBalls} B:
                        {match.currentScore?.byes} LB:
                        {match.currentScore?.legByes}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-800 mb-2">
                        {match.battingTeam || "Batting"}
                      </div>
                      <div className="text-gray-600">vs</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {match.bowlingTeam || "Bowling"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Players */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Batsmen */}
                  <div className="bg-white border border-red-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-red-600" />
                      Current Batsmen
                    </h3>
                    <div className="space-y-3">
                      {match.currentBatsmen?.map((batsman, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            batsman.isOnStrike
                              ? "bg-red-50 border-red-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{batsman.name}</span>
                            {batsman.isOnStrike && (
                              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                                *
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="font-bold text-red-600">
                                {batsman.runs}
                              </div>
                              <div className="text-xs text-gray-500">Runs</div>
                            </div>
                            <div>
                              <div className="font-bold">{batsman.balls}</div>
                              <div className="text-xs text-gray-500">Balls</div>
                            </div>
                            <div>
                              <div className="font-bold">{batsman.fours}</div>
                              <div className="text-xs text-gray-500">4s</div>
                            </div>
                            <div>
                              <div className="font-bold">{batsman.sixes}</div>
                              <div className="text-xs text-gray-500">6s</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            Strike Rate: {batsman.strikeRate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Bowler */}
                  <div className="bg-white border border-red-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-red-700" />
                      Current Bowler
                    </h3>
                    <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                      <div className="font-medium text-lg mb-3">
                        {match.currentBowler?.name}
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="font-bold text-red-600">
                            {Math.floor(
                              (match.currentBowler?.ballsBowled || 0) / 6
                            )}
                            .{(match.currentBowler?.ballsBowled || 0) % 6}
                          </div>
                          <div className="text-xs text-gray-500">Overs</div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {match.currentBowler?.runs}
                          </div>
                          <div className="text-xs text-gray-500">Runs</div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {match.currentBowler?.wickets}
                          </div>
                          <div className="text-xs text-gray-500">Wickets</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Economy: {match.currentBowler?.economy} | Maidens:{" "}
                        {match.currentBowler?.maidens}
                      </div>
                    </div>
                  </div>
                </div>

                {/* This Over */}
                <div className="bg-white border border-red-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    This Over
                  </h3>
                  <div className="flex space-x-3">
                    {Array.from({ length: 6 }, (_, index) => {
                      const ball = match.lastBalls?.[index];
                      return (
                        <div
                          key={index}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                            ball === "W"
                              ? "bg-red-600 text-white border-red-600"
                              : ball === "Wd" || ball === "Nb"
                              ? "bg-yellow-500 text-white border-yellow-500"
                              : typeof ball === "number" && ball >= 4
                              ? "bg-red-100 text-red-700 border-red-300"
                              : ball !== undefined
                              ? "bg-gray-100 text-gray-700 border-gray-300"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {ball !== undefined ? ball : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "scorecard" && (
              <div className="space-y-6">
                {/* Innings Summary */}
                {match.innings?.map((inning, index) => (
                  <div
                    key={index}
                    className="bg-white border border-red-200 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {inning.team} - {inning.runs}/{inning.wickets} (
                      {Math.floor(inning.balls / 6)}.{inning.balls % 6} overs)
                    </h3>

                    {/* Batting Scorecard */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Batting
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-red-50 border-b border-red-200">
                              <th className="text-left p-2">Batsman</th>
                              <th className="text-center p-2">R</th>
                              <th className="text-center p-2">B</th>
                              <th className="text-center p-2">4s</th>
                              <th className="text-center p-2">6s</th>
                              <th className="text-center p-2">SR</th>
                              <th className="text-left p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inning.batsmen?.map((batsman, bIndex) => (
                              <tr
                                key={bIndex}
                                className="border-b border-gray-100"
                              >
                                <td className="p-2 font-medium">
                                  {batsman.name}
                                </td>
                                <td className="text-center p-2">
                                  {batsman.runs}
                                </td>
                                <td className="text-center p-2">
                                  {batsman.balls}
                                </td>
                                <td className="text-center p-2">
                                  {batsman.fours}
                                </td>
                                <td className="text-center p-2">
                                  {batsman.sixes}
                                </td>
                                <td className="text-center p-2">
                                  {batsman.strikeRate.toFixed(2)}
                                </td>
                                <td className="p-2 text-gray-600">
                                  {batsman.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Bowling Scorecard */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Bowling
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-red-50 border-b border-red-200">
                              <th className="text-left p-2">Bowler</th>
                              <th className="text-center p-2">O</th>
                              <th className="text-center p-2">M</th>
                              <th className="text-center p-2">R</th>
                              <th className="text-center p-2">W</th>
                              <th className="text-center p-2">Econ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inning.bowlers?.map((bowler, bIndex) => (
                              <tr
                                key={bIndex}
                                className="border-b border-gray-100"
                              >
                                <td className="p-2 font-medium">
                                  {bowler.name}
                                </td>
                                <td className="text-center p-2">
                                  {bowler.overs}
                                </td>
                                <td className="text-center p-2">
                                  {bowler.maidens}
                                </td>
                                <td className="text-center p-2">
                                  {bowler.runs}
                                </td>
                                <td className="text-center p-2">
                                  {bowler.wickets}
                                </td>
                                <td className="text-center p-2">
                                  {bowler.economy.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "commentary" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Ball-by-Ball Commentary
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {match.ballByBall
                    ?.slice()
                    .reverse()
                    .map((ball, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          ball.isWicket
                            ? "bg-red-50 border-red-200"
                            : ball.isExtra
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-lg">
                            {ball.over}.{ball.ball}: {ball.description}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(ball.timestamp)}
                          </span>
                        </div>
                        {ball.bowler && (
                          <div className="text-sm text-gray-600">
                            Bowler: {ball.bowler} | Batsman: {ball.batsman}
                          </div>
                        )}
                      </div>
                    ))}
                  {(!match.ballByBall || match.ballByBall.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No commentary available yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            🏏 Live Cricket Scores
          </h1>
          <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-8">
            Real-time cricket scores from professional tournaments and community
            matches with comprehensive scorecards
          </p>
          <div className="flex items-center justify-center space-x-6 text-red-100">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-300 rounded-full mr-2 animate-pulse"></div>
              <span>{liveMatches.length} Live Matches</span>
            </div>
            <div className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              <span>
                {matches.filter((m) => m.hasLiveStream).length} Live Streams
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {matches.reduce((sum, m) => sum + (m.viewers || 0), 0)} Total
                Viewers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bg-white border-b border-red-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {userLiveMatches.length}
              </div>
              <div className="text-sm text-gray-600">Community Live</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">
                {professionalMatches.length}
              </div>
              <div className="text-sm text-gray-600">Professional Live</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {matches.filter((m) => m.hasLiveStream).length}
              </div>
              <div className="text-sm text-gray-600">Live Streams</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">
                {matches.reduce((sum, m) => sum + (m.viewers || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Viewers</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live scores...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Community Live Matches */}
            {userLiveMatches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-2 text-red-600" />
                    Community Live Matches
                    <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                      {userLiveMatches.length} Live
                    </span>
                  </h2>
                  <Link
                    to="/add-match"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Scoring
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userLiveMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-white shadow-xl rounded-2xl overflow-hidden border border-red-100 hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Match Header */}
                      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{match.name}</h3>
                            <p className="text-red-100 text-sm">
                              {match.venue}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </span>
                            {match.hasLiveStream && (
                              <span className="bg-red-700 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <Video className="w-3 h-3 mr-1" />
                                STREAM
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-red-100">
                            <User className="h-4 w-4 mr-1" />
                            <span>Scored by {match.scorer}</span>
                          </div>
                          <div className="flex items-center text-red-100">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{match.viewers} viewers</span>
                          </div>
                        </div>
                      </div>

                      {/* Current Score */}
                      {match.currentScore && (
                        <div className="p-6 bg-red-50 border-b border-red-200">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                              {match.currentScore.runs}/
                              {match.currentScore.wickets}
                            </div>
                            <div className="text-gray-600 mb-2">
                              {Math.floor(match.currentScore.balls / 6)}.
                              {match.currentScore.balls % 6} overs
                            </div>
                            <div className="text-sm text-gray-500">
                              RR: {match.currentScore.runRate} | Extras:{" "}
                              {match.currentScore.extras}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* This Over */}
                      {match.lastBalls && match.lastBalls.length > 0 && (
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            This Over
                          </h4>
                          <div className="flex space-x-2">
                            {Array.from({ length: 6 }, (_, index) => {
                              const ball = match.lastBalls![index];
                              return (
                                <div
                                  key={index}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                    ball === "W"
                                      ? "bg-red-600 text-white border-red-600"
                                      : ball === "Wd" || ball === "Nb"
                                      ? "bg-yellow-500 text-white border-yellow-500"
                                      : typeof ball === "number" && ball >= 4
                                      ? "bg-red-100 text-red-700 border-red-300"
                                      : ball !== undefined
                                      ? "bg-gray-100 text-gray-700 border-gray-300"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  {ball !== undefined ? ball : ""}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Latest Commentary */}
                      {match.ballByBall && match.ballByBall.length > 0 && (
                        <div className="p-4 border-b border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Latest
                          </h4>
                          <div className="text-sm text-gray-600">
                            {
                              match.ballByBall[match.ballByBall.length - 1]
                                .description
                            }
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="p-4 bg-gray-50 flex space-x-2">
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Full Scorecard
                        </button>
                        {canDeleteMatch(match) && (
                          <button
                            onClick={() => {
                              setMatchToDelete(match.id);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors"
                            title="Delete Match"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Matches */}
            {professionalMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-red-600" />
                  Professional Matches
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                    {professionalMatches.length} Live
                  </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {professionalMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-white shadow-lg p-6 rounded-xl border border-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-lg text-gray-900">
                          {match.name}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                            {match.matchType}
                          </span>
                          <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-medium animate-pulse">
                            LIVE
                          </span>
                        </div>
                      </div>
                      <div className="text-red-700 font-bold text-xl mb-2">
                        {match.score && match.score.length > 0
                          ? match.score[0].inning +
                            " - " +
                            match.score[0].runs +
                            "/" +
                            match.score[0].wickets +
                            ` (${match.score[0].overs} ov)`
                          : "Score not available"}
                      </div>
                      <div className="text-sm text-red-600 font-medium mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                          {match.status}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{match.viewers?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        📍 {match.venue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Live Matches */}
            {liveMatches.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Activity className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Live Matches
                </h3>
                <p className="text-gray-600 mb-6">
                  Start scoring your match to see it appear here live!
                </p>
                <Link
                  to="/add-match"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Scoring Your Match
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Match View Modal */}
      {selectedMatch && <DetailedMatchView match={selectedMatch} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Match
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this match? This action cannot
                be undone and all match data will be lost.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => matchToDelete && deleteMatch(matchToDelete)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to See Your Match Here?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Start scoring your cricket match and share it with the world through
            live streaming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-match"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all duration-200 inline-flex items-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Live Scoring
            </Link>
            <Link
              to="/user-scoring"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-200 inline-flex items-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Browse All Matches
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiveScoring;
