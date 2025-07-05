import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Users,
  Eye,
  Video,
  Activity,
  User,
  Volume2,
  VolumeX,
  Maximize2,
  Trophy,
} from "lucide-react";

type MatchScore = {
  inning: string;
  runs: number;
  wickets: number;
  overs: number;
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
  ballByBall?: Array<{
    over: number;
    ball: number;
    runs: number;
    description: string;
    timestamp: string;
    isWicket?: boolean;
    bowler?: string;
    batsman?: string;
  }>;
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
};

const LiveScoring = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [, setSelectedMatch] = useState<Match | null>(null);
  const [streamStates, setStreamStates] = useState<{
    [key: string]: { muted: boolean; fullscreen: boolean };
  }>({});

  // Function to load matches from localStorage
  const loadMatches = () => {
    try {
      // Get user matches from localStorage
      const userMatches = JSON.parse(
        localStorage.getItem("userMatches") || "[]"
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
      const transformedUserMatches = userMatches.map(
        (match: {
          id?: string | number;
          team1?: string;
          team2?: string;
          format?: string;
          isLive?: boolean;
          status?: string;
          venue?: string;
          scorerName?: string;
          viewers?: number;
          hasLiveStream?: boolean;
          currentScore?: {
            runs: number;
            wickets: number;
            overs: number;
            balls: number;
            runRate: string;
            extras: number;
          };
          currentBatsmen?: {
            name: string;
            runs: number;
            balls: number;
            fours: number;
            sixes: number;
            strikeRate: string;
            isOnStrike: boolean;
          }[];
          currentBowler?: {
            name: string;
            overs: number;
            maidens: number;
            runs: number;
            wickets: number;
            economy: string;
            ballsBowled: number;
          };
          ballByBall?: {
            over: number;
            ball: number;
            batsman: string;
            bowler: string;
            runs: number;
            extras?: number;
            wicket?: boolean;
            description?: string;
          }[];
          lastBalls?: {
            runs: number;
            isWicket: boolean;
            ballNumber: number;
          }[];
        }) => ({
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
          currentScore: match.currentScore || {
            runs: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
            runRate: "0.00",
            extras: 0,
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
        })
      );

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

  const toggleExpand = (id: string) => {
    setExpandedMatchId((prev) => (prev === id ? null : id));
  };

  const selectMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const toggleMute = (matchId: string) => {
    setStreamStates((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        muted: !prev[matchId]?.muted,
      },
    }));
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
            matches with live video streams
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

                      {/* Live Video Stream */}
                      {match.hasLiveStream && (
                        <div
                          className="relative bg-gray-900"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Video className="h-16 w-16 mx-auto mb-4 opacity-75" />
                              <p className="text-lg font-medium">
                                Live Stream Active
                              </p>
                              <p className="text-sm opacity-75">
                                Streaming from {match.venue}
                              </p>
                            </div>
                          </div>

                          {/* Stream Controls */}
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                              onClick={() => toggleMute(match.id)}
                              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                            >
                              {streamStates[match.id]?.muted ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </button>
                            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
                              <Maximize2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Live Indicator */}
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            LIVE
                          </div>

                          {/* Viewer Count */}
                          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {match.viewers} viewers
                          </div>
                        </div>
                      )}

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

                      {/* Current Players */}
                      {match.currentBatsmen && match.currentBowler && (
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Batting
                              </h4>
                              {match.currentBatsmen.map((batsman, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded text-sm mb-2 ${
                                    batsman.isOnStrike
                                      ? "bg-red-100 border border-red-300"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      {batsman.name || `Batsman ${index + 1}`}
                                    </span>
                                    {batsman.isOnStrike && (
                                      <span className="text-xs bg-red-600 text-white px-1 rounded">
                                        *
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {batsman.runs}({batsman.balls}) • 4s:{" "}
                                    {batsman.fours} • 6s: {batsman.sixes}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Bowling
                              </h4>
                              <div className="p-2 bg-red-100 rounded border border-red-300">
                                <div className="font-medium text-sm">
                                  {match.currentBowler.name || "Current Bowler"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {Math.floor(
                                    match.currentBowler.ballsBowled / 6
                                  )}
                                  .{match.currentBowler.ballsBowled % 6} overs •
                                  {match.currentBowler.runs}/
                                  {match.currentBowler.wickets} • Econ:{" "}
                                  {match.currentBowler.economy}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* This Over */}
                          {match.lastBalls && match.lastBalls.length > 0 && (
                            <div className="mb-4">
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
                                          : typeof ball === "number" &&
                                            ball >= 4
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

                          {/* Ball by Ball Commentary */}
                          {match.ballByBall && match.ballByBall.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Live Commentary
                              </h4>
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {match.ballByBall
                                  .slice(-5)
                                  .reverse()
                                  .map((ball, index) => (
                                    <div
                                      key={index}
                                      className={`text-xs p-2 rounded ${
                                        ball.isWicket
                                          ? "bg-red-100 border border-red-200"
                                          : "bg-gray-50"
                                      }`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <span className="font-medium">
                                          {ball.over}.{ball.ball}:{" "}
                                          {ball.description}
                                        </span>
                                        <span className="text-gray-500">
                                          {formatTimeAgo(ball.timestamp)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <button
                          onClick={() => selectMatch(match)}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          View Full Scorecard
                        </button>
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
                  {professionalMatches.map((match) => {
                    const isExpanded = expandedMatchId === match.id;

                    return (
                      <div
                        key={match.id}
                        className="bg-white shadow-lg p-6 rounded-xl border border-red-100 hover:shadow-xl transition cursor-pointer"
                        onClick={() => toggleExpand(match.id)}
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

                        {isExpanded &&
                          match.score &&
                          match.score.length > 1 && (
                            <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                              <strong className="text-red-700">
                                Full Scoreboard:
                              </strong>
                              <ul className="mt-2 space-y-2">
                                {match.score.map((s, index) => (
                                  <li
                                    key={index}
                                    className="bg-red-50 p-3 rounded-lg border border-red-100"
                                  >
                                    <span className="font-medium text-red-800">
                                      {s.inning}:
                                    </span>{" "}
                                    {s.runs}/{s.wickets} ({s.overs} ov)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    );
                  })}
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
