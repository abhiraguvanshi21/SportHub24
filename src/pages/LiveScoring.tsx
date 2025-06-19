import { useState, useEffect } from 'react';

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
};

const LiveScoring = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Mock data for demonstration
        const mockMatches: Match[] = [
          {
            id: '1',
            name: 'India vs Australia',
            matchType: 'ODI',
            score: [
              { inning: 'India', runs: 287, wickets: 4, overs: 45.2 },
              { inning: 'Australia', runs: 156, wickets: 7, overs: 28.4 }
            ],
            status: 'Live',
            venue: 'Melbourne Cricket Ground'
          },
          {
            id: '2',
            name: 'England vs New Zealand',
            matchType: 'T20',
            score: [
              { inning: 'England', runs: 178, wickets: 6, overs: 20 },
              { inning: 'New Zealand', runs: 89, wickets: 3, overs: 12.1 }
            ],
            status: 'Live',
            venue: 'Lord\'s Cricket Ground'
          }
        ];
        setMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();

    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedMatchId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🏏 Live Cricket Scores</h1>
          <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
            Real-time cricket scores and match updates from around the world
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live scores...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const isExpanded = expandedMatchId === match.id;

              return (
                <div
                  key={match.id}
                  className="bg-white shadow-lg p-6 rounded-xl border border-red-100 hover:shadow-xl transition cursor-pointer"
                  onClick={() => toggleExpand(match.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-lg text-gray-900">{match.name}</div>
                    <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      {match.matchType}
                    </span>
                  </div>
                  <div className="text-red-700 font-bold text-xl mb-2">
                    {match.score && match.score.length > 0
                      ? match.score[0].inning + ' - ' + match.score[0].runs + '/' + match.score[0].wickets + ` (${match.score[0].overs} ov)`
                      : 'Score not available'}
                  </div>
                  <div className="text-sm text-red-600 font-medium mt-2 flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                    {match.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">📍 {match.venue}</div>

                  {isExpanded && match.score && match.score.length > 1 && (
                    <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                      <strong className="text-red-700">Full Scoreboard:</strong>
                      <ul className="mt-2 space-y-2">
                        {match.score.map((s, index) => (
                          <li key={index} className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <span className="font-medium text-red-800">{s.inning}:</span> {s.runs}/{s.wickets} ({s.overs} ov)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveScoring;